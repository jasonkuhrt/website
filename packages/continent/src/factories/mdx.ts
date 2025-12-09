import { compile } from '@mdx-js/mdx'
import type { CompileOptions } from '@mdx-js/mdx'
import { Effect, Schema as S } from 'effect'
import type { Struct } from 'effect/Schema'
import matter from 'gray-matter'
import { Asset, AssetsField, Content } from '../content.js'
import * as SecondaryKey from '../secondary-key.js'
import * as Stores from '../stores/_.js'
import type { DirData } from '../stores/dir.js'

// ============================================================================
// Types
// ============================================================================

/** Re-export DirData for external use */
export type { DirData } from '../stores/dir.js'

/** Base record fields produced by all Mdx content */
type MdxBaseRecord = {
  slug: string
  title: string
  date: Date
  compiledJs: string
  assets: Asset[]
}

/** Full Mdx record type: base fields + custom frontmatter */
type MdxRecord<$FrontmatterFields extends Struct.Fields> = MdxBaseRecord & Struct.Type<$FrontmatterFields>

/** Configuration for Mdx content factory */
export interface MdxConfig<$FrontmatterFields extends Struct.Fields = {}> {
  /** Glob pattern for finding MDX files. Default: `content/<name>/*.mdx` */
  glob?: string

  /** Extract slug from source data. Default: `(source) => source.stem` */
  slug?: (source: DirData) => string

  /** Base path for assets. Default: `content/<name>/<slug>` */
  assetBasePath?: (slug: string, source: DirData) => string

  /** Additional frontmatter fields beyond title/date. Default: `{}` */
  frontmatter?: $FrontmatterFields

  /** Custom rehype plugins to apply during MDX compilation */
  rehypePlugins?: CompileOptions['rehypePlugins']
}

// ============================================================================
// MDX Processing (internal)
// ============================================================================

interface ProcessMdxConfig {
  remarkPlugins?: CompileOptions['remarkPlugins']
  rehypePlugins?: CompileOptions['rehypePlugins']
  assetBasePath?: string
}

const extractAssetPaths = (content: string, basePath: string): string[] => {
  const paths: string[] = []
  const srcPattern = /src="\.\/([^"]+)"/g
  const mdPattern = /\]\(\.\/([^)]+)\)/g

  let match
  while ((match = srcPattern.exec(content)) !== null) paths.push(`${basePath}/${match[1]}`)
  while ((match = mdPattern.exec(content)) !== null) paths.push(`${basePath}/${match[1]}`)

  return [...new Set(paths)]
}

const rewriteAssetUrls = (content: string, basePath: string): string => {
  return content
    .replace(/src="\.\/([^"]+)"/g, `src="/${basePath}/$1"`)
    .replace(/\]\(\.\/([^)]+)\)/g, `](/${basePath}/$1)`)
}

const processMdx = <$a, $i>(
  source: string,
  schema: S.Schema<$a, $i>,
  config: ProcessMdxConfig = {},
): Effect.Effect<{ frontmatter: $a; compiledJs: string; assets: Asset[] }> =>
  Effect.gen(function*() {
    const { data, content } = matter(source)
    const frontmatter = S.decodeUnknownSync(schema)(data)

    const assets: Asset[] = []
    let processedContent = content

    if (config.assetBasePath) {
      const paths = extractAssetPaths(content, config.assetBasePath)
      assets.push(...paths.map((sourcePath) => ({ sourcePath })))
      processedContent = rewriteAssetUrls(content, config.assetBasePath)
    }

    const compiled = yield* Effect.promise(() =>
      compile(processedContent, {
        outputFormat: 'function-body',
        remarkPlugins: config.remarkPlugins,
        rehypePlugins: config.rehypePlugins,
      })
    )

    return {
      frontmatter,
      compiledJs: String(compiled),
      assets,
    }
  })

// ============================================================================
// FlexibleDate Schema
// ============================================================================

/** Date schema that accepts string or Date input */
const FlexibleDate = S.transform(
  S.Union(S.DateFromSelf, S.String),
  S.DateFromSelf,
  {
    decode: (input) => input instanceof Date ? input : new Date(input),
    encode: (date) => date,
  },
)

// ============================================================================
// Slug Extraction Utilities
// ============================================================================

/**
 * Detect if glob pattern is directory-based (variable is dir name, not filename).
 *
 * Directory-based: `content/essay/＊/content.mdx` - variable part is directory
 * File-based: `content/drivel/＊.mdx` - variable part is filename
 *
 * Detection: If glob contains `＊/` followed by a specific filename (no `＊`), it's directory-based.
 */
const isDirectoryBasedGlob = (glob: string): boolean => {
  // Match patterns like `*/content.mdx` or `*/index.mdx` (star-slash followed by non-star filename)
  return /\*\/[^*]+\.mdx$/.test(glob)
}

/**
 * Extract directory name from path.
 * For path `content/essay/2024-01-15_my-post/content.mdx`, returns `2024-01-15_my-post`
 */
const getDirName = (path: string): string => path.split('/').at(-2)!

/**
 * Strip date prefix from string.
 * `2024-01-15_my-post` → `my-post`
 */
const stripDatePrefix = (str: string): string => str.replace(/^\d{4}-\d{2}-\d{2}_/, '')

/**
 * Create default slug extractor based on glob pattern type.
 *
 * - Directory-based globs (`＊/content.mdx`): extract parent dir name, strip date prefix
 * - File-based globs (`＊.mdx`): use stem, strip date prefix
 */
const createDefaultSlugFn = (glob: string): (source: DirData) => string => {
  if (isDirectoryBasedGlob(glob)) return (source) => stripDatePrefix(getDirName(source.path))
  return (source) => stripDatePrefix(source.stem)
}

/**
 * Create default asset base path function based on glob pattern type.
 *
 * - Directory-based globs: use parent directory path (for co-located assets)
 * - File-based globs: use `content/{name}/{slug}`
 */
const createDefaultAssetBasePathFn = (glob: string, name: string): (slug: string, source: DirData) => string => {
  if (isDirectoryBasedGlob(glob)) return (_slug, source) => source.path.split('/').slice(0, -1).join('/')
  return (slug) => `content/${name}/${slug}`
}

// ============================================================================
// Factory
// ============================================================================

/** Base frontmatter fields (always included) */
const BaseFrontmatter = {
  title: S.String,
  date: FlexibleDate,
}

/**
 * Create an MDX content collection with standard structure.
 *
 * All MDX content has:
 * - `slug` (unique key)
 * - `title` (from frontmatter)
 * - `date` (from frontmatter)
 * - `compiledJs` (MDX compiled to JS)
 * - `assets` (extracted asset paths)
 * - Plus any custom frontmatter fields
 *
 * **Slug extraction** is automatic based on glob pattern:
 * - Directory-based (`＊/content.mdx`): extracts parent directory name
 * - File-based (`＊.mdx`): extracts filename stem
 * - Date prefixes (`2024-01-15_`) are stripped automatically
 *
 * @example
 * ```typescript
 * // Minimal - all defaults (file-based)
 * export const Drivel = Mdx('drivel')
 * // Uses: content/drivel/＊.mdx
 * // Slug: "2024-01-15_my-post" → "my-post"
 *
 * // Directory-based (assets co-located with content)
 * export const Essay = Mdx('essay', {
 *   glob: 'content/essay/＊/content.mdx',
 * })
 * // Uses: content/essay/2024-01-15_my-post/content.mdx
 * // Slug: directory name "2024-01-15_my-post" → "my-post"
 * // Assets: co-located in same directory
 *
 * // Additional frontmatter fields
 * export const Scribble = Mdx('scribble', {
 *   frontmatter: { tags: S.optional(S.Array(S.String)) },
 * })
 * ```
 */
export const Mdx = <
  $Name extends string,
  $FrontmatterFields extends Struct.Fields = {},
>(
  name: $Name,
  config?: MdxConfig<$FrontmatterFields>,
): Content.CollectionClass<
  $Name,
  Stores.Dir,
  MdxRecord<$FrontmatterFields>,
  'slug'
> => {
  const glob = config?.glob ?? `content/${name}/*.mdx`
  const slugFn = config?.slug ?? createDefaultSlugFn(glob)
  const assetBasePathFn = config?.assetBasePath ?? createDefaultAssetBasePathFn(glob, name)
  const extraFrontmatter = (config?.frontmatter ?? {}) as $FrontmatterFields

  const frontmatterSchema = S.Struct({
    ...BaseFrontmatter,
    ...extraFrontmatter,
  })

  // Cast config to bypass complex generic inference; return type is manually specified
  return Content(name, {
    // BUMP THIS when factory processing changes (plugins, schema, etc.)
    // v2: Added rehypeImageDimensions plugin
    version: 2,
    store: Stores.dir({
      glob,
    }),
    schema: {
      slug: SecondaryKey.SecondaryKey(S.String),
      title: S.String,
      date: S.Date,
      compiledJs: S.String,
      assets: AssetsField,
      ...extraFrontmatter,
    },
    map(source: DirData) {
      const slug = slugFn(source)
      const assetBasePath = assetBasePathFn(slug, source)

      return processMdx(
        source.content,
        frontmatterSchema as any,
        { assetBasePath, rehypePlugins: config?.rehypePlugins },
      ).pipe(
        Effect.map(({ frontmatter, compiledJs, assets }) => ({
          slug,
          ...(frontmatter as object),
          compiledJs,
          assets,
        })),
      )
    },
  } as any) as any
}

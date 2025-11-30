import * as S from 'effect/Schema'
import { existsSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { globSync } from 'tinyglobby'

/**
 * Base schema - all content types must have an id.
 */
export const BaseSchema = S.Struct({
  id: S.String,
})

/**
 * Entry types - base schema merged with user schema.
 */
export namespace Entry {
  export type Encoded<$Schema extends S.Schema.AnyNoContext = S.Schema<{}, {}>> =
    & S.Schema.Encoded<typeof BaseSchema>
    & S.Schema.Encoded<$Schema>
  export type Type<$Schema extends S.Schema.AnyNoContext = S.Schema<{}, {}>> =
    & S.Schema.Type<typeof BaseSchema>
    & S.Schema.Type<$Schema>
}

/**
 * Default ignore patterns applied to all strategies.
 */
const DEFAULT_IGNORE = ['_*']

/**
 * File strategy - entries are individual files at root.
 */
export type FileStrategy = {
  type: 'file'
  root: string
  entry: string
  /** Patterns to ignore. Defaults to ['_*']. */
  ignore?: string[]
}

/**
 * Dir strategy - entries are directories containing an entry file.
 * Assets are automatically all other files in the directory.
 */
export type DirStrategy = {
  type: 'dir'
  root: string
  entry: string
  /** Patterns to ignore. Defaults to ['_*']. */
  ignore?: string[]
}

/**
 * Discovery strategy.
 */
export type Strategy = FileStrategy | DirStrategy

/**
 * Load context passed to loader function.
 * Both strategies always provide assets (empty array if none).
 */
export type LoadContext =
  | { filePath: string; strategy: FileStrategy; assets: string[] }
  | { filePath: string; strategy: DirStrategy; assets: string[] }

/**
 * Loader function type.
 */
export type LoadFn<$Schema extends S.Schema.AnyNoContext> = (
  context: LoadContext,
) => Entry.Encoded<$Schema> | Promise<Entry.Encoded<$Schema>>

/**
 * Input configuration for defining a content type.
 */
export interface Input<$Schema extends S.Schema.AnyNoContext> {
  name: string
  schema: $Schema
  /** Content source root. Discarded when computing public asset paths. */
  root?: string
  discover: Strategy | Strategy[]
  load: LoadFn<$Schema>
}

/**
 * Asset copy mapping.
 */
export interface AssetMapping {
  src: string
  dest: string
}

/**
 * Internal entry metadata for tracking which strategy loaded an entry.
 */
type EntryMeta =
  | { strategy: 'file'; assetDirPath: string | null }
  | { strategy: 'dir'; dirPath: string }

/**
 * Internal cache entry.
 */
interface LoadedEntry {
  entry: Entry.Type
  meta: EntryMeta
}

/**
 * A content definition with type-safe query methods.
 */
export interface Definition<$Schema extends S.Schema.AnyNoContext = any> {
  readonly name: string
  list(): Promise<Entry.Type<$Schema>[]>
  get(id: string): Promise<Entry.Type<$Schema> | null>
  getAssetMappings(): Promise<AssetMapping[]>
  getWatchPaths(): string[]
  getAssetsRootPath(entry: Entry.Type<$Schema>): string | null
}

/**
 * Define a content type with file or directory-based discovery strategies.
 */
export const define = <$Schema extends S.Schema.AnyNoContext>(
  input: Input<$Schema>,
): Definition<$Schema> => {
  const internalSchema = S.extend(BaseSchema, input.schema)
  const strategies = Array.isArray(input.discover) ? input.discover : [input.discover]

  let cache: LoadedEntry[] | null = null

  const loadAll = async (): Promise<Array<LoadedEntry>> => {
    if (cache) return cache

    const results: Array<LoadedEntry> = []

    for (const strategy of strategies) {
      // Compute full content path by joining definition root with strategy root
      const contentRoot = join(input.root ?? '', strategy.root)

      if (strategy.type === 'file') {
        // File strategy: find files matching entry pattern
        const matches = globSync(strategy.entry, {
          cwd: contentRoot,
          ignore: strategy.ignore ?? DEFAULT_IGNORE,
        })

        for (const file of matches) {
          const filePath = join(contentRoot, file)

          // Check for sibling asset directory (same name without extension)
          const fileBasename = basename(file, '.mdx')
          const assetDirPath = join(contentRoot, fileBasename)
          const hasAssetDir = existsSync(assetDirPath)
          const assets = hasAssetDir ?
            globSync('*', { cwd: assetDirPath, onlyFiles: true }) :
            []

          const raw = await input.load({
            filePath,
            strategy,
            assets,
          })

          try {
            const entry = S.decodeUnknownSync(internalSchema as any)(raw) as Entry.Type<$Schema>
            results.push({
              entry,
              meta: { strategy: 'file', assetDirPath: hasAssetDir ? assetDirPath : null },
            })
          } catch (error) {
            throw new Error(
              `Content validation failed in ${input.name}:\n` +
                `  File: ${filePath}\n` +
                `  Error: ${error instanceof Error ? error.message : String(error)}`,
            )
          }
        }
      } else {
        // Dir strategy: find directories containing entry file
        const entryFiles = globSync(`*/${strategy.entry}`, {
          cwd: contentRoot,
          ignore: strategy.ignore ?? DEFAULT_IGNORE,
        })

        for (const entryFile of entryFiles) {
          const dirName = dirname(entryFile)
          const dirPath = join(contentRoot, dirName)
          const filePath = join(contentRoot, entryFile)

          // Discover assets (everything except entry file)
          const allFiles = globSync('*', { cwd: dirPath, onlyFiles: true })
          const assets = allFiles.filter(f => f !== strategy.entry)

          const raw = await input.load({
            filePath,
            strategy,
            assets,
          })

          try {
            const entry = S.decodeUnknownSync(internalSchema as any)(raw) as Entry.Type<$Schema>
            results.push({
              entry,
              meta: {
                strategy: 'dir',
                dirPath,
              },
            })
          } catch (error) {
            throw new Error(
              `Content validation failed in ${input.name}:\n` +
                `  File: ${filePath}\n` +
                `  Error: ${error instanceof Error ? error.message : String(error)}`,
            )
          }
        }
      }
    }

    cache = results
    return results
  }

  // Find strategies for computing asset URLs
  const getFileStrategy = (): FileStrategy | null => {
    for (const s of strategies) if (s.type === 'file') return s
    return null
  }

  const getDirStrategy = (): DirStrategy | null => {
    for (const s of strategies) if (s.type === 'dir') return s
    return null
  }

  return {
    name: input.name,

    list: async () => (await loadAll()).map(r => r.entry) as any,

    get: async (id) => {
      const all = await loadAll()
      return (all.find(r => r.entry.id === id)?.entry ?? null) as any
    },

    getWatchPaths: () => {
      return [...new Set(strategies.map(s => join(input.root ?? '', s.root)))]
    },

    getAssetMappings: async () => {
      const assetMappings: AssetMapping[] = []
      const all = await loadAll()

      for (const { entry, meta } of all) {
        if (meta.strategy === 'file' && meta.assetDirPath) {
          const fileStrategy = getFileStrategy()
          if (!fileStrategy) continue

          const assets = globSync('*', { cwd: meta.assetDirPath, onlyFiles: true })
          for (const asset of assets) {
            assetMappings.push({
              src: join(meta.assetDirPath, asset),
              dest: join(fileStrategy.root, entry.id, asset),
            })
          }
        } else if (meta.strategy === 'dir') {
          const dirStrategy = getDirStrategy()
          if (!dirStrategy) continue

          // Get assets in the directory
          const allFiles = globSync('*', { cwd: meta.dirPath, onlyFiles: true })
          const assets = allFiles.filter(f => f !== dirStrategy.entry)

          for (const asset of assets) {
            assetMappings.push({
              src: join(meta.dirPath, asset),
              dest: join(dirStrategy.root, entry.id, asset),
            })
          }
        }
      }

      return assetMappings
    },

    getAssetsRootPath: (entry) => {
      // Try dir strategy first, then file strategy
      const dirStrategy = getDirStrategy()
      if (dirStrategy) return `${dirStrategy.root}/${entry.id}`

      const fileStrategy = getFileStrategy()
      if (fileStrategy) return `${fileStrategy.root}/${entry.id}`

      return null
    },
  }
}

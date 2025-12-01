import { compile } from '@mdx-js/mdx'
import type { CompileOptions } from '@mdx-js/mdx'
import matter from 'gray-matter'
import * as S from 'effect/Schema'

/**
 * MDX compilation configuration.
 */
export interface MdxConfig {
  remarkPlugins?: CompileOptions['remarkPlugins']
  rehypePlugins?: CompileOptions['rehypePlugins']
  /**
   * Base path for rewriting relative asset URLs.
   * If provided, transforms ./image.png to /{assetBasePath}/image.png
   */
  assetBasePath?: string
}

const defaultConfig: MdxConfig = {
  remarkPlugins: [],
  rehypePlugins: [],
}

/**
 * Rewrite relative asset URLs in MDX content.
 * Transforms ./image.png to /basePath/image.png
 */
export const rewriteAssetUrls = (content: string, basePath: string): string => {
  return content
    .replace(/src="\.\/([^"]+)"/g, `src="/${basePath}/$1"`)
    .replace(/\]\(\.\/([^)]+)\)/g, `](/${basePath}/$1)`)
}

/**
 * Process MDX source: extract frontmatter, compile to JS.
 *
 * @param source - Raw MDX file content (with frontmatter)
 * @param schema - Effect Schema for validating frontmatter
 * @param config - Optional remark/rehype plugins and asset base path
 * @returns Validated frontmatter and compiled JS string
 */
export const processMdx = async <$a, $i>(
  source: string,
  schema: S.Schema<$a, $i>,
  config: MdxConfig = defaultConfig
): Promise<{ frontmatter: $a; compiledJs: string }> => {
  // Extract frontmatter and content
  const { data, content } = matter(source)

  // Validate frontmatter against schema
  const frontmatter = S.decodeUnknownSync(schema)(data)

  // Rewrite asset URLs if base path provided
  const processedContent = config.assetBasePath
    ? rewriteAssetUrls(content, config.assetBasePath)
    : content

  // Compile MDX to JS function body
  const compiled = await compile(processedContent, {
    outputFormat: 'function-body',
    remarkPlugins: config.remarkPlugins,
    rehypePlugins: config.rehypePlugins,
  })

  return {
    frontmatter,
    compiledJs: String(compiled),
  }
}

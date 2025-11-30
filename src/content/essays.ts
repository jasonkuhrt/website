import { Continent } from 'continent'
import * as S from 'effect/Schema'
import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import { basename, dirname } from 'path'

/**
 * Essay schema - long-form technical essays.
 */
const EssaySchema = S.Struct({
  title: S.String,
  date: S.DateFromSelf,
  source: S.String,
})

/**
 * Essays content definition.
 *
 * Essays are MDX files in content/writing/essays/.
 * Supports two formats:
 * - Flat file: {slug}.mdx (file strategy)
 * - Nested dir: {slug}/content.mdx (dir strategy, with assets)
 */
export const Essays = Continent.define({
  name: 'essays',
  schema: EssaySchema,
  root: 'content',
  discover: [
    { type: 'file', root: 'writing/essays', entry: '*.mdx' },
    { type: 'dir', root: 'writing/essays', entry: 'content.mdx' },
  ],
  async load({ filePath, strategy }) {
    const raw = await readFile(filePath, 'utf-8')
    const { data: frontmatter, content } = matter(raw)

    // Extract ID based on strategy type
    const id = strategy.type === 'dir'
      ? basename(dirname(filePath))
      : basename(filePath, '.mdx')

    // Rewrite relative asset URLs (both HTML src and markdown image syntax)
    const source = content
      .replace(/src="\.\/([^"]+)"/g, `src="/${strategy.root}/${id}/$1"`)
      .replace(/\]\(\.\/([^)]+)\)/g, `](/${strategy.root}/${id}/$1)`)

    // Normalize date
    const date = frontmatter.date instanceof Date
      ? frontmatter.date
      : new Date(frontmatter.date as string)

    return {
      id,
      title: frontmatter.title as string,
      date,
      source,
    }
  },
})

export namespace Essays {
  export type Entry = Awaited<ReturnType<typeof Essays.list>>[number]
}

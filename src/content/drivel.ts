import { Continent } from 'continent'
import * as S from 'effect/Schema'
import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import { basename, dirname } from 'path'

/**
 * Drivel schema - shorter blog posts.
 */
const DrivelSchema = S.Struct({
  title: S.String,
  date: S.DateFromSelf,
  source: S.String,
})

/**
 * Drivel content definition.
 *
 * Drivel are MDX files in content/writing/drivel/.
 * Supports two formats:
 * - Flat file: {slug}.mdx (file strategy)
 * - Nested dir: {slug}/content.mdx (dir strategy, with assets)
 */
export const Drivel = Continent.define({
  name: 'drivel',
  schema: DrivelSchema,
  root: 'content',
  discover: [
    { type: 'file', root: 'writing/drivel', entry: '*.mdx' },
    { type: 'dir', root: 'writing/drivel', entry: 'content.mdx' },
  ],
  async load({ filePath, strategy }) {
    const raw = await readFile(filePath, 'utf-8')
    const { data: frontmatter, content } = matter(raw)

    // Extract ID based on strategy type
    const rawId = strategy.type === 'dir'
      ? basename(dirname(filePath))
      : basename(filePath, '.mdx')

    // Strip date prefix (YYYY-MM-DD_) if present
    const id = rawId.replace(/^\d{4}-\d{2}-\d{2}_/, '')

    // Rewrite relative asset URLs (both HTML src and markdown image syntax)
    const source = content
      .replace(/src="\.\/([^"]+)"/g, `src="/${strategy.root}/${id}/$1"`)
      .replace(/\]\(\.\/([^)]+)\)/g, `](/${strategy.root}/${id}/$1)`)

    // Normalize date (gray-matter may return string or Date depending on format)
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

export namespace Drivel {
  export type Entry = Awaited<ReturnType<typeof Drivel.list>>[number]
}

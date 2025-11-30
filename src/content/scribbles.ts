import { Continent } from 'continent'
import * as S from 'effect/Schema'
import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import { basename, dirname } from 'path'

/**
 * Scribbles schema - quick notes and TIL entries.
 */
const ScribblesSchema = S.Struct({
  title: S.String,
  date: S.DateFromSelf,
  tags: S.optional(S.Array(S.String)),
  source: S.String,
})

/**
 * Scribbles content definition.
 *
 * Scribbles are MDX files in content/writing/scribbles/.
 * File format: {date}.mdx or {date}_{slug}.mdx
 * Files starting with _ are ignored.
 */
export const Scribbles = Continent.define({
  name: 'scribbles',
  schema: ScribblesSchema,
  root: 'content',
  discover: [
    { type: 'file', root: 'writing/scribbles', entry: '*.mdx' },
    { type: 'dir', root: 'writing/scribbles', entry: 'content.mdx' },
  ],
  async load({ filePath, strategy }) {
    const raw = await readFile(filePath, 'utf-8')
    const { data: frontmatter, content } = matter(raw)

    // Extract ID based on strategy type, stripping any _slug suffix to keep just the date
    const rawId = strategy.type === 'dir'
      ? basename(dirname(filePath))
      : basename(filePath, '.mdx')
    const id = rawId.replace(/_.*$/, '')

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
      tags: frontmatter.tags as string[] | undefined,
      source,
    }
  },
})

export namespace Scribbles {
  export type Entry = Awaited<ReturnType<typeof Scribbles.list>>[number]
}

import { Continent, Explorers } from 'continent'
import * as S from 'effect/Schema'
import matter from 'gray-matter'
import { FlexibleDate } from './_helpers.js'

/**
 * Scribbles content definition.
 *
 * Scribbles are MDX files in content/writing/scribbles/.
 * File format: {date}.mdx or {date}_{slug}.mdx
 * Files starting with _ are ignored.
 */
export const Scribbles = Continent.define({
  name: 'scribbles',
  input: S.Struct({
    title: S.String,
    date: FlexibleDate,
    tags: S.optional(S.Array(S.String)),
  }),
  root: 'content',
  explorer: [
    Explorers.File.create({ root: 'writing/scribbles', entry: 'mdx' }),
    Explorers.Dir.create({ root: 'writing/scribbles', entry: 'content.mdx' }),
  ],
  async loadOne(exploration, ctx) {
    const { data: frontmatter, content } = matter(exploration.matches.entry)
    const input = S.decodeUnknownSync(ctx.inputSchema)(frontmatter)

    // ID is now directly available on exploration
    // Strip any _slug suffix to keep just the date
    const id = exploration.id.replace(/_.*$/, '')

    // Rewrite relative asset URLs (both HTML src and markdown image syntax)
    const source = content
      .replace(/src="\.\/([^"]+)"/g, `src="/${exploration.config.root}/${id}/$1"`)
      .replace(/\]\(\.\/([^)]+)\)/g, `](/${exploration.config.root}/${id}/$1)`)

    return {
      id,
      title: input.title,
      date: input.date,
      tags: input.tags,
      source,
    }
  },
})

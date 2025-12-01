import { Continent, Explorers } from 'continent'
import * as S from 'effect/Schema'
import matter from 'gray-matter'
import { FlexibleDate } from './_helpers.js'

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
  root: 'content',
  input: S.Struct({
    title: S.String,
    date: FlexibleDate,
  }),
  explorer: [
    Explorers.File.create({ root: 'writing/drivel', entry: 'mdx' }),
    Explorers.Dir.create({ root: 'writing/drivel', entry: 'content.mdx' }),
  ],
  async loadOne(exploration, ctx) {
    const { data: frontmatter, content } = matter(exploration.matches.entry)
    const input = S.decodeUnknownSync(ctx.inputSchema)(frontmatter)

    // ID is now directly available on exploration
    // Strip date prefix (YYYY-MM-DD_) if present
    const id = exploration.id.replace(/^\d{4}-\d{2}-\d{2}_/, '')

    // Rewrite relative asset URLs (both HTML src and markdown image syntax)
    const source = content
      .replace(/src="\.\/([^"]+)"/g, `src="/${exploration.config.root}/${id}/$1"`)
      .replace(/\]\(\.\/([^)]+)\)/g, `](/${exploration.config.root}/${id}/$1)`)

    return {
      id,
      title: input.title,
      date: input.date,
      source,
    }
  },
})

import { Continent, Explorers } from 'continent'
import * as S from 'effect/Schema'
import matter from 'gray-matter'

/**
 * Date schema that handles both Date objects and date strings.
 * gray-matter may return either depending on YAML format.
 */
const FlexibleDate = S.transform(
  S.Union(S.DateFromSelf, S.String),
  S.DateFromSelf,
  {
    decode: (input) => input instanceof Date ? input : new Date(input),
    encode: (date) => date,
  },
)

/**
 * Drivel schema - input fields (what author writes in frontmatter).
 * Note: `source` is NOT in schema - it's loader output, not input.
 */
const DrivelSchema = S.Struct({
  title: S.String,
  date: FlexibleDate,
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
  input: DrivelSchema,
  root: 'content',
  explorer: [
    Explorers.File.create({ root: 'writing/drivel', entry: 'mdx' }),
    Explorers.Dir.create({ root: 'writing/drivel', entry: 'content.mdx' }),
  ],
  async loadOne(exploration, ctx) {
    // Parse frontmatter from content
    const { data: frontmatter, content } = matter(exploration.matches.entry)

    // Decode frontmatter through schema
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

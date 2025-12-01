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
 * Scribbles schema - input fields (what author writes in frontmatter).
 * Note: `source` is NOT in schema - it's loader output, not input.
 */
const ScribblesSchema = S.Struct({
  title: S.String,
  date: FlexibleDate,
  tags: S.optional(S.Array(S.String)),
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
  input: ScribblesSchema,
  root: 'content',
  explorer: [
    Explorers.File.create({ root: 'writing/scribbles', entry: 'mdx' }),
    Explorers.Dir.create({ root: 'writing/scribbles', entry: 'content.mdx' }),
  ],
  async loadOne(exploration, ctx) {
    // matches.entry is typed as MatchWithContent (string shorthand = required single match with content)
    const { content: rawContent } = exploration.matches.entry

    // Parse frontmatter from content
    const { data: frontmatter, content } = matter(rawContent)

    // Decode frontmatter through schema
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

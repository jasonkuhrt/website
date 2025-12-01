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
 * Essays content definition.
 *
 * Essays are MDX files in content/writing/essays/.
 * Supports two formats:
 * - Flat file: {slug}.mdx (file strategy)
 * - Nested dir: {slug}/content.mdx (dir strategy, with assets)
 */
export const Essays = Continent.define({
  name: 'essays',
  root: 'content',
  input: S.Struct({
    title: S.String,
    date: FlexibleDate,
  }),
  explorer: [
    Explorers.File.create({ root: 'writing/essays', entry: 'mdx' }),
    Explorers.Dir.create({ root: 'writing/essays', entry: 'content.mdx' }),
  ],
  async loadOne(exploration, ctx) {
    const { data: frontmatterRaw, content } = matter(exploration.matches.entry)
    const frontmatter = S.decodeUnknownSync(ctx.inputSchema)(frontmatterRaw)

    // Rewrite relative asset URLs (both HTML src and markdown image syntax)
    const source = content
      .replace(/src="\.\/([^"]+)"/g, `src="/${exploration.config.root}/${exploration.id}/$1"`)
      .replace(/\]\(\.\/([^)]+)\)/g, `](/${exploration.config.root}/${exploration.id}/$1)`)

    return {
      id: exploration.id,
      ...frontmatter,
      source,
    }
  },
})

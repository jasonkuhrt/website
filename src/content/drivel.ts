import { Continent, Explorers } from 'continent'
import * as S from 'effect/Schema'
import { FlexibleDate } from './_helpers.js'
import { processMdx } from './_mdx.js'

export class DrivelLoaded extends S.Class<DrivelLoaded>('DrivelLoaded')({
  id: S.String,
  title: S.String,
  date: S.Date,
  compiledJs: S.String,
}) {}

/**
 * Drivel content definition.
 *
 * Drivel are MDX files in content/drivel/.
 * Supports two formats:
 * - Flat file: {slug}.mdx (file strategy)
 * - Nested dir: {slug}/content.mdx (dir strategy, with assets)
 */
export const Drivel = Continent.define({
  name: 'drivel',
  input: S.Struct({
    title: S.String,
    date: FlexibleDate,
  }),
  loaded: DrivelLoaded,
  explorer: [
    Explorers.File.create({ entry: 'mdx' }),
    Explorers.Dir.create({ entry: 'content.mdx' }),
  ],
  async loadOne(exploration, ctx) {
    // Strip date prefix (YYYY-MM-DD_) if present
    const id = exploration.id.replace(/^\d{4}-\d{2}-\d{2}_/, '')
    const assetBasePath = `${exploration.config.root}/${id}`

    const { frontmatter, compiledJs } = await processMdx(
      exploration.matches.entry.content,
      ctx.inputSchema,
      { assetBasePath }
    )

    return new DrivelLoaded({
      id,
      title: frontmatter.title,
      date: frontmatter.date,
      compiledJs,
    })
  },
})

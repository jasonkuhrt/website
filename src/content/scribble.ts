import { Continent, Explorers } from 'continent'
import * as S from 'effect/Schema'
import { FlexibleDate } from './_helpers.js'
import { processMdx } from './_mdx.js'

export class ScribbleLoaded extends S.Class<ScribbleLoaded>('ScribbleLoaded')({
  id: S.String,
  title: S.String,
  date: S.Date,
  tags: S.optional(S.Array(S.String)),
  compiledJs: S.String,
}) {}

/**
 * Scribble content definition.
 *
 * Scribbles are MDX files in content/scribbles/.
 * File format: {date}.mdx or {date}_{slug}.mdx
 * Files starting with _ are ignored.
 */
export const Scribble = Continent.define({
  name: 'scribble',
  input: S.Struct({
    title: S.String,
    date: FlexibleDate,
    tags: S.optional(S.Array(S.String)),
  }),
  loaded: ScribbleLoaded,
  explorer: [
    Explorers.File.create({ entry: 'mdx' }),
    Explorers.Dir.create({ entry: 'content.mdx' }),
  ],
  async loadOne(exploration, ctx) {
    // Strip any _slug suffix to keep just the date
    const id = exploration.id.replace(/_.*$/, '')
    const assetBasePath = `${exploration.config.root}/${id}`

    const { frontmatter, compiledJs } = await processMdx(
      exploration.matches.entry.content,
      ctx.inputSchema,
      { assetBasePath },
    )

    return new ScribbleLoaded({
      id,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags,
      compiledJs,
    })
  },
})

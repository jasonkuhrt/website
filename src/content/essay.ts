import { Continent, Explorers } from 'continent'
import * as S from 'effect/Schema'
import { FlexibleDate } from './_helpers.js'
import { processMdx } from './_mdx.js'

export class EssayLoaded extends S.Class<EssayLoaded>('EssayLoaded')({
  id: S.String,
  title: S.String,
  date: S.Date,
  compiledJs: S.String,
}) {}

export const Essay = Continent.define({
  name: 'essay',
  input: S.Struct({
    title: S.String,
    date: FlexibleDate,
  }),
  loaded: EssayLoaded,
  explorer: [
    Explorers.File.create({ entry: 'mdx' }),
    Explorers.Dir.create({ entry: 'content.mdx' }),
  ],
  async loadOne(exploration, ctx) {
    const assetBasePath = `${exploration.config.root}/${exploration.id}`
    const { frontmatter, compiledJs } = await processMdx(
      exploration.matches.entry.content,
      ctx.inputSchema,
      { assetBasePath },
    )

    return new EssayLoaded({
      id: exploration.id,
      title: frontmatter.title,
      date: frontmatter.date,
      compiledJs,
    })
  },
})

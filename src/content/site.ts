import * as S from 'effect/Schema'
import { Content, Store } from 'continent'

export const Site = Content('site', {
  store: Store.js({
    path: 'content/site.ts',
    cardinality: '1',
    schema: S.Struct({
      title: S.String,
      description: S.String,
    }),
  }),
})

export type Site = typeof Site.Type

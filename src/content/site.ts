import { Content, Store } from 'continent'
import * as S from 'effect/Schema'

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
export default Site
export type Site = typeof Site.Type

import { Continent } from 'continent'
import * as S from 'effect/Schema'

export class SiteSchema extends S.Class<SiteSchema>('SiteSchema')({
  title: S.String,
  description: S.String,
}) {}

export const Site = Continent.define({
  name: 'site',
  input: SiteSchema,
})

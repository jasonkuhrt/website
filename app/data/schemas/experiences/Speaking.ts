import * as S from 'effect/Schema'
import { BaseExperience } from './BaseExperience.js'

/**
 * Speaking Engagement Schema
 *
 * Represents talks, presentations, podcast appearances, etc.
 */

export class Speaking extends BaseExperience.extend<Speaking>('Speaking')({
  _tag: S.tag('Speaking'),
  title: S.String,
  venue: S.String,
  description: S.optional(S.String),
  links: S.optional(
    S.Struct({
      info: S.optional(S.String),
      repo: S.optional(S.String),
      recording: S.optional(S.String),
      twitter: S.optional(S.String),
    }),
  ),
}) {}

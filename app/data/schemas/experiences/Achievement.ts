import * as S from 'effect/Schema'
import { BaseExperience } from './BaseExperience.js'

/**
 * Achievement Schema
 *
 * Represents awards, recognitions, honors, and special selections.
 */

export class Achievement extends BaseExperience.extend<Achievement>('Achievement')({
  _tag: S.tag('Achievement'),
  title: S.String,
  issuer: S.String,
  description: S.optional(S.String),
}) {}

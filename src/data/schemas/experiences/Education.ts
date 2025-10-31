import * as S from 'effect/Schema'
import { DateString } from '../DateString.js'
import { BaseExperience } from './BaseExperience.js'

/**
 * Education Schema
 *
 * Represents academic education history.
 */

export class Education extends BaseExperience.extend<Education>('Education')({
  _tag: S.tag('Education'),
  institution: S.String,
  degree: S.String,
  endDate: S.optional(DateString),
  description: S.optional(S.String),
}) {}

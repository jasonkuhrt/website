import * as S from 'effect/Schema'
import { DateString } from '../DateString.js'
import { BaseExperience } from './BaseExperience.js'

/**
 * Work Experience Schema
 *
 * Represents a professional work position with detailed accomplishments.
 */

export class WorkExperience extends BaseExperience.extend<WorkExperience>('WorkExperience')({
  _tag: S.tag('WorkExperience'),
  title: S.String,
  company: S.String,
  location: S.String,
  endDate: S.optional(DateString),
  overview: S.optional(S.String),
  accomplishments: S.optional(S.Array(S.String)),
  technologies: S.optional(S.Array(S.String)),
  projects: S.optional(
    S.Array(
      S.Struct({
        name: S.String,
        description: S.String,
      }),
    ),
  ),
}) {}

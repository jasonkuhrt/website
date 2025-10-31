import * as S from 'effect/Schema'
import { BaseExperience } from './BaseExperience.js'

/**
 * Personal Milestone Schema
 *
 * Represents personal life events and milestones.
 */

export class Personal extends BaseExperience.extend<Personal>('Personal')({
  _tag: S.tag('Personal'),
  title: S.String,
  icon: S.String,
  description: S.optional(S.String),
  url: S.optional(S.String),
}) {}

/**
 * Experience Schemas
 *
 * Unified type system for all experience types (work, education, speaking, achievements, personal).
 * Uses Effect Schema for runtime validation and type safety.
 */

import * as S from 'effect/Schema'
import { Order } from 'effect'

export * from './Achievement.js'
export * from './BaseExperience.js'
export * from '../DateString.js'
export * from './Education.js'
export * from './Personal.js'
export * from './Speaking.js'
export * from './WorkExperience.js'

import { Achievement } from './Achievement.js'
import { Education } from './Education.js'
import { Personal } from './Personal.js'
import { Speaking } from './Speaking.js'
import { WorkExperience } from './WorkExperience.js'

/**
 * Union of all experience types
 */
export const Experience = S.Union(
  WorkExperience,
  Education,
  Speaking,
  Achievement,
  Personal,
)

export type Experience = typeof Experience.Type

/**
 * Array of experiences
 */
export const Experiences = S.Array(Experience)

export type Experiences = typeof Experiences.Type

/**
 * Order instance for sorting experiences by start date (newest first)
 *
 * All experience types have a `date` field representing their start date.
 */
export const ExperienceOrder: Order.Order<Experience> = Order.mapInput(
  Order.reverse(Order.Date),
  (exp: Experience) => exp.date
)

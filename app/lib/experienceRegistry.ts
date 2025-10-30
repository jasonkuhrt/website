/**
 * Experience Registry
 *
 * Single source of truth for experience type mappings:
 * - Colors
 * - Labels
 * - Icons
 * - Event type constants
 *
 * Eliminates duplication between Timeline and TimelineTable components.
 */

import { Obj } from '@wollybeard/kit'
import { Match } from 'effect'
import type { LucideIcon } from 'lucide-react'
import {
  Award,
  Baby,
  Brain,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  MapPin,
  Mountain,
  Presentation,
} from 'lucide-react'
import { token } from '../../styled-system/tokens'
import type { Experience } from '../data/schemas/experiences/__.js'
import {
  Achievement,
  Education,
  Personal,
  Speaking,
  WorkExperience,
} from '../data/schemas/experiences/__.js'

// ============================================================================
// Event Type Constants
// ============================================================================

/**
 * Registry of all experience schema classes
 * Single source of truth for experience types
 */

const schemaIndex = {
  WorkExperience,
  Education,
  Achievement,
  Speaking,
  Personal,
} as const

/**
 * Array of experience type tags derived from schemas (type-safe)
 */
export const eventTypes = Obj.keysStrict(schemaIndex)

// ============================================================================
// Color Mappings
// ============================================================================

export const getColorForTag = (tag: Experience['_tag']): string =>
  Match.value(tag).pipe(
    Match.when('WorkExperience', () => token('colors.experience.work')),
    Match.when('Education', () => token('colors.experience.education')),
    Match.when('Achievement', () => token('colors.experience.achievement')),
    Match.when('Speaking', () => token('colors.experience.speaking')),
    Match.when('Personal', () => token('colors.experience.personal')),
    Match.exhaustive,
  )

export const getColorForExperience = (experience: Experience): string => getColorForTag(experience._tag)

// ============================================================================
// Label Mappings
// ============================================================================

export const getLabelForTag = (tag: Experience['_tag']): string =>
  Match.value(tag).pipe(
    Match.when('WorkExperience', () => 'Experience'),
    Match.when('Education', () => 'Education'),
    Match.when('Achievement', () => 'Honours'),
    Match.when('Speaking', () => 'Speaking'),
    Match.when('Personal', () => 'Personal'),
    Match.exhaustive,
  )

// ============================================================================
// Icon Mappings
// ============================================================================

/**
 * Icon map for personal event icon strings
 */
export const PERSONAL_ICON_MAP: Record<string, LucideIcon> = {
  Baby,
  MapPin,
  Home,
  Mountain,
  Brain,
  Heart,
}

export const getIconForTag = (tag: Experience['_tag']): LucideIcon =>
  Match.value(tag).pipe(
    Match.when('WorkExperience', () => Briefcase),
    Match.when('Education', () => GraduationCap),
    Match.when('Achievement', () => Award),
    Match.when('Speaking', () => Presentation),
    Match.when('Personal', () => Heart),
    Match.exhaustive,
  )

export const getIconForExperience = (experience: Experience): LucideIcon => {
  if (experience._tag === 'Personal' && experience.icon && PERSONAL_ICON_MAP[experience.icon])
    return PERSONAL_ICON_MAP[experience.icon]
  return getIconForTag(experience._tag)
}

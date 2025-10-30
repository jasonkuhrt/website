import * as S from 'effect/Schema'

/**
 * Skills Schema
 *
 * Timeline-based skills tracking showing evolution over career.
 */

export const SkillCategory = S.Literal('Language', 'Framework', 'Platform', 'Practice', 'Tool')
export type SkillCategory = typeof SkillCategory.Type

export const ProficiencyLevel = S.Literal('Expert', 'Advanced', 'Intermediate', 'Learning')
export type ProficiencyLevel = typeof ProficiencyLevel.Type

export const SkillStatus = S.Literal('Active', 'Inactive', 'Emerging')
export type SkillStatus = typeof SkillStatus.Type

export class Skill extends S.Class<Skill>('Skill')({
  name: S.String,
  category: SkillCategory,
  proficiency: ProficiencyLevel,
  firstYear: S.Number,
  yearsOfExperience: S.Number,
  status: SkillStatus,
  description: S.optional(S.String),
}) {}

export const Skills = S.Array(Skill)
export type Skills = typeof Skills.Type

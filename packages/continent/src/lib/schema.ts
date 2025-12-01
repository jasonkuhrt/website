/**
 * Schema utilities for working with Effect Schema unions.
 */
import * as S from 'effect/Schema'

// ============================================================================
// Type-Level Utilities
// ============================================================================

/**
 * Capitalize first letter of a string type.
 */
type Capitalize<$S extends string> = $S extends `${infer $First}${infer $Rest}`
  ? `${Uppercase<$First>}${$Rest}`
  : $S

/**
 * Strip prefix from a string type.
 * StripPrefix<'ExperienceWork', 'Experience'> = 'Work'
 * StripPrefix<'Other', 'Experience'> = 'Other'
 */
type StripPrefix<$S extends string, $Prefix extends string> =
  $S extends `${$Prefix}${infer $Rest}`
    ? $Rest extends ''
      ? $S
      : $Rest
    : $S

/**
 * Extract _tag literal from a schema's output type.
 */
type SchemaTag<$S> =
  $S extends S.Schema.AnyNoContext
    ? S.Schema.Type<$S> extends { _tag: infer $Tag extends string }
      ? $Tag
      : never
    : never

/**
 * Create a single-property record for one union member.
 * Strips capitalized $Name prefix from _tag to derive namespace key.
 */
// dprint-ignore
type MemberToRecord<$Member, $Name extends string> =
  $Member extends S.Schema.AnyNoContext
    ? S.Schema.Type<$Member> extends { _tag: infer $Tag extends string }
      ? Record<StripPrefix<$Tag, Capitalize<$Name>>, $Member>
      : {}
    : {}

/**
 * Recursively build intersection of member records from tuple.
 */
type TupleToNamespace<$Members extends readonly any[], $Name extends string> =
  $Members extends readonly [infer $First, ...infer $Rest]
    ? MemberToRecord<$First, $Name> & TupleToNamespace<$Rest, $Name>
    : {}

/**
 * Build union member namespace type.
 * Given S.Union<[WorkExperience, Education, ...]> and name 'experience',
 * produces { Work: typeof WorkExperience, Education: typeof Education, ... }
 */
export type UnionNamespace<$Input, $Name extends string> =
  $Input extends S.Union<infer $Members>
    ? TupleToNamespace<$Members, $Name>
    : {}

// ============================================================================
// Union Detection & Member Extraction
// ============================================================================

/**
 * Check if a schema is a union schema.
 */
export const isUnion = (schema: S.Schema.AnyNoContext): schema is S.Union<readonly S.Schema.AnyNoContext[]> => {
  return 'members' in schema && Array.isArray((schema as any).members)
}

/**
 * Get members from a union schema.
 */
export const getUnionMembers = (schema: S.Schema.AnyNoContext): S.Schema.AnyNoContext[] => {
  if (!isUnion(schema)) return []
  return [...(schema as any).members]
}

// ============================================================================
// Name Derivation
// ============================================================================

/**
 * Get the identifier/name of a schema class.
 * Returns the class name for S.Class-based schemas.
 */
export const getSchemaName = (schema: S.Schema.AnyNoContext): string | null => {
  // S.Class schemas have an identifier
  if ('identifier' in schema && typeof (schema as any).identifier === 'string') {
    return (schema as any).identifier
  }
  // Check ast annotations
  if (schema.ast && 'annotations' in schema.ast) {
    const annotations = (schema.ast as any).annotations
    if (annotations?.identifier) return annotations.identifier
  }
  return null
}

/**
 * Derive a short name from a schema name by stripping a prefix.
 *
 * @example
 * deriveShortName('ExperienceWork', 'experience') // 'Work'
 * deriveShortName('Other', 'experience') // 'Other'
 */
export const deriveShortName = (name: string, prefix: string): string => {
  const capitalizedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1)
  if (name.startsWith(capitalizedPrefix) && name.length > capitalizedPrefix.length) {
    return name.slice(capitalizedPrefix.length)
  }
  return name
}

// ============================================================================
// Union Member Namespace Builder
// ============================================================================

/**
 * Build a namespace object from union members.
 * Strips capitalized definitionName prefix from each member's identifier.
 *
 * @example
 * const namespace = buildUnionNamespace(unionSchema, 'experience')
 * // { Work: ExperienceWork, Education: ExperienceEducation, ... }
 */
export const buildUnionNamespace = (
  schema: S.Schema.AnyNoContext,
  definitionName: string,
): Record<string, S.Schema.AnyNoContext> => {
  const members = getUnionMembers(schema)
  const namespace: Record<string, S.Schema.AnyNoContext> = {}

  for (const member of members) {
    const name = getSchemaName(member)
    if (name) {
      const shortName = deriveShortName(name, definitionName)
      namespace[shortName] = member
    }
  }

  return namespace
}

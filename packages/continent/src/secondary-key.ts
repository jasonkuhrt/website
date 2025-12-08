import { Option, Schema as S } from 'effect'
import type { Struct } from 'effect/Schema'
import * as AST from 'effect/SchemaAST'

// ============================================================================
// Type-Level Brand
// ============================================================================

declare const Brand: unique symbol

/**
 * A schema marked as a unique key field.
 * The brand is used for type-level detection via `ExtractUniqueKeys`.
 */
export type SecondaryKeySchema<$Schema extends S.Schema<string, string, never>> = $Schema & {
  readonly [Brand]: true
}

// ============================================================================
// Runtime Annotation
// ============================================================================

const Annotation = Symbol.for('content/unique-key')

// ============================================================================
// Combinator
// ============================================================================

/**
 * Mark a string schema field as a unique key for Content collections.
 * Enables O(1) lookup via `Content.get({ fieldName: value })`.
 *
 * @example
 * ```typescript
 * const Essay = Content('essay', {
 *   schema: {
 *     slug: UniqueKey(S.String),
 *     title: S.String,
 *   },
 * })
 *
 * // Now supports: Essay.get({ slug: 'my-post' })
 * ```
 */
export const SecondaryKey = <$Schema extends S.Schema<string, string, never>>(
  schema: $Schema,
): SecondaryKeySchema<$Schema> => {
  return schema.annotations({ [Annotation]: true }) as SecondaryKeySchema<$Schema>
}

// ============================================================================
// Type-Level Extraction
// ============================================================================

/**
 * Extract unique key field names from Struct.Fields at type level.
 *
 * @example
 * ```typescript
 * type Fields = {
 *   id: UniqueKeySchema<S.Schema<string, string, never>>
 *   name: S.Schema<string, string, never>
 * }
 *
 * type Keys = ExtractUniqueKeysFromFields<Fields>
 * // ^? "id"
 * ```
 */
// dprint-ignore
export type GetFromFields<$Fields extends Struct.Fields> =
  {
    [K in keyof $Fields]: $Fields[K] extends { readonly [Brand]: true } ? K : never
  }[keyof $Fields] & string

/**
 * Extract unique key field names from a Struct schema at type level.
 *
 * @example
 * ```typescript
 * const MySchema = S.Struct({
 *   id: UniqueKey(S.String),
 *   email: UniqueKey(S.String),
 *   name: S.String,
 * })
 *
 * type Keys = ExtractUniqueKeys<typeof MySchema>
 * // ^? "id" | "email"
 * ```
 */
// dprint-ignore
export type Get<$Schema> =
  $Schema extends S.Struct<infer __fields__>
    ? GetFromFields<__fields__>
    : never

// ============================================================================
// Tagged Union for mapKeySecondaryToPrimary
// ============================================================================

/**
 * Create a tagged union type from SecondaryKey fields.
 * Used as input type for `mapKeySecondaryToPrimary`.
 *
 * @example
 * ```typescript
 * type Fields = { slug: SecondaryKeySchema<S.String>, id: SecondaryKeySchema<S.String>, title: S.String }
 * type U = UnionFromFields<Fields>
 * // => { _tag: 'slug', value: string } | { _tag: 'id', value: string }
 * ```
 */
// dprint-ignore
export type UnionFromFields<$Fields extends Struct.Fields> = {
  [k in GetFromFields<$Fields>]: {
    _tag: k
    value: $Fields[k] extends S.Schema<infer __type__, any, any> ? __type__ : never
  }
}[GetFromFields<$Fields>]

// ============================================================================
// Runtime Extraction
// ============================================================================

/**
 * Extract unique key field names from Struct.Fields at runtime.
 * Traverses fields to find those annotated with UniqueKey.
 */
export const getFromFields = <$Fields extends Struct.Fields>(
  fields: $Fields,
): GetFromFields<$Fields>[] => {
  const keys: string[] = []

  for (const [name, fieldSchema] of Object.entries(fields)) {
    const annotation = AST.getAnnotation<boolean>(Annotation)(
      (fieldSchema as S.Schema.Any).ast,
    )
    if (Option.isSome(annotation) && annotation.value === true) keys.push(name)
  }

  return keys as GetFromFields<$Fields>[]
}

/**
 * Extract unique key field names from a Struct schema at runtime.
 * Traverses fields to find those annotated with UniqueKey.
 *
 * @example
 * ```typescript
 * const schema = S.Struct({
 *   id: UniqueKey(S.String),
 *   name: S.String,
 * })
 *
 * extractUniqueKeys(schema) // ['id']
 * ```
 */
export const get = <$Fields extends Struct.Fields>(
  schema: S.Struct<$Fields>,
): Get<S.Struct<$Fields>>[] => {
  return getFromFields(schema.fields)
}

/**
 * Extract field keys that can be used as unique keys from a Struct schema.
 */
// dprint-ignore
export type GetFromSchema<$Schema> =
  $Schema extends S.Struct<infer __fields__>
    ? GetFromFields<__fields__>
    : never

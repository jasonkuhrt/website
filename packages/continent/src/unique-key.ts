import { Option, Schema as S } from 'effect'
import * as AST from 'effect/SchemaAST'
import type { Struct } from 'effect/Schema'

// ============================================================================
// Type-Level Brand
// ============================================================================

declare const UniqueKeyBrand: unique symbol

/**
 * A schema marked as a unique key field.
 * The brand is used for type-level detection via `ExtractUniqueKeys`.
 */
export type UniqueKeySchema<$Schema extends S.Schema<string, string, never>> =
  $Schema & { readonly [UniqueKeyBrand]: true }

// ============================================================================
// Runtime Annotation
// ============================================================================

const UniqueKeyAnnotation = Symbol.for('content/unique-key')

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
export const UniqueKey = <$Schema extends S.Schema<string, string, never>>(
  schema: $Schema,
): UniqueKeySchema<$Schema> => {
  return schema.annotations({ [UniqueKeyAnnotation]: true }) as UniqueKeySchema<$Schema>
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
//dprint-ignore
export type ExtractUniqueKeysFromFields<$Fields extends Struct.Fields> =
  {
    [K in keyof $Fields]: $Fields[K] extends { readonly [UniqueKeyBrand]: true } ? K : never
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
//dprint-ignore
export type ExtractUniqueKeys<$Schema> =
  $Schema extends S.Struct<infer __fields__>
    ? ExtractUniqueKeysFromFields<__fields__>
    : never

// ============================================================================
// Runtime Extraction
// ============================================================================

/**
 * Extract unique key field names from Struct.Fields at runtime.
 * Traverses fields to find those annotated with UniqueKey.
 */
export const extractUniqueKeysFromFields = <$Fields extends Struct.Fields>(
  fields: $Fields,
): ExtractUniqueKeysFromFields<$Fields>[] => {
  const keys: string[] = []

  for (const [name, fieldSchema] of Object.entries(fields)) {
    const annotation = AST.getAnnotation<boolean>(UniqueKeyAnnotation)(
      (fieldSchema as S.Schema.Any).ast,
    )
    if (Option.isSome(annotation) && annotation.value === true) {
      keys.push(name)
    }
  }

  return keys as ExtractUniqueKeysFromFields<$Fields>[]
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
export const extractUniqueKeys = <$Fields extends Struct.Fields>(
  schema: S.Struct<$Fields>,
): ExtractUniqueKeys<S.Struct<$Fields>>[] => {
  return extractUniqueKeysFromFields(schema.fields)
}

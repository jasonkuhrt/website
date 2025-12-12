import { Hash, Option, Schema as S } from 'effect'
import type { Struct } from 'effect/Schema'
import * as AST from 'effect/SchemaAST'
import { ensureHashable, ensureHashableSchema } from './lib/hashable.js'

// ============================================================================
// Type-Level Brand
// ============================================================================

declare const Brand: unique symbol

/**
 * A schema marked as the primary key field.
 * The brand is used for type-level detection via `GetFromFields`.
 */
export type PrimaryKeySchema<$Schema extends S.Schema.Any> = $Schema & {
  readonly [Brand]: true
}

// ============================================================================
// Runtime Annotation
// ============================================================================

const Annotation = Symbol.for('continent/primary-key')

// ============================================================================
// Combinator
// ============================================================================

/**
 * Mark a schema field as the primary key for a store.
 * Only one field per store schema should be marked as PrimaryKey.
 *
 * The primary key is used for cache lookups. The encoded type is used
 * as the cache key (strings directly, others via Hash.hash).
 *
 * @example
 * ```typescript
 * const Module = Content('module', {
 *   store: Store.js({
 *     path: 'content/module.ts',
 *     schema: S.Struct({
 *       repo: PrimaryKey(RepoId),  // RepoId: string <-> { owner, name }
 *       featured: S.optional(S.Boolean),
 *     }),
 *   }),
 *   // ...
 * })
 *
 * // .get() takes the decoded type:
 * Module.get({ owner: 'jasonkuhrt', name: 'graffle' })
 * ```
 */
export const PrimaryKey = <$Schema extends S.Schema.Any>(
  schema: $Schema,
): PrimaryKeySchema<$Schema> => {
  const hashable = ensureHashableSchema(schema)
  return hashable.annotations({ [Annotation]: true }) as PrimaryKeySchema<$Schema>
}

// ============================================================================
// Type-Level Extraction
// ============================================================================

/**
 * Extract the primary key field name from Struct.Fields at type level.
 * Returns the field name marked with PrimaryKey, or never if none.
 */
// dprint-ignore
export type GetFieldName<$Fields extends Struct.Fields> =
  {
    [k in keyof $Fields]: $Fields[k] extends { readonly [Brand]: true } ? k : never
  }[keyof $Fields] & string

/**
 * Extract the primary key schema type from Struct.Fields at type level.
 */
// dprint-ignore
export type GetSchema<$Fields extends Struct.Fields> =
  {
    [k in keyof $Fields]: $Fields[k] extends PrimaryKeySchema<infer __schema__> ? __schema__ : never
  }[keyof $Fields]

/**
 * Get the decoded (Type) of the primary key schema.
 */
// dprint-ignore
export type GetType<$Fields extends Struct.Fields> =
  GetSchema<$Fields> extends S.Schema<infer __type__, any, any> ? __type__ : never

/**
 * Get the encoded (Encoded) of the primary key schema.
 */
// dprint-ignore
export type GetEncoded<$Fields extends Struct.Fields> =
  GetSchema<$Fields> extends S.Schema<any, infer __encoded__, any> ? __encoded__ : never

// ============================================================================
// Type-Level Extraction from Schema
// ============================================================================

/**
 * Extract the primary key field name from a Struct schema at type level.
 */
// dprint-ignore
export type GetFieldNameFromSchema<$Schema extends S.Struct<Struct.Fields>> =
  GetFieldName<$Schema['fields']>

/**
 * Extract the primary key schema from a Struct schema at type level.
 */
// dprint-ignore
export type GetSchemaFromSchema<$Schema extends S.Struct<Struct.Fields>> =
  GetSchema<$Schema['fields']>

/**
 * Get the decoded (Type) of the primary key from a Struct schema.
 */
// dprint-ignore
export type GetTypeFromSchema<$Schema extends S.Struct<Struct.Fields>> =
  GetType<$Schema['fields']>

/**
 * Get the encoded (Encoded) of the primary key from a Struct schema.
 */
// dprint-ignore
export type GetEncodedFromSchema<$Schema extends S.Struct<Struct.Fields>> =
  GetEncoded<$Schema['fields']>

// ============================================================================
// Runtime Extraction
// ============================================================================

interface PrimaryKeyInfo {
  /** Field name in the struct */
  fieldName: string
  /** The schema for encoding/decoding */
  schema: S.Schema.Any
}

/**
 * Extract primary key info from Struct.Fields at runtime.
 * Returns the field name and schema, or undefined if no PrimaryKey.
 */
export const getFromFields = <$Fields extends Struct.Fields>(
  fields: $Fields,
): PrimaryKeyInfo | undefined => {
  for (const [name, fieldSchema] of Object.entries(fields)) {
    const annotation = AST.getAnnotation<boolean>(Annotation)(
      (fieldSchema as S.Schema.Any).ast,
    )
    if (Option.isSome(annotation) && annotation.value === true) {
      return { fieldName: name, schema: fieldSchema as S.Schema.Any }
    }
  }
  return undefined
}

/**
 * Extract primary key info from a Schema at runtime.
 * Returns the field name and schema, or undefined if no PrimaryKey or not a Struct.
 */
export const getFromSchema = (schema: S.Schema.Any): PrimaryKeyInfo | undefined => {
  if (!S.isSchema(schema)) return undefined
  if (!('fields' in schema)) return undefined
  return getFromFields((schema as S.Struct<Struct.Fields>).fields)
}

/**
 * Read the primary key value from raw data.
 */
export const read = (
  pkInfo: PrimaryKeyInfo,
  raw: Record<string, unknown>,
): string => {
  return String(raw[pkInfo.fieldName])
}

// ============================================================================
// Cache Key Utilities
// ============================================================================

/**
 * Convert an encoded primary key value to a cache key.
 * - If string → use directly (readable in cache)
 * - Otherwise → ensureHashable + Hash.hash → number
 */
export const encodedToCacheKey = (encoded: unknown): string | number => {
  if (typeof encoded === 'string') return encoded
  return Hash.hash(ensureHashable(encoded))
}

/**
 * Encode a decoded primary key value and convert to cache key.
 * Takes the user-facing value, encodes via schema, then converts to cache key.
 */
export const toCacheKey = <$Schema extends S.Schema.Any>(
  schema: $Schema,
  decoded: S.Schema.Type<$Schema>,
): string | number => {
  const encoded = S.encodeSync(schema as unknown as S.Schema<any, any, never>)(decoded)
  return encodedToCacheKey(encoded)
}

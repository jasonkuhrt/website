import { Data, Hash, Schema as S } from 'effect'
import * as AST from 'effect/SchemaAST'

// ============================================================================
// Schema-Level Hashable
// ============================================================================

/**
 * Check if an AST represents a hashable type (Transformation → Declaration with identifier or Data<...>).
 */
const isHashableAST = (ast: AST.AST): boolean => {
  // Only Transformations can produce Data or Class instances
  if (ast._tag !== 'Transformation') return false

  const to = (ast as AST.Transformation).to

  // Only Declarations can be Data or Class schemas
  if (to._tag !== 'Declaration') return false

  const annotations = to.annotations

  // Schema.Class has identifier, Schema.Data has "Data<..." description
  return !!(
    annotations[AST.IdentifierAnnotationId] ||
    (typeof annotations[AST.DescriptionAnnotationId] === 'string' &&
      (annotations[AST.DescriptionAnnotationId] as string).startsWith('Data<'))
  )
}

/**
 * Detect if a schema produces hashable data (implements Hash/Equal traits).
 * Returns true for:
 * - Schema.Class
 * - Schema.Data-wrapped schemas
 * - Union of hashable schemas (all members are hashable)
 */
export const isSchemaProducingHashableData = (schema: S.Schema.Any): boolean => {
  const ast = schema.ast

  // Handle Union schemas: all members must be hashable
  if (ast._tag === 'Union') return (ast as AST.Union).types.every((memberAST) => isHashableAST(memberAST))

  return isHashableAST(ast)
}

/**
 * Wrap a schema with S.Data() if it doesn't already produce hashable data.
 * Handles edge cases: Schema.Class and already S.Data-wrapped schemas are passed through.
 */
export const ensureHashableSchema = <$S extends S.Schema.Any>(schema: $S): $S => {
  if (isSchemaProducingHashableData(schema)) return schema // Already hashable
  return S.Data(schema as any) as any // Wrap with S.Data()
}

// ============================================================================
// Runtime Value Hashable
// ============================================================================

/**
 * Recursively convert a value to use Effect's Data types for stable hashing.
 * - Plain objects → Data.struct (with recursive processing of nested values)
 * - Arrays → Data.array (with recursive processing of elements)
 * - Primitives → pass through unchanged
 * - Objects already implementing Hash → pass through unchanged
 */
export const ensureHashable = <$T>(data: $T): $T => {
  // Primitives pass through unchanged
  if (data === null || data === undefined) return data
  if (typeof data !== 'object') return data

  // Objects that already implement Hash can be used directly
  if (Hash.isHash(data)) return data

  // Arrays need recursive processing of all elements
  if (Array.isArray(data)) {
    const processedItems = data.map((item) => ensureHashable(item))
    return Data.array(processedItems) as $T
  }

  // Plain objects need recursive processing of all values
  const processedEntries = Object.entries(data as Record<string, unknown>).map(
    ([key, value]) => [key, ensureHashable(value)] as const,
  )
  return Data.struct(Object.fromEntries(processedEntries)) as $T
}

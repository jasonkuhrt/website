import { Data, Hash } from 'effect'

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

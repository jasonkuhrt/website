/**
 * Generic localStorage Hook with Effect Schema
 *
 * Features:
 * - Type-safe localStorage persistence
 * - Effect Schema validation on read
 * - Automatic JSON parsing/serialization
 * - SSR-safe hydration
 * - Configurable error handling policy
 */

import { Either } from 'effect'
import * as S from 'effect/Schema'
import { useEffect, useState } from 'react'

// ============================================================================
// Types
// ============================================================================

interface UseLocalStorageOptions<$value> {
  /**
   * localStorage key
   */
  key: string

  /**
   * Effect Schema for validation
   * The hook automatically applies S.parseJson() internally
   */
  schema: S.Schema<$value>

  /**
   * Default value when localStorage is empty or invalid
   */
  defaultValue: $value

  /**
   * Error handling policy
   */
  policy?: {
    /**
     * What to do when localStorage contains invalid data
     *
     * - 'fallback' (default): Use defaultValue, keep corrupted localStorage
     * - 'clear': Use defaultValue, delete corrupted localStorage key
     */
    onDecodeError?: 'fallback' | 'clear'
  }
}

interface UseLocalStorageReturn<$value> {
  /**
   * Current value (from localStorage or defaultValue)
   */
  value: $value

  /**
   * Update value (persists to localStorage)
   */
  setValue: ($value: $value | (($prev: $value) => $value)) => void

  /**
   * Whether initial hydration from localStorage is complete
   * Useful for avoiding flash of default content
   */
  isHydrated: boolean
}

// ============================================================================
// Hook
// ============================================================================

export function useLocalStorage<$value>(
  options: UseLocalStorageOptions<$value>,
): UseLocalStorageReturn<$value> {
  const { key, schema, defaultValue, policy } = options
  const errorPolicy = policy?.onDecodeError ?? 'fallback'

  // Apply parseJson transformation to handle JSON string ↔ value
  const jsonSchema = S.parseJson(schema)

  const [value, setValue] = useState<$value>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof localStorage === 'undefined') {
      setIsHydrated(true)
      return
    }

    const stored = localStorage.getItem(key)
    if (!stored) {
      setIsHydrated(true)
      return
    }

    const result = S.decodeUnknownEither(jsonSchema)(stored)
    if (Either.isRight(result)) {
      setValue(result.right)
    } else {
      console.warn(`Failed to decode localStorage key "${key}"`, result.left)

      if (errorPolicy === 'clear') {
        localStorage.removeItem(key)
      }
    }

    setIsHydrated(true)
  }, [key, schema, errorPolicy])

  // Persist to localStorage when value changes
  useEffect(() => {
    if (!isHydrated) return
    if (typeof localStorage === 'undefined') return

    const encoded = S.encodeSync(jsonSchema)(value)
    localStorage.setItem(key, encoded)
  }, [key, value, isHydrated, jsonSchema])

  return {
    value,
    setValue,
    isHydrated,
  }
}

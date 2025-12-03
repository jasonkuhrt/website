import { Ts } from '@wollybeard/kit'
import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'
import { ExtractUniqueKeys, extractUniqueKeys, UniqueKey } from './_.js'

// ============================================================================
// Test Fixtures
// ============================================================================

const MultiKeySchema = S.Struct({
  id: UniqueKey(S.String),
  email: UniqueKey(S.String),
  name: S.String,
  age: S.Number,
})

const SingleKeySchema = S.Struct({
  slug: UniqueKey(S.String),
  title: S.String,
})

const NoKeySchema = S.Struct({
  name: S.String,
  count: S.Number,
})

// ============================================================================
// Type-Level Tests
// ============================================================================

describe('ExtractUniqueKeys', () => {
  test('extracts multiple unique keys', () => {
    type Keys = ExtractUniqueKeys<typeof MultiKeySchema>

    // Keys should be exactly "id" | "email"
    Ts.Assert.exact.ofAs<'id' | 'email'>().onAs<Keys>()
  })

  test('extracts single unique key', () => {
    type Keys = ExtractUniqueKeys<typeof SingleKeySchema>

    // Keys should be exactly "slug"
    Ts.Assert.exact.ofAs<'slug'>().onAs<Keys>()
  })

  test('returns never for schema with no unique keys', () => {
    type Keys = ExtractUniqueKeys<typeof NoKeySchema>

    // Keys should be exactly never (type-level assertion)
    type _assert = Ts.Assert.exact.never<Keys>
  })
})

// ============================================================================
// Runtime Tests
// ============================================================================

describe('extractUniqueKeys', () => {
  test('extracts multiple unique keys', () => {
    const keys = extractUniqueKeys(MultiKeySchema)
    expect(keys).toContain('id')
    expect(keys).toContain('email')
    expect(keys).toHaveLength(2)
  })

  test('extracts single unique key', () => {
    const keys = extractUniqueKeys(SingleKeySchema)
    expect(keys).toEqual(['slug'])
  })

  test('returns empty array for schema with no unique keys', () => {
    const keys = extractUniqueKeys(NoKeySchema)
    expect(keys).toEqual([])
  })
})

describe('UniqueKey combinator', () => {
  test('preserves schema decode behavior', () => {
    const schema = UniqueKey(S.String)
    const result = S.decodeUnknownSync(schema)('hello')
    expect(result).toBe('hello')
  })

  test('preserves schema encode behavior', () => {
    const schema = UniqueKey(S.String)
    const result = S.encodeSync(schema)('hello')
    expect(result).toBe('hello')
  })

  test('rejects invalid input', () => {
    const schema = UniqueKey(S.String)
    expect(() => S.decodeUnknownSync(schema)(123)).toThrow()
  })

  test('works with refined string schemas', () => {
    const EmailSchema = S.String.pipe(S.pattern(/@/))
    const schema = UniqueKey(EmailSchema)
    const result = S.decodeUnknownSync(schema)('test@example.com')
    expect(result).toBe('test@example.com')
  })

  test('only accepts string schemas at type level', () => {
    // @ts-expect-error - Number is not assignable to string schema
    UniqueKey(S.Number)

    // @ts-expect-error - Boolean is not assignable to string schema
    UniqueKey(S.Boolean)
  })
})

describe('type and runtime alignment', () => {
  test('runtime extraction matches type extraction', () => {
    const keys = extractUniqueKeys(MultiKeySchema)

    // Runtime keys should be typed as ExtractUniqueKeys<typeof MultiKeySchema>
    type ExpectedKeys = ExtractUniqueKeys<typeof MultiKeySchema>
    Ts.Assert.exact.ofAs<ExpectedKeys[]>().on(keys)

    expect(keys.sort()).toEqual(['email', 'id'])
  })
})

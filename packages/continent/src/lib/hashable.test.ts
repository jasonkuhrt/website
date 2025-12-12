import * as S from 'effect/Schema'
import { describe, expect, test } from 'vitest'
import { ensureHashableSchema, isSchemaProducingHashableData } from './hashable.js'

describe('isSchemaProducingHashableData', () => {
  test('plain S.Struct() returns false', () => {
    const schema = S.Struct({ name: S.String, age: S.Number })
    expect(isSchemaProducingHashableData(schema)).toBe(false)
  })

  test('S.Data(S.Struct()) returns true', () => {
    const schema = S.Data(S.Struct({ name: S.String, age: S.Number }))
    expect(isSchemaProducingHashableData(schema)).toBe(true)
  })

  test('Schema.Class returns true', () => {
    class Person extends S.Class<Person>('Person')({
      name: S.String,
      age: S.Number,
    }) {}
    expect(isSchemaProducingHashableData(Person)).toBe(true)
  })

  test('primitive schemas return false', () => {
    expect(isSchemaProducingHashableData(S.String)).toBe(false)
    expect(isSchemaProducingHashableData(S.Number)).toBe(false)
    expect(isSchemaProducingHashableData(S.Boolean)).toBe(false)
  })

  test('S.Array returns false', () => {
    const schema = S.Array(S.String)
    expect(isSchemaProducingHashableData(schema)).toBe(false)
  })
})

describe('ensureHashableSchema', () => {
  test('wraps plain struct with S.Data()', () => {
    const schema = S.Struct({ name: S.String })
    const hashable = ensureHashableSchema(schema)

    // Verify the returned schema produces hashable data
    expect(isSchemaProducingHashableData(hashable)).toBe(true)
  })

  test('passes through already S.Data-wrapped schema', () => {
    const schema = S.Data(S.Struct({ name: S.String }))
    const hashable = ensureHashableSchema(schema)

    // Should be the same schema (not double-wrapped)
    expect(hashable).toBe(schema)
  })

  test('passes through Schema.Class', () => {
    class Person extends S.Class<Person>('Person')({
      name: S.String,
    }) {}

    const hashable = ensureHashableSchema(Person)

    // Should be the same class (not wrapped)
    expect(hashable).toBe(Person)
  })
})

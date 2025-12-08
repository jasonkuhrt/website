import { Effect, Option, Stream } from 'effect'
import { describe, expect, test } from 'vitest'
import * as DefinitionRegistry from './definition-registry.js'

const def = (tag: string, version = 1, sourceFilePath?: string): DefinitionRegistry.Definition => ({
  _tag: tag,
  version,
  store: { watchPaths: [`content/${tag}`], watchGlobs: [`content/${tag}/**/*.md`] },
  sourceFilePath,
})

const create = (opts: Partial<DefinitionRegistry.Config> = {}) =>
  DefinitionRegistry.create({ discoveryGlob: '**/*.ts', root: process.cwd(), ...opts })

describe('create', () => {
  test('empty registry', () => {
    expect(create().getAll()).toEqual([])
  })

  test('with initial definitions', () => {
    const r = create({ definitions: [def('a'), def('b')] })
    expect(r.getAll()).toHaveLength(2)
  })
})

describe('register / get / remove', () => {
  test('register + get', () => {
    const r = create()
    r.register(def('a'))
    expect(r.get('a')?._tag).toBe('a')
  })

  test('get missing returns undefined', () => {
    expect(create().get('x')).toBeUndefined()
  })

  test('remove', () => {
    const r = create()
    r.register(def('a'))
    r.remove('a')
    expect(r.get('a')).toBeUndefined()
  })

  test('overwrite same tag', () => {
    const r = create()
    r.register(def('a', 1))
    r.register(def('a', 2))
    expect(r.get('a')?.version).toBe(2)
  })
})

describe('getByWatchedFilePath', () => {
  test('matches glob', () => {
    const r = create()
    r.register({ _tag: 'essay', version: 1, store: { watchPaths: [], watchGlobs: ['content/essays/**/*.md'] } })
    expect(r.getByWatchedFilePath('content/essays/foo.md')).toHaveLength(1)
  })

  test('no match', () => {
    const r = create()
    r.register({ _tag: 'essay', version: 1, store: { watchPaths: [], watchGlobs: ['content/essays/**/*.md'] } })
    expect(r.getByWatchedFilePath('other/file.txt')).toEqual([])
  })
})

describe('source file tracking', () => {
  test('getBySourceFile', () => {
    const r = create()
    r.register(def('a', 1, 'src/a.ts'))
    expect(Option.isSome(r.getBySourceFile('src/a.ts'))).toBe(true)
    expect(Option.isNone(r.getBySourceFile('src/b.ts'))).toBe(true)
  })

  test('unregisterBySourceFile', () => {
    const r = create()
    r.register(def('a', 1, 'src/a.ts'))
    expect(Option.isSome(r.unregisterBySourceFile('src/a.ts'))).toBe(true)
    expect(r.get('a')).toBeUndefined()
  })
})

describe('getAffectedByFilePath', () => {
  test('Nothing for unrelated', () => {
    expect(create().getAffectedByFilePath('random.tsx')._tag).toBe('Nothing')
  })

  test('Definition for discovery glob match', () => {
    expect(create({ discoveryGlob: 'src/**/*.ts' }).getAffectedByFilePath('src/foo.ts')._tag).toBe('Definition')
  })

  test('Content for watched path', () => {
    const r = create()
    r.register({ _tag: 'essay', version: 1, store: { watchPaths: [], watchGlobs: ['content/**/*.md'] } })
    const result = r.getAffectedByFilePath('content/foo.md')
    expect(result._tag).toBe('Content')
  })
})

describe('importStream - cold start + hot tail', () => {
  test('late subscriber gets current definitions', async () => {
    const r = create({ definitions: [def('a'), def('b')] })
    const collected = await Effect.runPromise(Stream.take(r.importStream, 2).pipe(Stream.runCollect))
    expect(Array.from(collected)).toHaveLength(2)
  })

  test('receives new registrations', async () => {
    const r = create()
    const promise = Effect.runPromise(Stream.take(r.importStream, 1).pipe(Stream.runCollect))
    r.register(def('a'))
    expect(Array.from(await promise)).toHaveLength(1)
  })

  test('fresh snapshot per subscriber', async () => {
    const r = create()
    r.register(def('a'))
    await Effect.runPromise(Stream.take(r.importStream, 1).pipe(Stream.runCollect))
    r.register(def('b'))
    const second = await Effect.runPromise(Stream.take(r.importStream, 2).pipe(Stream.runCollect))
    expect(Array.from(second)).toHaveLength(2)
  })
})

describe('isDefinition', () => {
  test('valid', () => expect(DefinitionRegistry.isDefinition(def('a'))).toBe(true))
  test('null', () => expect(DefinitionRegistry.isDefinition(null)).toBe(false))
  test('missing fields', () => expect(DefinitionRegistry.isDefinition({ _tag: 'a' })).toBe(false))
})

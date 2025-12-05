import { FileSystem } from '@effect/platform'
import { NodeContext } from '@effect/platform-node'
import { Effect, Layer, Option } from 'effect'
import * as S from 'effect/Schema'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { Cache, type CacheEvent, CacheCustom, Content, Store, UniqueKey } from './_.js'
import { flushIfDirty } from './cache.js'

// ============================================================================
// Test Fixtures
// ============================================================================

const TEST_DIR = '.test-cache'
const CONTENT_DIR = `${TEST_DIR}/content`
const CACHE_DIR = `${TEST_DIR}/cache`

// Create a test cache layer that uses a real directory
const TestCacheLayer = CacheCustom(CACHE_DIR)

// Simple content schema with unique key
const TestContent = (options?: { onCacheEvent?: (event: CacheEvent) => void }) =>
  Content('test-cache', {
    store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
    schema: {
      slug: UniqueKey(S.String),
      content: S.String,
      processed: S.Boolean,
    },
    async map(source) {
      return {
        slug: source.stem,
        content: source.content.toUpperCase(),
        processed: true,
      }
    },
    onCacheEvent: options?.onCacheEvent,
  })

// Helper to run Effects with NodeContext and TestCacheLayer
const run = <A, E>(effect: Effect.Effect<A, E, FileSystem.FileSystem | Cache>): Promise<A> =>
  Effect.runPromise(effect.pipe(Effect.provide(TestCacheLayer), Effect.provide(NodeContext.layer)))

// ============================================================================
// Setup / Teardown
// ============================================================================

beforeEach(async () => {
  // Create fresh test directories
  await mkdir(CONTENT_DIR, { recursive: true })
})

afterEach(async () => {
  // Clean up test directory (includes content and cache subdirs)
  await rm(TEST_DIR, { recursive: true, force: true })
})

// ============================================================================
// Helper to create test content files
// ============================================================================

const createFile = async (name: string, content: string) => {
  await writeFile(join(CONTENT_DIR, name), content)
}

// ============================================================================
// Tests
// ============================================================================

describe('cache system', () => {
  test('initial load: cold cache', async () => {
    await createFile('hello.txt', 'hello world')
    await createFile('foo.txt', 'foo bar')

    const content = TestContent()
    const results = await run(content.list())

    expect(results).toHaveLength(2)
    expect(results.map(r => r.slug).sort()).toEqual(['foo', 'hello'])
    // Verify map function ran (content uppercased)
    expect(results.find(r => r.slug === 'hello')?.content).toBe('HELLO WORLD')
    expect(results.every(r => r.processed)).toBe(true)
  })

  test('cache hit: second list() uses cached records', async () => {
    await createFile('test.txt', 'test content')

    const content = TestContent()

    // First call - cache miss, runs map
    const first = await run(content.list())
    expect(first).toHaveLength(1)

    // Second call - should use cache (same instance)
    const second = await run(content.list())
    expect(second).toHaveLength(1)
    expect(second[0]).toEqual(first[0])
  })

  test('get(): O(1) lookup by unique key', async () => {
    await createFile('alpha.txt', 'alpha content')
    await createFile('beta.txt', 'beta content')

    const content = TestContent()

    // Populate cache
    await run(content.list())

    // Get by unique key (now returns Option)
    const alpha = await run(content.get({ slug: 'alpha' }))
    expect(Option.isSome(alpha)).toBe(true)
    expect(Option.getOrThrow(alpha).content).toBe('ALPHA CONTENT')

    const beta = await run(content.get({ slug: 'beta' }))
    expect(Option.getOrThrow(beta).content).toBe('BETA CONTENT')

    // Non-existent key
    const missing = await run(content.get({ slug: 'nonexistent' }))
    expect(Option.isNone(missing)).toBe(true)
  })

  test('flush: persists cache to disk', async () => {
    await createFile('persist.txt', 'persist me')

    const content = TestContent()
    await run(content.list())
    // Flush cache to disk
    await run(flushIfDirty)

    // Create new instance (simulating process restart)
    const content2 = TestContent()
    // Cache loads automatically via ensureLoaded when list()/get() is called

    // Should still be able to get cached record without re-running map
    const record = await run(content2.get({ slug: 'persist' }))
    expect(Option.isSome(record)).toBe(true)
    expect(Option.getOrThrow(record).content).toBe('PERSIST ME')
  })

  test('lazy cache load: restores from disk automatically', async () => {
    await createFile('restore.txt', 'restore me')

    // First instance: populate and flush
    const content1 = TestContent()
    await run(content1.list())
    await run(flushIfDirty)

    // Second instance: cache loads automatically via ensureLoaded
    const content2 = TestContent()

    // Get triggers lazy cache load from disk
    const record = await run(content2.get({ slug: 'restore' }))
    expect(Option.getOrThrow(record).content).toBe('RESTORE ME')
  })

  test('cache invalidation: content hash change triggers re-map', async () => {
    await createFile('mutable.txt', 'original')

    const content = TestContent()

    // First list
    const first = await run(content.list())
    expect(first[0]?.content).toBe('ORIGINAL')

    // Modify content (hash changes)
    await createFile('mutable.txt', 'modified')

    // Second list - should re-run map due to hash change
    const second = await run(content.list())
    expect(second[0]?.content).toBe('MODIFIED')
  })

  test('cache handles new files added', async () => {
    await createFile('existing.txt', 'existing')

    const content = TestContent()

    // Initial list
    const first = await run(content.list())
    expect(first).toHaveLength(1)

    // Add new file
    await createFile('new.txt', 'new content')

    // Should pick up new file
    const second = await run(content.list())
    expect(second).toHaveLength(2)
    expect(second.map(r => r.slug).sort()).toEqual(['existing', 'new'])
  })

  test('get() populates cache if not already loaded', async () => {
    await createFile('lazy.txt', 'lazy load')

    const content = TestContent()

    // Direct get without list() first
    const record = await run(content.get({ slug: 'lazy' }))
    expect(Option.isSome(record)).toBe(true)
    expect(Option.getOrThrow(record).content).toBe('LAZY LOAD')
  })

  test('onCacheEvent: tracks hits and misses', async () => {
    await createFile('tracked.txt', 'track me')

    const events: CacheEvent[] = []
    const content = TestContent({
      onCacheEvent: (e) => events.push(e),
    })

    // Run both operations in the same Effect scope to share cache
    await run(
      Effect.gen(function* () {
        // First call - should be a miss
        yield* content.list()
        expect(events).toHaveLength(1)
        expect(events[0]!.type).toBe('miss')

        // Clear events
        events.length = 0

        // Second call - should be a hit (same cache instance)
        yield* content.list()
        expect(events).toHaveLength(1)
        expect(events[0]!.type).toBe('hit')
      }),
    )
  })

  test('hash stability: cache hits after process restart', async () => {
    await createFile('stable.txt', 'stable content')

    // First instance - populate and flush within same Effect scope
    const content1 = TestContent()
    await run(
      Effect.gen(function* () {
        yield* content1.list()
        yield* flushIfDirty
      }),
    )

    // Second instance with tracking (simulates process restart with fresh cache layer)
    // Use a FRESH cache layer that will load from the directory we just flushed to
    const FreshCacheLayer = CacheCustom(CACHE_DIR)
    const events: CacheEvent[] = []
    const content2 = TestContent({
      onCacheEvent: (e) => events.push(e),
    })

    // This should hit the cache since hash should be stable and cache loads from disk
    await Effect.runPromise(
      content2.list().pipe(Effect.provide(FreshCacheLayer), Effect.provide(NodeContext.layer)),
    )

    expect(events).toHaveLength(1)
    expect(events[0]!.type).toBe('hit')
  })

  test('schema registration: Date fields survive flush/load cycle', async () => {
    await createFile('dated.txt', 'dated content')

    // Content with Date field in schema
    const TestContentWithDate = () =>
      Content('test-dated', {
        store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
        schema: {
          slug: UniqueKey(S.String),
          createdAt: S.Date,
        },
        async map(source) {
          return {
            slug: source.stem,
            createdAt: new Date('2024-01-15T10:30:00.000Z'),
          }
        },
      })

    // First instance - populate and flush
    const content1 = TestContentWithDate()
    await run(
      Effect.gen(function* () {
        const results = yield* content1.list()
        expect(results[0]!.createdAt).toBeInstanceOf(Date)
        yield* flushIfDirty
      }),
    )

    // Fresh cache layer (simulates process restart)
    const FreshCacheLayer = CacheCustom(CACHE_DIR)
    const content2 = TestContentWithDate()

    // Load from disk - Date should be restored as Date object, not string
    const results = await Effect.runPromise(
      content2.list().pipe(Effect.provide(FreshCacheLayer), Effect.provide(NodeContext.layer)),
    )

    expect(results).toHaveLength(1)
    expect(results[0]!.createdAt).toBeInstanceOf(Date)
    expect(results[0]!.createdAt.toISOString()).toBe('2024-01-15T10:30:00.000Z')
  })
})

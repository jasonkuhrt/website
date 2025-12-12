import { FileSystem } from '@effect/platform'
import { NodeContext } from '@effect/platform-node'
import { Effect, Option } from 'effect'
import * as S from 'effect/Schema'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { Cache, CacheCustom, type CacheEvent, Content, SecondaryKey, Store } from './_.js'
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
      slug: SecondaryKey.SecondaryKey(S.String),
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
    const alpha = await run(content.getBy({ slug: 'alpha' }))
    expect(Option.isSome(alpha)).toBe(true)
    expect(Option.getOrThrow(alpha).content).toBe('ALPHA CONTENT')

    const beta = await run(content.getBy({ slug: 'beta' }))
    expect(Option.getOrThrow(beta).content).toBe('BETA CONTENT')

    // Non-existent key
    const missing = await run(content.getBy({ slug: 'nonexistent' }))
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
    const record = await run(content2.getBy({ slug: 'persist' }))
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
    const record = await run(content2.getBy({ slug: 'restore' }))
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
    const record = await run(content.getBy({ slug: 'lazy' }))
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
      Effect.gen(function*() {
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
      Effect.gen(function*() {
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
      Effect.gen(function*() {
        yield* content2.restoreCache()
        yield* content2.list()
      }).pipe(Effect.provide(FreshCacheLayer), Effect.provide(NodeContext.layer)),
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
          slug: SecondaryKey.SecondaryKey(S.String),
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
      Effect.gen(function*() {
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

// ============================================================================
// Version-based Cache Invalidation Tests
// ============================================================================

describe('version-based cache invalidation', () => {
  test('default: auto-hashes map.toString() - different map body causes cache miss', async () => {
    await createFile('version-test.txt', 'content')

    // First content definition with one map implementation
    const content1 = Content('test-version-auto', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      async map(source) {
        return { slug: source.stem, value: 'VERSION_A' }
      },
    })

    // Populate and flush
    await run(
      Effect.gen(function*() {
        const results = yield* content1.list()
        expect(results[0]!.value).toBe('VERSION_A')
        yield* flushIfDirty
      }),
    )

    // Fresh cache layer (simulates process restart)
    const FreshCacheLayer = CacheCustom(CACHE_DIR)

    // Different map body should cause cache miss
    const events: CacheEvent[] = []
    const content2 = Content('test-version-auto', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      async map(source) {
        return { slug: source.stem, value: 'VERSION_B' } // Different map body
      },
      onCacheEvent: (e) => events.push(e),
    })

    const results = await Effect.runPromise(
      content2.list().pipe(Effect.provide(FreshCacheLayer), Effect.provide(NodeContext.layer)),
    )

    // Should be a cache miss because map.toString() changed
    expect(events[0]!.type).toBe('miss')
    expect(results[0]!.value).toBe('VERSION_B')
  })

  test('default: same map body causes cache hit', async () => {
    await createFile('same-map.txt', 'content')

    // Use a named function to ensure consistent toString()
    const mapFn = async (source: { stem: string }) => ({
      slug: source.stem,
      value: 'SAME_VALUE',
    })

    const content1 = Content('test-same-map', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      map: mapFn,
    })

    // Populate and flush
    await run(
      Effect.gen(function*() {
        yield* content1.list()
        yield* flushIfDirty
      }),
    )

    // Fresh cache layer
    const FreshCacheLayer = CacheCustom(CACHE_DIR)
    const events: CacheEvent[] = []

    const content2 = Content('test-same-map', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      map: mapFn, // Same map function
      onCacheEvent: (e) => events.push(e),
    })

    await Effect.runPromise(
      Effect.gen(function*() {
        yield* content2.restoreCache()
        yield* content2.list()
      }).pipe(Effect.provide(FreshCacheLayer), Effect.provide(NodeContext.layer)),
    )

    // Should be a cache hit because map.toString() is identical
    expect(events[0]!.type).toBe('hit')
  })

  test('static version: overrides auto-hash, map changes ignored', async () => {
    await createFile('static-version.txt', 'content')

    const content1 = Content('test-static-version', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 1, // Explicit static version
      async map(source) {
        return { slug: source.stem, value: 'ORIGINAL' }
      },
    })

    // Populate and flush
    await run(
      Effect.gen(function*() {
        const results = yield* content1.list()
        expect(results[0]!.value).toBe('ORIGINAL')
        yield* flushIfDirty
      }),
    )

    // Fresh cache layer
    const FreshCacheLayer = CacheCustom(CACHE_DIR)
    const events: CacheEvent[] = []

    // Different map body BUT same version - should HIT cache
    const content2 = Content('test-static-version', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 1, // Same version
      async map(source) {
        return { slug: source.stem, value: 'CHANGED_BUT_IGNORED' } // Different map
      },
      onCacheEvent: (e) => events.push(e),
    })

    const results = await Effect.runPromise(
      Effect.gen(function*() {
        yield* content2.restoreCache()
        return yield* content2.list()
      }).pipe(Effect.provide(FreshCacheLayer), Effect.provide(NodeContext.layer)),
    )

    // Should be a cache HIT because version is the same (map.toString() is ignored)
    expect(events[0]!.type).toBe('hit')
    // Returns cached value, NOT the new map result
    expect(results[0]!.value).toBe('ORIGINAL')
  })

  test('static version: bumping version causes cache miss', async () => {
    await createFile('bump-version.txt', 'content')

    const content1 = Content('test-bump-version', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 1,
      async map(source) {
        return { slug: source.stem, value: 'V1' }
      },
    })

    // Populate and flush
    await run(
      Effect.gen(function*() {
        yield* content1.list()
        yield* flushIfDirty
      }),
    )

    // Fresh cache layer
    const FreshCacheLayer = CacheCustom(CACHE_DIR)
    const events: CacheEvent[] = []

    // Bumped version - should MISS cache
    const content2 = Content('test-bump-version', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 2, // Bumped!
      async map(source) {
        return { slug: source.stem, value: 'V2' }
      },
      onCacheEvent: (e) => events.push(e),
    })

    const results = await Effect.runPromise(
      content2.list().pipe(Effect.provide(FreshCacheLayer), Effect.provide(NodeContext.layer)),
    )

    // Should be a cache MISS because version changed
    expect(events[0]!.type).toBe('miss')
    expect(results[0]!.value).toBe('V2')
  })

  test('function version: computes hash dynamically', async () => {
    await createFile('fn-version.txt', 'content')

    let versionValue = 100

    const content1 = Content('test-fn-version', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: () => versionValue,
      async map(source) {
        return { slug: source.stem, value: 'FN_VERSION' }
      },
    })

    // Populate and flush
    await run(
      Effect.gen(function*() {
        yield* content1.list()
        yield* flushIfDirty
      }),
    )

    // Fresh cache layer
    const FreshCacheLayer = CacheCustom(CACHE_DIR)
    const events: CacheEvent[] = []

    // Same function returning same value - should HIT
    const content2 = Content('test-fn-version', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: () => versionValue, // Same value (100)
      async map(source) {
        return { slug: source.stem, value: 'FN_VERSION' }
      },
      onCacheEvent: (e) => events.push(e),
    })

    await Effect.runPromise(
      Effect.gen(function*() {
        yield* content2.restoreCache()
        yield* content2.list()
      }).pipe(Effect.provide(FreshCacheLayer), Effect.provide(NodeContext.layer)),
    )

    expect(events[0]!.type).toBe('hit')
  })

  test('function version: changing return value causes cache miss', async () => {
    await createFile('fn-change.txt', 'content')

    const content1 = Content('test-fn-change', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: () => 'config-v1',
      async map(source) {
        return { slug: source.stem, value: 'CONFIG_V1' }
      },
    })

    // Populate and flush
    await run(
      Effect.gen(function*() {
        yield* content1.list()
        yield* flushIfDirty
      }),
    )

    // Fresh cache layer
    const FreshCacheLayer = CacheCustom(CACHE_DIR)
    const events: CacheEvent[] = []

    // Function returns different value - should MISS
    const content2 = Content('test-fn-change', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: () => 'config-v2', // Different return value
      async map(source) {
        return { slug: source.stem, value: 'CONFIG_V2' }
      },
      onCacheEvent: (e) => events.push(e),
    })

    const results = await Effect.runPromise(
      content2.list().pipe(Effect.provide(FreshCacheLayer), Effect.provide(NodeContext.layer)),
    )

    expect(events[0]!.type).toBe('miss')
    expect(results[0]!.value).toBe('CONFIG_V2')
  })

  test('string version: works like numeric version', async () => {
    await createFile('str-version.txt', 'content')

    const content1 = Content('test-str-version', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 'v1.0.0', // String version
      async map(source) {
        return { slug: source.stem, value: 'STRING_V1' }
      },
    })

    // Populate and flush
    await run(
      Effect.gen(function*() {
        yield* content1.list()
        yield* flushIfDirty
      }),
    )

    // Fresh cache layer
    const FreshCacheLayer = CacheCustom(CACHE_DIR)
    const events: CacheEvent[] = []

    // Same string version - should HIT
    const content2 = Content('test-str-version', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 'v1.0.0',
      async map(source) {
        return { slug: source.stem, value: 'STRING_V1' }
      },
      onCacheEvent: (e) => events.push(e),
    })

    await Effect.runPromise(
      Effect.gen(function*() {
        yield* content2.restoreCache()
        yield* content2.list()
      }).pipe(Effect.provide(FreshCacheLayer), Effect.provide(NodeContext.layer)),
    )

    expect(events[0]!.type).toBe('hit')
  })

  test('no map function: version has no effect (passthrough)', async () => {
    await createFile('no-map.txt', 'raw content')

    // Content without map (passthrough) - version should be ignored
    const content1 = Content('test-no-map', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      version: 1, // Should be ignored since there's no map
    })

    const results = await run(content1.list())
    expect(results[0]!.content).toBe('raw content')
  })
})

// ============================================================================
// Content.version Property Tests
// ============================================================================

describe('Content.version property', () => {
  test('Content exposes computed version number', async () => {
    const content = Content('test-version-prop', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 42,
      async map(source) {
        return { slug: source.stem, value: 'test' }
      },
    })

    expect(typeof content.version).toBe('number')
  })

  test('version is hash of config.version', async () => {
    const content1 = Content('test-version-hash', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 1,
      async map(source) {
        return { slug: source.stem, value: 'test' }
      },
    })

    const content2 = Content('test-version-hash-2', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 2,
      async map(source) {
        return { slug: source.stem, value: 'test' }
      },
    })

    // Different version configs should produce different version hashes
    expect(content1.version).not.toBe(content2.version)
  })
})

// ============================================================================
// pruneOrphans Tests
// ============================================================================

describe('pruneOrphans', () => {
  test('removes entries with different version', async () => {
    await createFile('prune-test.txt', 'content')

    // Create content with version 1
    const content1 = Content('test-prune', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 1,
      async map(source) {
        return { slug: source.stem, value: 'V1' }
      },
    })

    // Create content with version 2 (different version)
    const content2 = Content('test-prune', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 2,
      async map(source) {
        return { slug: source.stem, value: 'V2' }
      },
    })

    // Run entire sequence in single Effect to share cache instance
    const pruned = await run(
      Effect.gen(function*() {
        // Populate cache with version 1
        yield* content1.list()

        // Prune orphans with version 2
        const cache = yield* Cache
        return cache.pruneOrphans('test-prune', content2.version)
      }),
    )

    // Should have pruned 1 entry (the old version 1 entry)
    expect(pruned).toBe(1)
  })

  test('returns 0 when no orphans exist', async () => {
    await createFile('no-orphans.txt', 'content')

    const content = Content('test-no-orphans', {
      store: Store.dir({ glob: `${CONTENT_DIR}/*.txt` }),
      schema: {
        slug: SecondaryKey.SecondaryKey(S.String),
        value: S.String,
      },
      version: 1,
      async map(source) {
        return { slug: source.stem, value: 'test' }
      },
    })

    // Populate cache
    await run(content.list())

    // Prune with same version - should find no orphans
    const pruned = await run(
      Effect.gen(function*() {
        const cache = yield* Cache
        return cache.pruneOrphans('test-no-orphans', content.version)
      }),
    )

    expect(pruned).toBe(0)
  })

  test('returns 0 for non-existent namespace', async () => {
    const pruned = await run(
      Effect.gen(function*() {
        const cache = yield* Cache
        return cache.pruneOrphans('non-existent-namespace', 12345)
      }),
    )

    expect(pruned).toBe(0)
  })
})

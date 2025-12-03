import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as S from 'effect/Schema'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { Content, Store, UniqueKey } from './_.js'

// ============================================================================
// Test Fixtures
// ============================================================================

const TEST_DIR = '.test-cache'
const CONTENT_DIR = `${TEST_DIR}/content`
const CACHE_FILE = '.cache/test-cache.json' // Content uses .cache/<tag>.json

// Simple content schema with unique key
const TestContent = () =>
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
  })

// ============================================================================
// Setup / Teardown
// ============================================================================

beforeEach(async () => {
  // Create fresh test directories
  await mkdir(CONTENT_DIR, { recursive: true })
})

afterEach(async () => {
  // Clean up test content directory
  await rm(TEST_DIR, { recursive: true, force: true })
  // Clean up cache file (created at cwd/.cache/test-cache.json)
  await rm(CACHE_FILE, { force: true })
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
    const results = await content.list()

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
    const first = await content.list()
    expect(first).toHaveLength(1)

    // Second call - should use cache (same instance)
    const second = await content.list()
    expect(second).toHaveLength(1)
    expect(second[0]).toEqual(first[0])
  })

  test('get(): O(1) lookup by unique key', async () => {
    await createFile('alpha.txt', 'alpha content')
    await createFile('beta.txt', 'beta content')

    const content = TestContent()

    // Populate cache
    await content.list()

    // Get by unique key
    const alpha = await content.get({ slug: 'alpha' })
    expect(alpha).toBeDefined()
    expect(alpha?.content).toBe('ALPHA CONTENT')

    const beta = await content.get({ slug: 'beta' })
    expect(beta?.content).toBe('BETA CONTENT')

    // Non-existent key
    const missing = await content.get({ slug: 'nonexistent' })
    expect(missing).toBeUndefined()
  })

  test('flush: persists cache to disk', async () => {
    await createFile('persist.txt', 'persist me')

    const content = TestContent()
    await content.list()
    await content.flushCache()

    // Create new instance (simulating process restart)
    const content2 = TestContent()
    await content2.loadCache()

    // Should still be able to get cached record without re-running map
    const record = await content2.get({ slug: 'persist' })
    expect(record).toBeDefined()
    expect(record?.content).toBe('PERSIST ME')
  })

  test('loadCache: restores from disk', async () => {
    await createFile('restore.txt', 'restore me')

    // First instance: populate and flush
    const content1 = TestContent()
    await content1.list()
    await content1.flushCache()

    // Second instance: load from disk
    const content2 = TestContent()
    await content2.loadCache()

    // Get should find cached record
    const record = await content2.get({ slug: 'restore' })
    expect(record?.content).toBe('RESTORE ME')
  })

  test('cache invalidation: content hash change triggers re-map', async () => {
    await createFile('mutable.txt', 'original')

    const content = TestContent()

    // First list
    const first = await content.list()
    expect(first[0]?.content).toBe('ORIGINAL')

    // Modify content (hash changes)
    await createFile('mutable.txt', 'modified')

    // Second list - should re-run map due to hash change
    const second = await content.list()
    expect(second[0]?.content).toBe('MODIFIED')
  })

  test('cache handles new files added', async () => {
    await createFile('existing.txt', 'existing')

    const content = TestContent()

    // Initial list
    const first = await content.list()
    expect(first).toHaveLength(1)

    // Add new file
    await createFile('new.txt', 'new content')

    // Should pick up new file
    const second = await content.list()
    expect(second).toHaveLength(2)
    expect(second.map(r => r.slug).sort()).toEqual(['existing', 'new'])
  })

  test('get() populates cache if not already loaded', async () => {
    await createFile('lazy.txt', 'lazy load')

    const content = TestContent()

    // Direct get without list() first
    const record = await content.get({ slug: 'lazy' })
    expect(record).toBeDefined()
    expect(record?.content).toBe('LAZY LOAD')
  })
})

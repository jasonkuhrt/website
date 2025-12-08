import { Error as PlatformErrorModule, FileSystem } from '@effect/platform'
import { Console, Context, Effect, Layer, MutableHashMap, Option, Schedule, Schema as S } from 'effect'
import { join } from 'node:path'

// ============================================================================
// Cache Service Interface
// ============================================================================

/** Schema type for encoding/decoding values at disk boundary. */
export type CacheSchema = S.Schema<any, any, any>

/**
 * Unified cache service for content definitions.
 * Uses separate cache files per namespace to avoid timing issues.
 * Data is partitioned by version - each version has its own entries and indices.
 */
export interface CacheService {
  /** Register a schema for a namespace (used for flush/load serialization). */
  registerSchema(
    /** Namespace (e.g. 'essay', 'drivel') */
    namespace: string,
    /** Schema for encoding/decoding values at disk boundary */
    schema: CacheSchema,
  ): void

  /** Get record by primary key. Validates hash before returning. */
  getByPrimaryKey(
    /** Namespace (e.g. 'essay', 'drivel') */
    namespace: string,
    /** Version number */
    version: number,
    /** Primary key (file path for dir store, hash string for js store) */
    primaryKey: string,
    /** Expected hash for validation (returns None if mismatch) */
    hash: number,
  ): Option.Option<unknown>

  /** Set record by primary key with hash for validation. */
  setByPrimaryKey(
    /** Namespace (e.g. 'essay', 'drivel') */
    namespace: string,
    /** Version number */
    version: number,
    /** Primary key (file path for dir store, hash string for js store) */
    primaryKey: string,
    /** Hash for content validation */
    hash: number,
    /** Processed value to cache */
    value: unknown,
  ): void

  /** Get record by secondary key (O(1) lookup via index). */
  getBySecondaryKey(
    /** Namespace (e.g. 'essay', 'drivel') */
    namespace: string,
    /** Version number */
    version: number,
    /** Secondary key name (e.g. 'slug', 'id') */
    keyName: string,
    /** Secondary key value (e.g. 'my-post') */
    keyValue: string,
  ): Option.Option<unknown>

  /** Set secondary key mapping to primary key. */
  setSecondaryKey(
    /** Namespace (e.g. 'essay', 'drivel') */
    namespace: string,
    /** Version number */
    version: number,
    /** Secondary key name (e.g. 'slug', 'id') */
    keyName: string,
    /** Secondary key value (e.g. 'my-post') */
    keyValue: string,
    /** Primary key this secondary key resolves to */
    primaryKey: string,
  ): void

  /** Clear a specific entry by primary key and remove any secondary keys pointing to it. Returns true if entry existed. */
  removeByPrimaryKey(
    /** Namespace (e.g. 'essay', 'drivel') */
    namespace: string,
    /** Version number */
    version: number,
    /** Primary key to remove */
    primaryKey: string,
  ): boolean

  /** Clear all entries in a namespace (for invalidation). Returns count of entries removed. */
  removeAllInNamespace(
    /** Namespace to clear */
    namespace: string,
  ): number

  /** Prune orphan entries with versions different from currentVersion. Returns count pruned. */
  pruneOrphans(
    /** Namespace */
    namespace: string,
    /** Version to keep; all other versions are pruned */
    currentVersion: number,
  ): number

  /** Check if cache has unsaved changes (any namespace). */
  isDirty(): boolean

  /** Flush all dirty namespaces to disk. */
  flush(): Effect.Effect<void, PlatformErrorModule.PlatformError, FileSystem.FileSystem>

  /** Load a namespace's cache from disk. Schema must be registered first. */
  load(
    /** Namespace to load */
    namespace: string,
  ): Effect.Effect<void, PlatformErrorModule.PlatformError, FileSystem.FileSystem>
}

// ============================================================================
// Cache Service Tag
// ============================================================================

export class Cache extends Context.Tag('continent/Cache')<Cache, CacheService>() {}

// ============================================================================
// Per-Version Bucket (entries + indices)
// ============================================================================

/** Entry stored with hash for validation. */
interface CacheEntry {
  hash: number
  value: unknown
}

interface VersionBucket {
  /** primaryKey → { hash, value } */
  entries: MutableHashMap.MutableHashMap<string, CacheEntry>
  /** keyName → keyValue → primaryKey */
  indices: MutableHashMap.MutableHashMap<string, MutableHashMap.MutableHashMap<string, string>>
}

const createVersionBucket = (): VersionBucket => ({
  entries: MutableHashMap.empty(),
  indices: MutableHashMap.empty(),
})

// ============================================================================
// Per-Namespace State
// ============================================================================

interface NamespaceState {
  /** version → bucket (entries + indices partitioned by version) */
  data: MutableHashMap.MutableHashMap<number, VersionBucket>
  /** Schema for encoding/decoding at disk boundary */
  schema: CacheSchema | null
  dirty: boolean
  loaded: boolean
}

// ============================================================================
// Cache File Schema
// ============================================================================

/** Schema for cache file format: JSON array of [version, primaryKey, hash, encodedValue] tuples. */
const CacheFileSchema = S.parseJson(S.Array(S.Tuple(S.Number, S.String, S.Number, S.Unknown)))

// ============================================================================
// Cache Implementation
// ============================================================================

const createCacheImpl = (cacheDir: string): CacheService => {
  /** MutableHashMap of namespace → state */
  const namespaces: MutableHashMap.MutableHashMap<string, NamespaceState> = MutableHashMap.empty()

  const getOrCreateNamespace = (namespace: string): NamespaceState => {
    const existing = MutableHashMap.get(namespaces, namespace)
    if (Option.isSome(existing)) return existing.value
    const state: NamespaceState = {
      data: MutableHashMap.empty(),
      schema: null,
      dirty: false,
      loaded: false,
    }
    MutableHashMap.set(namespaces, namespace, state)
    return state
  }

  const getOrCreateBucket = (ns: NamespaceState, version: number): VersionBucket => {
    return MutableHashMap.get(ns.data, version).pipe(
      Option.getOrElse(() => {
        const bucket = createVersionBucket()
        MutableHashMap.set(ns.data, version, bucket)
        return bucket
      }),
    )
  }

  const cachePathForNamespace = (namespace: string) => join(cacheDir, `${namespace}.json`)

  return {
    registerSchema(namespace: string, schema: CacheSchema) {
      getOrCreateNamespace(namespace).schema = schema
    },

    getByPrimaryKey(namespace: string, version: number, primaryKey: string, hash: number) {
      const ns = getOrCreateNamespace(namespace)
      return MutableHashMap.get(ns.data, version).pipe(
        Option.flatMap((bucket) => MutableHashMap.get(bucket.entries, primaryKey)),
        Option.filter((entry) => entry.hash === hash),
        Option.map((entry) => entry.value),
      )
    },

    setByPrimaryKey(namespace: string, version: number, primaryKey: string, hash: number, value: unknown) {
      const ns = getOrCreateNamespace(namespace)
      const bucket = getOrCreateBucket(ns, version)
      MutableHashMap.set(bucket.entries, primaryKey, { hash, value })
      ns.dirty = true
    },

    getBySecondaryKey(namespace: string, version: number, keyName: string, keyValue: string) {
      const ns = getOrCreateNamespace(namespace)
      return MutableHashMap.get(ns.data, version).pipe(
        Option.flatMap((bucket) => MutableHashMap.get(bucket.indices, keyName)),
        Option.flatMap((keyIndex) => MutableHashMap.get(keyIndex, keyValue)),
        Option.flatMap((primaryKey) =>
          MutableHashMap.get(ns.data, version).pipe(
            Option.flatMap((bucket) => MutableHashMap.get(bucket.entries, primaryKey)),
            Option.map((entry) => entry.value),
          )
        ),
      )
    },

    setSecondaryKey(namespace: string, version: number, keyName: string, keyValue: string, primaryKey: string) {
      const ns = getOrCreateNamespace(namespace)
      const bucket = getOrCreateBucket(ns, version)

      // Get or create key index
      const keyIndex = MutableHashMap.get(bucket.indices, keyName).pipe(
        Option.getOrElse(() => {
          const newIndex = MutableHashMap.empty<string, string>()
          MutableHashMap.set(bucket.indices, keyName, newIndex)
          return newIndex
        }),
      )

      MutableHashMap.set(keyIndex, keyValue, primaryKey)
    },

    removeByPrimaryKey(namespace: string, version: number, primaryKey: string): boolean {
      const nsOpt = MutableHashMap.get(namespaces, namespace)
      if (Option.isNone(nsOpt)) return false

      const ns = nsOpt.value
      const bucketOpt = MutableHashMap.get(ns.data, version)
      if (Option.isNone(bucketOpt)) return false

      const bucket = bucketOpt.value
      const existed = MutableHashMap.has(bucket.entries, primaryKey)
      if (!existed) return false

      // Remove the primary key entry
      MutableHashMap.remove(bucket.entries, primaryKey)

      // Remove any secondary keys pointing to this primary key
      for (const [, keyIndex] of bucket.indices) {
        const keysToRemove: string[] = []
        for (const [keyValue, pk] of keyIndex) if (pk === primaryKey) keysToRemove.push(keyValue)
        for (const keyValue of keysToRemove) MutableHashMap.remove(keyIndex, keyValue)
      }

      ns.dirty = true
      return true
    },

    removeAllInNamespace(namespace): number {
      const nsOpt = MutableHashMap.get(namespaces, namespace)
      if (Option.isNone(nsOpt)) return 0

      const ns = nsOpt.value
      let count = 0
      for (const [, bucket] of ns.data) {
        count += MutableHashMap.size(bucket.entries)
      }

      ns.data = MutableHashMap.empty()
      ns.dirty = true
      return count
    },

    isDirty() {
      for (const [, ns] of namespaces) if (ns.dirty) return true
      return false
    },

    flush() {
      return Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem

        for (const [namespace, state] of namespaces) {
          if (!state.dirty) continue

          yield* fs.makeDirectory(cacheDir, { recursive: true })

          // Flatten: [version, primaryKey, hash, encodedValue] (indices are not persisted, rebuilt on list())
          const entries: [number, string, number, unknown][] = []
          for (const [version, bucket] of state.data) {
            for (const [primaryKey, entry] of bucket.entries) {
              const encodedValue = state.schema ?
                S.encodeSync(state.schema as S.Schema<any, any, never>)(entry.value) :
                entry.value
              entries.push([version, primaryKey, entry.hash, encodedValue])
            }
          }

          const json = S.encodeSync(CacheFileSchema)(entries)
          yield* fs.writeFileString(cachePathForNamespace(namespace), json)

          state.dirty = false
        }
      })
    },

    load(namespace) {
      return Effect.gen(function*() {
        const ns = getOrCreateNamespace(namespace)
        if (ns.loaded) return

        const fs = yield* FileSystem.FileSystem
        const path = cachePathForNamespace(namespace)
        const exists = yield* fs.exists(path)

        if (exists) {
          const content = yield* fs.readFileString(path)
          if (content.trim()) {
            const entries = S.decodeSync(CacheFileSchema)(content)
            for (const [version, primaryKey, hash, encodedValue] of entries) {
              const decoded = ns.schema ?
                S.decodeSync(ns.schema as S.Schema<any, any, never>)(encodedValue) :
                encodedValue

              const bucket = getOrCreateBucket(ns, version)
              MutableHashMap.set(bucket.entries, primaryKey, { hash, value: decoded })
              // Note: indices are not persisted, will be rebuilt when list() runs
            }
          }
        }

        ns.loaded = true
      })
    },

    pruneOrphans(namespace, currentVersion) {
      const nsOpt = MutableHashMap.get(namespaces, namespace)
      if (Option.isNone(nsOpt)) return 0

      const ns = nsOpt.value
      let pruned = 0

      // Collect versions to remove and count entries
      const versionsToRemove: number[] = []
      for (const [version, bucket] of ns.data) {
        if (version !== currentVersion) {
          pruned += MutableHashMap.size(bucket.entries)
          versionsToRemove.push(version)
        }
      }

      if (pruned === 0) return 0

      // Remove non-current versions (indices go with them automatically)
      for (const version of versionsToRemove) MutableHashMap.remove(ns.data, version)

      ns.dirty = true

      return pruned
    },
  }
}

// ============================================================================
// Core Cache Version
// ============================================================================

/**
 * Core cache format version - bump when data structure changes.
 * Old cache directories (v{N-1}/) are automatically ignored.
 */
const CACHE_VERSION = 4

// ============================================================================
// globalThis Singleton Key
// ============================================================================

const CACHE_KEY = Symbol.for('continent.cache')
const DEFAULT_CACHE_DIR = `.continent/cache/v${CACHE_VERSION}`

interface GlobalCache {
  impl: CacheService
  dir: string
}

const getGlobalCache = (cacheDir: string = DEFAULT_CACHE_DIR): CacheService => {
  const g = globalThis as any

  // If cache exists, use existing instance
  if (g[CACHE_KEY]) return (g[CACHE_KEY] as GlobalCache).impl

  const impl = createCacheImpl(join(process.cwd(), cacheDir))
  g[CACHE_KEY] = { impl, dir: cacheDir } as GlobalCache

  return impl
}

// ============================================================================
// Layers
// ============================================================================

/**
 * Live layer using globalThis singleton.
 * Safe across Vite module re-executions.
 */
export const CacheLive = Layer.sync(Cache, () => getGlobalCache())

/**
 * Test layer - fresh instance with custom directory.
 */
export const CacheTest = Layer.sync(Cache, () => createCacheImpl('/dev/null'))

/**
 * Custom layer factory for advanced use cases.
 */
export const CacheCustom = (cacheDir: string) => Layer.sync(Cache, () => createCacheImpl(cacheDir))

// ============================================================================
// Background Flush Effect
// ============================================================================

/**
 * Background flush effect.
 * Runs forever, checking every 10 seconds; if dirty, flushes.
 * Run with Effect.runFork.
 */
export const backgroundFlush: Effect.Effect<void, never, Cache | FileSystem.FileSystem> = Effect.gen(function*() {
  const cache = yield* Cache

  yield* cache.flush().pipe(
    Effect.catchAll((error) => Console.error('[continent] Background cache flush failed:', error)),
    Effect.repeat(Schedule.spaced('10 seconds')),
  )
})

/**
 * Flush cache if dirty.
 * Called on shutdown to ensure no data loss.
 */
export const flushIfDirty: Effect.Effect<void, PlatformErrorModule.PlatformError, Cache | FileSystem.FileSystem> =
  Effect.gen(function*() {
    const cache = yield* Cache
    const dirty = cache.isDirty()
    if (dirty) yield* cache.flush()
  })

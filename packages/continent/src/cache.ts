import { Error as PlatformErrorModule, FileSystem } from '@effect/platform'
import { Console, Context, Effect, Layer, Option, Schedule, Schema as S } from 'effect'
import { join } from 'node:path'

// ============================================================================
// Cache Service Interface
// ============================================================================

/** Schema type for encoding/decoding values at disk boundary. */
export type CacheSchema = S.Schema<any, any, any>

/**
 * Unified cache service for all content types.
 * Uses separate cache files per namespace to avoid timing issues.
 */
export interface CacheService {
  /** Register a schema for a namespace (used for flush/load serialization). */
  registerSchema(namespace: string, schema: CacheSchema): void

  /** Get record by namespace and content hash. */
  get(namespace: string, hash: number): Option.Option<unknown>

  /** Set record at namespace and content hash. */
  set(namespace: string, hash: number, value: unknown): Effect.Effect<void>

  /** Get record by unique key index (O(1) lookup). */
  getByKey(namespace: string, keyName: string, keyValue: string): Option.Option<unknown>

  /** Set index entry for a unique key. */
  setIndex(namespace: string, keyName: string, keyValue: string, hash: number): Effect.Effect<void>

  /** Clear all entries in a namespace (for invalidation). */
  clearNamespace(namespace: string): Effect.Effect<void>

  /** Check if cache has unsaved changes (any namespace). */
  isDirty(): Effect.Effect<boolean>

  /** Flush all dirty namespaces to disk. */
  flush(): Effect.Effect<void, PlatformErrorModule.PlatformError, FileSystem.FileSystem>

  /** Load a specific namespace's cache from disk. Schema must be registered first. */
  load(namespace: string): Effect.Effect<void, PlatformErrorModule.PlatformError, FileSystem.FileSystem>
}

// ============================================================================
// Cache Service Tag
// ============================================================================

export class Cache extends Context.Tag('continent/Cache')<Cache, CacheService>() {}

// ============================================================================
// Per-Namespace State
// ============================================================================

interface NamespaceState {
  /** hash → value */
  data: Map<number, unknown>
  /** keyName → keyValue → hash */
  indices: Map<string, Map<string, number>>
  /** Schema for encoding/decoding at disk boundary */
  schema: CacheSchema | null
  dirty: boolean
  loaded: boolean
}

// ============================================================================
// Cache File Schema
// ============================================================================

/** Schema for cache file format: JSON array of [hash, encodedValue] tuples. */
const CacheFileSchema = S.parseJson(S.Array(S.Tuple(S.Number, S.Unknown)))

// ============================================================================
// Cache Implementation
// ============================================================================

const createCacheImpl = (cacheDir: string): CacheService => {
  /** Map of namespace → state */
  const namespaces: Map<string, NamespaceState> = new Map()

  const getOrCreateNamespace = (namespace: string): NamespaceState => {
    let state = namespaces.get(namespace)
    if (!state) {
      state = {
        data: new Map(),
        indices: new Map(),
        schema: null,
        dirty: false,
        loaded: false,
      }
      namespaces.set(namespace, state)
    }
    return state
  }

  const cachePathForNamespace = (namespace: string) => join(cacheDir, `${namespace}.json`)

  return {
    registerSchema(namespace, schema) {
      getOrCreateNamespace(namespace).schema = schema
    },

    get(namespace, hash) {
      const ns = getOrCreateNamespace(namespace)
      return Option.fromNullable(ns.data.get(hash))
    },

    set(namespace, hash, value) {
      return Effect.sync(() => {
        const ns = getOrCreateNamespace(namespace)
        ns.data.set(hash, value)
        ns.dirty = true
      })
    },

    getByKey(namespace, keyName, keyValue) {
      const ns = namespaces.get(namespace)
      if (!ns) return Option.none()

      const keyIndex = ns.indices.get(keyName)
      if (!keyIndex) return Option.none()

      const hash = keyIndex.get(keyValue)
      if (hash === undefined) return Option.none()

      return Option.fromNullable(ns.data.get(hash))
    },

    setIndex(namespace, keyName, keyValue, hash) {
      return Effect.sync(() => {
        const ns = getOrCreateNamespace(namespace)

        let keyIndex = ns.indices.get(keyName)
        if (!keyIndex) {
          keyIndex = new Map()
          ns.indices.set(keyName, keyIndex)
        }

        keyIndex.set(keyValue, hash)
      })
    },

    clearNamespace(namespace) {
      return Effect.sync(() => {
        const ns = namespaces.get(namespace)
        if (ns) {
          ns.data.clear()
          ns.indices.clear()
          ns.dirty = true
        }
      })
    },

    isDirty() {
      return Effect.succeed([...namespaces.values()].some((ns) => ns.dirty))
    },

    flush() {
      return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem

        for (const [namespace, state] of namespaces) {
          if (!state.dirty) continue

          yield* fs.makeDirectory(cacheDir, { recursive: true })

          // Encode each value using the namespace's schema
          const entries: readonly [number, unknown][] = [...state.data.entries()].map(([hash, value]) => {
            const encodedValue = state.schema ? S.encodeSync(state.schema as S.Schema<any, any, never>)(value) : value
            return [hash, encodedValue] as const
          })

          // Encode to JSON string using schema
          const json = S.encodeSync(CacheFileSchema)(entries)
          yield* fs.writeFileString(cachePathForNamespace(namespace), json)

          state.dirty = false
        }
      })
    },

    load(namespace) {
      return Effect.gen(function* () {
        const ns = getOrCreateNamespace(namespace)
        if (ns.loaded) return

        const fs = yield* FileSystem.FileSystem
        const path = cachePathForNamespace(namespace)
        const exists = yield* fs.exists(path)

        if (exists) {
          const content = yield* fs.readFileString(path)
          // Handle empty files gracefully
          if (content.trim()) {
            // Decode JSON string to entries using schema
            const entries = S.decodeSync(CacheFileSchema)(content)
            for (const [hash, encodedValue] of entries) {
              // Decode each value using the namespace's schema (always registered before load)
              const value = ns.schema
                ? S.decodeSync(ns.schema as S.Schema<any, any, never>)(encodedValue)
                : encodedValue
              ns.data.set(hash, value)
            }
          }
        }

        ns.loaded = true
      })
    },
  }
}

// ============================================================================
// globalThis Singleton Key
// ============================================================================

const CACHE_KEY = Symbol.for('continent.cache')
const DEFAULT_CACHE_DIR = '.continent/cache'

interface GlobalCache {
  impl: CacheService
  dir: string
}

const getGlobalCache = (cacheDir: string = DEFAULT_CACHE_DIR): CacheService => {
  const g = globalThis as any

  // If cache exists, use existing instance
  if (g[CACHE_KEY]) {
    return (g[CACHE_KEY] as GlobalCache).impl
  }

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
export const backgroundFlush: Effect.Effect<void, never, Cache | FileSystem.FileSystem> = Effect.gen(function* () {
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
  Effect.gen(function* () {
    const cache = yield* Cache
    const dirty = yield* cache.isDirty()
    if (dirty) {
      yield* cache.flush()
    }
  })

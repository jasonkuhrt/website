import { dirname, join } from 'node:path'
import { Error as PlatformErrorModule, FileSystem } from '@effect/platform'
import { Effect, HashMap, Option, Schema as S } from 'effect'

// ============================================================================
// Cache Manager
// ============================================================================

export interface CacheManagerConfig<$Record> {
  /** Path to cache file relative to cwd. */
  path: string
  /** Schema for records. */
  recordSchema: S.Schema<$Record>
  /** Keys to build indices for (enables O(1) lookup by key). */
  uniqueKeys?: string[]
}

export interface CacheManager<$Record> {
  /** Get record by content hash (sync, in-memory). */
  get: (hash: number) => $Record | undefined

  /** Set record at content hash (sync, in-memory). */
  set: (hash: number, record: $Record) => void

  /** Get record by unique key (O(1) lookup, sync). */
  getByKey: (keyName: string, keyValue: string) => $Record | undefined

  /** Set index entry for a unique key (sync). */
  setIndex: (keyName: string, keyValue: string, hash: number) => void

  /** Flush cache to disk. */
  flush: () => Effect.Effect<void, PlatformErrorModule.PlatformError, FileSystem.FileSystem>

  /** Load cache from disk. */
  load: () => Effect.Effect<void, PlatformErrorModule.PlatformError, FileSystem.FileSystem>
}

/**
 * Create a content-addressable cache manager.
 * Key = Hash.hash(rawData), Value = transformed record.
 */
export const createCacheManager = <$Record>(
  config: CacheManagerConfig<$Record>,
): CacheManager<$Record> => {
  const cacheSchema = S.HashMap({
    key: S.Number,
    value: config.recordSchema,
  })

  const cachePath = join(process.cwd(), config.path)

  // In-memory cache state
  let cache: HashMap.HashMap<number, $Record> = HashMap.empty()
  let bootMtime = 0

  // In-memory indices (keyName → keyValue → hash)
  // Indices are ephemeral and rebuilt from cache when list() is called
  const indices = new Map<string, Map<string, number>>()

  // Encode/decode functions (space: 2 for pretty-printed output)
  const encode = S.encodeSync(S.parseJson(cacheSchema, { space: 2 }))
  const decode = S.decodeSync(S.parseJson(cacheSchema))

  // ---------------------------------------------------------------------------
  // Internal Effect-based helpers
  // ---------------------------------------------------------------------------

  const readFromDisk: Effect.Effect<
    HashMap.HashMap<number, $Record> | null,
    PlatformErrorModule.PlatformError,
    FileSystem.FileSystem
  > = Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const exists = yield* fs.exists(cachePath)
    if (!exists) return null

    const content = yield* fs.readFileString(cachePath)
    // decode is sync and may throw - treat invalid cache as defect
    return decode(content)
  })

  const writeToDisk = (
    data: HashMap.HashMap<number, $Record>,
  ): Effect.Effect<void, PlatformErrorModule.PlatformError, FileSystem.FileSystem> =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem
      yield* fs.makeDirectory(dirname(cachePath), { recursive: true })
      yield* fs.writeFileString(cachePath, encode(data))
    })

  const getDiskMtime: Effect.Effect<number, never, FileSystem.FileSystem> = Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const exists = yield* fs.exists(cachePath).pipe(Effect.orElseSucceed(() => false))
    if (!exists) return 0
    const info = yield* fs.stat(cachePath).pipe(Effect.orElseSucceed(() => null))
    return Option.getOrElse(info?.mtime ?? Option.none(), () => new Date(0)).getTime()
  })

  // ---------------------------------------------------------------------------
  // Public interface
  // ---------------------------------------------------------------------------

  return {
    get(hash) {
      const entry = HashMap.get(cache, hash)
      return entry._tag === 'Some' ? entry.value : undefined
    },

    set(hash, record) {
      cache = HashMap.set(cache, hash, record)
    },

    getByKey(keyName, keyValue) {
      const keyIndex = indices.get(keyName)
      if (!keyIndex) return undefined

      const hash = keyIndex.get(keyValue)
      if (hash === undefined) return undefined

      const entry = HashMap.get(cache, hash)
      return entry._tag === 'Some' ? entry.value : undefined
    },

    setIndex(keyName, keyValue, hash) {
      let keyIndex = indices.get(keyName)
      if (!keyIndex) {
        keyIndex = new Map()
        indices.set(keyName, keyIndex)
      }
      keyIndex.set(keyValue, hash)
    },

    flush: () =>
      Effect.gen(function* () {
        const diskMtime = yield* getDiskMtime

        // If disk changed since boot, merge (disk entries we don't have)
        if (diskMtime > bootMtime) {
          const diskCache = yield* readFromDisk
          if (diskCache) {
            // Memory wins on conflict
            for (const [hash, record] of HashMap.entries(diskCache)) {
              if (HashMap.get(cache, hash)._tag === 'None') {
                cache = HashMap.set(cache, hash, record)
              }
            }
          }
        }

        yield* writeToDisk(cache)
        bootMtime = Date.now()
      }),

    load: () =>
      Effect.gen(function* () {
        const diskCache = yield* readFromDisk
        if (diskCache) {
          cache = diskCache
        }
        const fs = yield* FileSystem.FileSystem
        const exists = yield* fs.exists(cachePath).pipe(Effect.orElseSucceed(() => false))
        bootMtime = exists ? (yield* getDiskMtime) : 0
      }),
  }
}

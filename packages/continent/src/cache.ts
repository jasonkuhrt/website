import { existsSync } from 'node:fs'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { HashMap, Schema as S } from 'effect'

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
  /** Get record by content hash. */
  get: (hash: number) => $Record | undefined

  /** Set record at content hash. */
  set: (hash: number, record: $Record) => void

  /** Get record by unique key (O(1) lookup). */
  getByKey: (keyName: string, keyValue: string) => $Record | undefined

  /** Set index entry for a unique key. */
  setIndex: (keyName: string, keyValue: string, hash: number) => void

  /** Flush cache to disk. */
  flush: () => Promise<void>

  /** Load cache from disk. */
  load: () => Promise<void>
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

  // Encode/decode functions
  const encode = S.encodeSync(S.parseJson(cacheSchema))
  const decode = S.decodeSync(S.parseJson(cacheSchema))

  const readFromDisk = async (): Promise<HashMap.HashMap<number, $Record> | null> => {
    try {
      const content = await readFile(cachePath, 'utf-8')
      return decode(content)
    } catch (err: any) {
      if (err?.code !== 'ENOENT') {
        console.error(`[cache] Read failed: ${err?.message || err}`)
      }
      return null
    }
  }

  const writeToDisk = async (data: HashMap.HashMap<number, $Record>): Promise<void> => {
    await mkdir(dirname(cachePath), { recursive: true })
    const json = encode(data)
    await writeFile(cachePath, json)
  }

  const getDiskMtime = async (): Promise<number> => {
    try {
      const s = await stat(cachePath)
      return s.mtimeMs
    } catch {
      return 0
    }
  }

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

    async flush() {
      const diskMtime = await getDiskMtime()

      // If disk changed since boot, merge (disk entries we don't have)
      if (diskMtime > bootMtime) {
        const diskCache = await readFromDisk()
        if (diskCache) {
          // Memory wins on conflict
          for (const [hash, record] of HashMap.entries(diskCache)) {
            if (HashMap.get(cache, hash)._tag === 'None') {
              cache = HashMap.set(cache, hash, record)
            }
          }
        }
      }

      await writeToDisk(cache)
      bootMtime = Date.now()
    },

    async load() {
      const diskCache = await readFromDisk()
      if (diskCache) {
        cache = diskCache
      }
      bootMtime = existsSync(cachePath) ? await getDiskMtime() : 0
    },
  }
}

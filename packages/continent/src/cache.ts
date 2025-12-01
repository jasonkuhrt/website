import { existsSync, rmSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as S from 'effect/Schema'

/**
 * Unified cache with in-memory and optional disk persistence.
 *
 * - Memory cache: Always active, stores by ID
 * - Disk cache: Only when schema is provided, enables persistence across restarts
 * - Invalidation: Clears both memory and disk
 */
export interface Cache<$Data> {
  /**
   * Get cached data by ID.
   * Checks memory first, then disk (if schema provided).
   * Returns null if not found.
   */
  get(id: string): Promise<$Data | null>

  /**
   * Set cached data by ID.
   * Writes to memory, and disk (if schema provided).
   */
  set(id: string, data: $Data): Promise<void>

  /**
   * Check if an ID exists in cache (memory or disk).
   */
  has(id: string): Promise<boolean>

  /**
   * Invalidate entire cache.
   * Clears both memory and disk.
   */
  invalidate(): void
}

export interface CreateOptions<$Schema extends S.Schema.AnyNoContext | undefined = undefined> {
  /** Disk cache path relative to cwd. */
  path: string
  /** Schema for disk persistence. When provided, enables encode/decode for disk storage. */
  schema?: $Schema
}

/**
 * Infer data type from schema, or unknown if no schema.
 */
type DataFromSchema<$Schema> =
  $Schema extends S.Schema.AnyNoContext ? S.Schema.Type<$Schema> : unknown

/**
 * Slugify an ID for filesystem compatibility.
 * Replaces `/` with `__` and removes unsafe characters.
 */
const slugify = (id: string): string => {
  return id
    .replace(/\//g, '__')
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
}

/**
 * Create a new cache instance.
 */
export const create = <$Schema extends S.Schema.AnyNoContext | undefined = undefined>(
  options: CreateOptions<$Schema>,
): Cache<DataFromSchema<$Schema>> => {
  const memory = new Map<string, unknown>()

  // Create JSON-wrapped schema for disk serialization
  // S.parseJson handles both JSON.parse/stringify AND schema encode/decode
  const jsonSchema = options.schema ? S.parseJson(options.schema) : null
  const encode = jsonSchema ? S.encodeSync(jsonSchema as any) : null
  const decode = jsonSchema ? S.decodeSync(jsonSchema as any) : null

  const getDiskPath = (id: string): string => {
    return join(process.cwd(), options.path, `${slugify(id)}.json`)
  }

  const ensureDiskDir = async (): Promise<void> => {
    const dir = join(process.cwd(), options.path)
    await mkdir(dir, { recursive: true })
  }

  const readFromDisk = async (id: string): Promise<unknown | null> => {
    if (!decode) return null

    const path = getDiskPath(id)

    try {
      const raw = await readFile(path, 'utf-8')
      return decode(raw)
    } catch (err: any) {
      // File doesn't exist
      if (err.code === 'ENOENT') return null

      // Corrupted cache file - delete it
      await rm(path, { force: true })
      return null
    }
  }

  const writeToDisk = async (id: string, data: unknown): Promise<void> => {
    if (!encode) return

    await ensureDiskDir()
    const path = getDiskPath(id)
    const json = encode(data as any) as string
    await writeFile(path, json)
  }

  return {
    async get(id) {
      // Check memory first
      if (memory.has(id)) {
        return memory.get(id) as any
      }

      // Check disk
      const diskData = await readFromDisk(id)
      if (diskData !== null) {
        // Populate memory cache for next access
        memory.set(id, diskData)
        return diskData as any
      }

      return null
    },

    async set(id, data) {
      // Write to memory
      memory.set(id, data)

      // Write to disk (if schema provided)
      await writeToDisk(id, data)
    },

    async has(id) {
      if (memory.has(id)) return true

      if (jsonSchema) {
        const path = getDiskPath(id)
        return existsSync(path)
      }

      return false
    },

    invalidate() {
      // Clear memory
      memory.clear()

      // Clear disk directory (sync for simplicity in invalidation)
      const dir = join(process.cwd(), options.path)
      if (existsSync(dir)) {
        rmSync(dir, { recursive: true })
      }
    },
  }
}

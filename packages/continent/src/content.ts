import { Error as PlatformErrorModule, FileSystem } from '@effect/platform'
import { Effect, Hash, Option, Schema as S } from 'effect'
import type { Struct } from 'effect/Schema'
import { Cache, type CacheSchema } from './cache.js'
import { ContentError } from './errors.js'
import * as PrimaryKey from './primary-key.js'
import * as SecondaryKey from './secondary-key.js'
import * as Store from './store.js'

// ============================================================================
// Type Utilities
// ============================================================================

/**
 * Type for get() argument - single key lookup.
 * Creates a union of single-key objects: { slug: string } | { email: string }
 */
type SecondaryKeyLookup<$Keys extends string> = {
  [K in $Keys]: { [P in K]: string }
}[$Keys]

// ============================================================================
// Common Error Type
// ============================================================================

/** Error type for content operations. */
export type ContentOpError = PlatformErrorModule.PlatformError | ContentError

// ============================================================================
// Assets (exported for use in content schemas)
// ============================================================================

export interface Asset {
  sourcePath: string
}

export const AssetSchema = S.Struct({
  sourcePath: S.String,
})

/** Assets field for content schemas. */
export const AssetsField = S.Array(AssetSchema)

// ============================================================================
// Cache Events (for introspection/testing)
// ============================================================================

export interface CacheEvent {
  type: 'hit' | 'miss'
  hash: number
}

// ============================================================================
// Content
// ============================================================================

/** Check if an export is a content definition. */
export const isBase = (exp: unknown): exp is Content.Base =>
  exp !== null &&
  typeof exp === 'object' &&
  '_tag' in exp &&
  'store' in exp &&
  'version' in exp &&
  'restoreCache' in exp

export namespace Content {
  /** Helper to create validated encoded store data. */
  export interface StoreMake<$Store extends Store.Store> {
    /** Create a single validated record. */
    make: (
      input: S.Schema.Encoded<Store.Store.Schema<$Store>>,
    ) => S.Schema.Encoded<Store.Store.Schema<$Store>>
    /** Create multiple validated records (for collection stores). */
    makeMany: (
      ...inputs: S.Schema.Encoded<Store.Store.Schema<$Store>>[]
    ) => S.Schema.Encoded<Store.Store.Schema<$Store>>[]
  }

  /** Base interface shared by singleton and collection content. */
  export interface Base {
    readonly _tag: string
    readonly version: number
    readonly store: Store.Store
    /** Source file that defines this content (set by registry on import). */
    sourceFilePath?: string
    /** Restore cache from disk. */
    restoreCache(): Effect.Effect<void, PlatformErrorModule.PlatformError, Cache | FileSystem.FileSystem>
  }

  /** Interface for cardinality '1' content (singleton). */
  export interface SingletonClass<
    $Tag extends string,
    $Store extends Store.Store,
    $Output,
  > extends Base {
    readonly _tag: $Tag
    readonly store: $Store
    readonly Store: StoreMake<$Store>
    readonly Type: $Output
    get(): Effect.Effect<$Output, ContentOpError, FileSystem.FileSystem>
  }

  /** Interface for cardinality 'n' content (collection). */
  export interface CollectionClass<
    $Tag extends string,
    $Store extends Store.Store,
    $Output,
    $SecondaryKeys extends string = never,
    $PrimaryKeyType = Store.Store.GetPrimaryKey<$Store>,
  > extends Base {
    readonly _tag: $Tag
    readonly store: $Store
    readonly Store: StoreMake<$Store>
    readonly Type: $Output
    readonly secondaryKeys: readonly $SecondaryKeys[]
    /** List all records (uses cache). */
    list(): Effect.Effect<$Output[], ContentOpError, Cache | FileSystem.FileSystem>
    /** Get single record by primary key. Returns Option.none() if not found. */
    get(
      key: $PrimaryKeyType,
    ): Effect.Effect<Option.Option<$Output>, ContentOpError, Cache | FileSystem.FileSystem>
    /** Get single record by secondary key. Returns Option.none() if not found. */
    getBy(
      key: SecondaryKeyLookup<$SecondaryKeys>,
    ): Effect.Effect<Option.Option<$Output>, ContentOpError, Cache | FileSystem.FileSystem>
  }

  // Conditional type to select the right interface based on store cardinality
  // dprint-ignore
  export type Class<
    $Tag extends string,
    $Store extends Store.Store,
    $Output,
    $SecondaryKeys extends string = never,
    $Cardinality extends Store.Cardinality = Store.Store.GetCardinality<$Store>,
  > =
    $Cardinality extends '1' ? SingletonClass<$Tag, $Store, $Output> :
                               CollectionClass<$Tag, $Store, $Output, $SecondaryKeys>

  // ============================================================================
  // Config types for different scenarios
  // ============================================================================

  /** Base config shared by all Content configurations. */
  export interface ConfigBase<$Store extends Store.Store> {
    store: $Store
    /** Hook for cache introspection (testing). Called on each cache hit/miss. */
    onCacheEvent?: (event: CacheEvent) => void
    /**
     * Cache version for invalidation control.
     * Combined with source hash to form the cache key.
     *
     * - **Omitted**: Auto-hash `map.toString()` (catches direct map body changes)
     * - **Static value**: Explicit control - bump manually when processing changes
     * - **Function**: Called once to compute version dynamically
     *
     * @example
     * ```ts
     * // Default: auto-hash map function body
     * Content('Posts', { store, map: (d) => process(d) })
     *
     * // Explicit: bump when external helper changes
     * Content('Posts', { store, version: 2, map: (d) => helperFn(d) })
     *
     * // Derived: compute from config
     * Content('Posts', { store, version: () => Hash.hash(myConfig), map: ... })
     * ```
     */
    version?: number | string | (() => number | string)
  }

  /** Config type for implementation - widest variant that accepts all overloads. */
  export type ConfigAny = ConfigBase<Store.Store> & {
    schema?: Struct.Fields
    map?: (data: unknown) => Promise<unknown> | Effect.Effect<unknown, unknown>
    secondaryKeys?: string[]
    mapKeySecondaryToPrimary?: (key: unknown) => Store.PrimaryKey
  }
}

// ============================================================================
// Content Function (Interface Call Signature Approach)
// ============================================================================

/**
 * Content function type with call signature overloads.
 *
 * Uses interface call signatures instead of function overloads to avoid
 * variance issues with store primary key types. The constraint is just
 * `$Store extends Store.Store` (no primary key specified), so any store
 * type is accepted and TypeScript infers the exact type from `config.store`.
 */
// dprint-ignore
interface ContentFn {
  // Overload 1: With schema + map (both REQUIRED)
  <
    $Tag extends string,
    $Store extends Store.Store,
    $Fields extends Struct.Fields,
    const $SecondaryKeys extends string[] = [],
  >(
    tag: $Tag,
    config: Content.ConfigBase<$Store> & {
      schema: $Fields
      map: (
        data: Store.Store.Data<$Store>,
      ) => Promise<Struct.Type<$Fields>> | Effect.Effect<Struct.Type<$Fields>, unknown>
      secondaryKeys?: $SecondaryKeys
      mapKeySecondaryToPrimary?: (
        key: SecondaryKey.UnionFromFields<$Fields>,
      ) => Store.Store.GetPrimaryKey<$Store>
    },
  ): Store.Store.GetCardinality<$Store> extends '1'
       ? Content.SingletonClass<$Tag, $Store, Struct.Type<$Fields>>
       : Content.CollectionClass<
           $Tag,
           $Store,
           Struct.Type<$Fields>,
           $SecondaryKeys[number] | SecondaryKey.GetFromFields<$Fields>
         >

  // Overload 2: Passthrough (no schema, no map)
  <
    $Tag extends string,
    $Store extends Store.Store,
  >(
    tag: $Tag,
    config: Content.ConfigBase<$Store>,
  ): Store.Store.GetCardinality<$Store> extends '1'
       ? Content.SingletonClass<$Tag, $Store, Store.Store.Data<$Store>>
       : Content.CollectionClass<
           $Tag,
           $Store,
           Store.Store.Data<$Store>,
           SecondaryKey.GetFromSchema<Store.Store.Schema<$Store>>
         >
}

/** Create a content definition from a store. */
export const Content: ContentFn = ((tag: string, config: Content.ConfigAny) => {
  const cardinality = config.store.cardinality
  const hasMap = config.map !== undefined

  // Compute version hash once at Content creation (not per list() call)
  const version = (() => {
    if (config.version === undefined) {
      // Default: auto-hash the map function body
      return config.map ? Hash.hash(config.map.toString()) : 0
    }
    if (typeof config.version === 'function') {
      // Derived: call function once
      return Hash.hash(config.version())
    }
    // Static: use provided value
    return Hash.hash(config.version)
  })()

  // Helper to run map function (handles both Promise and Effect)
  const runMap = (data: unknown): Effect.Effect<unknown, ContentError> => {
    if (!hasMap) return Effect.succeed(data)

    const result = (config.map as any)(data)

    if (Effect.isEffect(result)) {
      return result.pipe(
        Effect.mapError((cause) =>
          new ContentError({
            contentTag: tag,
            operation: 'list',
            message: `Map function failed: ${String(cause)}`,
          })
        ),
      ) as any
    }

    // Promise
    return Effect.tryPromise({
      try: () => result as Promise<unknown>,
      catch: (cause) =>
        new ContentError({
          contentTag: tag,
          operation: 'list',
          message: `Map function failed: ${String(cause)}`,
        }),
    })
  }

  if (cardinality === '1') {
    // Singleton implementation - no caching needed for singletons
    const get = () =>
      Effect.gen(function*() {
        const records = yield* config.store.readMany()
        if (records.length === 0) {
          return yield* Effect.fail(
            new ContentError({
              contentTag: tag,
              operation: 'get',
              message: `Content ${tag} has no data`,
            }),
          )
        }
        const source = records[0]!
        return yield* runMap(source.data)
      })

    const singleton = {
      _tag: tag,
      store: config.store,
      version,
      Store: {
        make: (input: any) => {
          S.decodeUnknownSync(config.store.schema)(input)
          return input
        },
        makeMany: (...inputs: any[]) => {
          return inputs.map((input) => {
            S.decodeUnknownSync(config.store.schema)(input)
            return input
          })
        },
      },
      get,
      // Singletons don't use caching, but interface requires this method
      restoreCache: () => Effect.void,
    }
    return singleton
  }

  // Collection implementation
  // Auto-extract unique keys from schema + merge with config
  const autoKeys = config.schema ? SecondaryKey.getFromFields(config.schema as any) : []
  const configKeys: string[] = config.secondaryKeys ?? []
  const secondaryKeys = [...new Set([...autoKeys, ...configKeys])]

  // Cache schema is the output schema if provided (after map transform),
  // otherwise the store schema (when output = source, no transform)
  const cacheSchema = config.schema
    ? S.Struct(config.schema as Struct.Fields)
    : config.store.schema

  // Define list as a closure-captured function
  const list = () =>
    Effect.gen(function*() {
      console.log(`[continent] ${tag}.list() version=${version}`)
      const cache = yield* Cache
      const sourceRecords = yield* config.store.readMany()
      const results: unknown[] = []

      for (const source of sourceRecords) {
        // Primary key is stable identifier (file path for DirStore, hash for JsStore)
        const primaryKey = source.primaryKey

        // Compute combined hash: source data + definition version
        // Use string concatenation for stable/predictable hash combination
        const sourceHash = Hash.hash(source.data)
        const hash = Hash.hash(`${sourceHash}:${version}`)

        // Content-addressable lookup by primary key, validated by hash
        const cached = cache.getByPrimaryKey(tag, version, primaryKey, hash)
        let record: unknown

        if (Option.isSome(cached)) {
          console.log(`[continent] ${tag} HIT pk=${primaryKey} v=${version} srcHash=${sourceHash}`)
          config.onCacheEvent?.({ type: 'hit', hash })
          // Cache stores decoded values (schema handles encode/decode at disk boundary)
          record = cached.value
        } else {
          console.log(`[continent] ${tag} MISS pk=${primaryKey} v=${version} srcHash=${sourceHash}`)
          config.onCacheEvent?.({ type: 'miss', hash })
          // Cache miss - run map
          record = yield* runMap(source.data)
          // Store raw value (cache encodes at flush time)
          cache.setByPrimaryKey(tag, version, primaryKey, hash, record)
        }

        // Build/rebuild indices for secondary keys
        for (const key of secondaryKeys) {
          const value = (record as Record<string, unknown>)[key]
          if (typeof value === 'string') cache.setSecondaryKey(tag, version, key, value, primaryKey)
        }

        results.push(record)
      }

      return results
    })

  // Get store's PrimaryKey info for encoding lookup keys
  const pkInfo = config.store.primaryKeyInfo

  // Define get (primary key lookup) as a closure-captured function
  const get = (key: unknown) =>
    Effect.gen(function*() {
      const cache = yield* Cache

      // Convert user's key to cache key
      let cacheKey: string | number
      if (pkInfo) {
        // Encode user's decoded key to get cache key
        cacheKey = PrimaryKey.toCacheKey(pkInfo.schema, key)
      } else {
        // Fallback: assume key is already a cache key (string or number)
        cacheKey = key as string | number
      }

      // Try direct cache lookup by primary key
      // We need to iterate through cached entries to find by primaryKey
      // Since we don't have the hash, we can't use getByPrimaryKey directly
      // Instead, populate cache via list() then lookup by primary key

      // Ensure cache is populated
      yield* list()

      // Now find the record by primary key
      // The cache stores records by primaryKey, so we need to check all entries
      // This is a limitation - we could optimize by having a direct primaryKey index
      const sourceRecords = yield* config.store.readMany()
      for (const source of sourceRecords) {
        if (source.primaryKey === cacheKey) {
          // Found the source record, look up its cached output
          const sourceHash = Hash.hash(source.data)
          const hash = Hash.hash(`${sourceHash}:${version}`)
          const cached = cache.getByPrimaryKey(tag, version, cacheKey, hash)
          if (Option.isSome(cached)) return cached
        }
      }

      return Option.none()
    })

  // Define getBy (secondary key lookup) as a closure-captured function
  const getBy = (keyLookup: Record<string, string>) =>
    Effect.gen(function*() {
      const cache = yield* Cache

      // Extract the single key from the lookup object
      const entries = Object.entries(keyLookup)
      if (entries.length !== 1) {
        return yield* Effect.fail(
          new ContentError({
            contentTag: tag,
            operation: 'getBy',
            message: `getBy() expects exactly one key, got ${entries.length}`,
          }),
        )
      }
      const [keyName, keyValue] = entries[0]!

      // Try O(1) index lookup first (namespaced by tag)
      // Cache stores decoded values (schema handles encode/decode at disk boundary)
      const cached = cache.getBySecondaryKey(tag, version, keyName, keyValue)
      if (Option.isSome(cached)) return cached

      // If not in cache, populate cache via list() and try again
      yield* list()
      return cache.getBySecondaryKey(tag, version, keyName, keyValue)
    })

  const collection = {
    _tag: tag,
    store: config.store,
    version,
    secondaryKeys: secondaryKeys as readonly string[],
    Store: {
      make: (input: any) => {
        S.decodeUnknownSync(config.store.schema)(input)
        return input
      },
      makeMany: (...inputs: any[]) => {
        return inputs.map((input) => {
          S.decodeUnknownSync(config.store.schema)(input)
          return input
        })
      },
    },
    list,
    get,
    getBy,
    restoreCache: () =>
      Effect.gen(function*() {
        console.log(`[continent] ${tag}.restoreCache() version=${version}`)
        const cache = yield* Cache
        if (cacheSchema) cache.registerSchema(tag, cacheSchema as CacheSchema)
        yield* cache.load(tag)
      }),
  }

  return collection as any
}) as ContentFn

import { Error as PlatformErrorModule, FileSystem } from '@effect/platform'
import { Effect, Option, Schema as S } from 'effect'
import type { Struct } from 'effect/Schema'
import { createCacheManager } from './cache.js'
import { ContentError } from './errors.js'
import { type Cardinality, Store as StoreInterface } from './store.js'
import { extractUniqueKeysFromFields, ExtractUniqueKeysFromFields } from './unique-key.js'

export { UniqueKey } from './unique-key.js'
export * as Store from './stores/_.js'

// ============================================================================
// Type Utilities
// ============================================================================

/**
 * Extract field keys that can be used as unique keys from Struct.Fields.
 * Only non-optional string fields are allowed.
 */
//dprint-ignore
type UniqueKeyableFieldsFromFields<$Fields extends Struct.Fields> =
  {
    [K in keyof $Fields]:
      $Fields[K] extends S.Schema<string, string, never> ? K :
                                                           never
  }[keyof $Fields] & string

/**
 * Extract field keys that can be used as unique keys from a Struct schema.
 */
//dprint-ignore
type UniqueKeyableFieldsFromSchema<$Schema> =
  $Schema extends S.Struct<infer __fields__>
    ? UniqueKeyableFieldsFromFields<__fields__>
    : never

/**
 * Type for get() argument - single key lookup.
 * Creates a union of single-key objects: { slug: string } | { email: string }
 */
type UniqueKeyLookup<$Keys extends string> = {
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

export namespace Content {
  /** Helper to create validated encoded store data. */
  export interface StoreMake<$Store extends StoreInterface> {
    /** Create a single validated record. */
    make: (input: S.Schema.Encoded<StoreInterface.Schema<$Store>>) => S.Schema.Encoded<StoreInterface.Schema<$Store>>
    /** Create multiple validated records (for collection stores). */
    makeMany: (
      ...inputs: S.Schema.Encoded<StoreInterface.Schema<$Store>>[]
    ) => S.Schema.Encoded<StoreInterface.Schema<$Store>>[]
  }

  /** Interface for cardinality '1' content (singleton). */
  export interface SingletonClass<$Tag extends string, $Store extends StoreInterface, $Output> {
    readonly _tag: $Tag
    readonly store: $Store
    readonly Store: StoreMake<$Store>
    readonly Type: $Output
    get(): Effect.Effect<$Output, ContentOpError, FileSystem.FileSystem>
  }

  /** Interface for cardinality 'n' content (collection). */
  export interface CollectionClass<
    $Tag extends string,
    $Store extends StoreInterface,
    $Output,
    $UniqueKeys extends string = never,
  > {
    readonly _tag: $Tag
    readonly store: $Store
    readonly Store: StoreMake<$Store>
    readonly Type: $Output
    readonly uniqueKeys: readonly $UniqueKeys[]
    /** List all records (uses cache). */
    list(): Effect.Effect<$Output[], ContentOpError, FileSystem.FileSystem>
    /** Get single record by unique key. Returns Option.none() if not found. */
    get(key: UniqueKeyLookup<$UniqueKeys>): Effect.Effect<Option.Option<$Output>, ContentOpError, FileSystem.FileSystem>
    /** Flush cache to disk. */
    flushCache(): Effect.Effect<void, PlatformErrorModule.PlatformError, FileSystem.FileSystem>
    /** Load cache from disk. */
    loadCache(): Effect.Effect<void, PlatformErrorModule.PlatformError, FileSystem.FileSystem>
  }

  // Conditional type to select the right interface based on store cardinality
  //dprint-ignore
  export type Class<
    $Tag extends string,
    $Store extends StoreInterface,
    $Output,
    $UniqueKeys extends string = never,
    $Cardinality extends Cardinality = StoreInterface.GetCardinality<$Store>,
  > =
    $Cardinality extends '1' ? SingletonClass<$Tag, $Store, $Output> :
                               CollectionClass<$Tag, $Store, $Output, $UniqueKeys>

  // ============================================================================
  // Config types for different scenarios
  // ============================================================================

  /** Base config shared by all Content configurations. */
  export interface ConfigBase<$Store extends StoreInterface> {
    store: $Store
    /** Hook for cache introspection (testing). Called on each cache hit/miss. */
    onCacheEvent?: (event: CacheEvent) => void
  }

  /** Config when schema AND map are provided (transformed output). */
  export interface ConfigWithSchemaAndMap<
    $Tag extends string,
    $Store extends StoreInterface,
    $Fields extends Struct.Fields,
    $UniqueKeys extends string = never,
  > extends ConfigBase<$Store> {
    schema: $Fields
    map: (data: StoreInterface.Data<$Store>) => Promise<Struct.Type<$Fields>> | Effect.Effect<Struct.Type<$Fields>, unknown>
    uniqueKeys?: $UniqueKeys[]
  }

  /** Config for passthrough (no schema, no map). */
  export interface ConfigPassthrough<
    $Tag extends string,
    $Store extends StoreInterface,
  > extends ConfigBase<$Store> {}

  /** Config for singleton with schema and map. */
  export interface ConfigSingletonWithSchemaAndMap<
    $Tag extends string,
    $Store extends StoreInterface,
    $Fields extends Struct.Fields,
  > extends ConfigBase<$Store> {
    schema: $Fields
    map: (data: StoreInterface.Data<$Store>) => Promise<Struct.Type<$Fields>> | Effect.Effect<Struct.Type<$Fields>, unknown>
  }
}

// ============================================================================
// Function Overloads
// ============================================================================

/** Schema without context requirements. */
type SchemaNoContext = S.Schema<any, any, never>

// Overload 1: Collection with schema and map (transformed output)
// $UniqueKeys defaults to auto-extracted keys from UniqueKey-branded fields
// Constraint uses union to allow both auto-extracted and manually specified keys
export function Content<
  $Tag extends string,
  $Store extends StoreInterface<SchemaNoContext, 'n'>,
  $Fields extends Struct.Fields,
  const $UniqueKeys extends
    | UniqueKeyableFieldsFromFields<$Fields>
    | ExtractUniqueKeysFromFields<$Fields> = ExtractUniqueKeysFromFields<$Fields>,
>(
  tag: $Tag,
  config: Content.ConfigWithSchemaAndMap<$Tag, $Store, $Fields, $UniqueKeys>,
): Content.CollectionClass<$Tag, $Store, Struct.Type<$Fields>, $UniqueKeys>

// Overload 2: Collection passthrough (no schema, no map)
export function Content<
  $Tag extends string,
  $Store extends StoreInterface<SchemaNoContext, 'n'>,
>(
  tag: $Tag,
  config: Content.ConfigPassthrough<$Tag, $Store>,
): Content.CollectionClass<$Tag, $Store, StoreInterface.Data<$Store>, UniqueKeyableFieldsFromSchema<StoreInterface.Schema<$Store>>>

// Overload 3: Singleton with schema and map
export function Content<
  $Tag extends string,
  $Store extends StoreInterface<SchemaNoContext, '1'>,
  $Fields extends Struct.Fields,
>(
  tag: $Tag,
  config: Content.ConfigSingletonWithSchemaAndMap<$Tag, $Store, $Fields>,
): Content.SingletonClass<$Tag, $Store, Struct.Type<$Fields>>

// Overload 4: Singleton passthrough
export function Content<
  $Tag extends string,
  $Store extends StoreInterface<SchemaNoContext, '1'>,
>(
  tag: $Tag,
  config: Content.ConfigPassthrough<$Tag, $Store>,
): Content.SingletonClass<$Tag, $Store, StoreInterface.Data<$Store>>

// ============================================================================
// Implementation
// ============================================================================

export function Content(
  tag: string,
  config: {
    store: StoreInterface
    schema?: Struct.Fields
    map?: (data: unknown) => Promise<unknown> | Effect.Effect<unknown, unknown>
    uniqueKeys?: string[]
    onCacheEvent?: (event: CacheEvent) => void
  },
): unknown {
  const cardinality = config.store.cardinality
  const hasSchema = config.schema !== undefined
  const hasMap = config.map !== undefined

  // Build the output schema for caching
  const outputSchema = hasSchema
    ? S.Struct(config.schema as any)
    : config.store.schema

  // Helper to run map function (handles both Promise and Effect)
  const runMap = (data: unknown): Effect.Effect<unknown, ContentError> => {
    if (!hasMap) {
      return Effect.succeed(data)
    }

    const result = config.map!(data)

    if (Effect.isEffect(result)) {
      return result.pipe(
        Effect.mapError((cause) =>
          new ContentError({
            contentTag: tag,
            operation: 'list',
            message: `Map function failed: ${String(cause)}`,
          })
        ),
      )
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
    // Singleton implementation
    const get = (): Effect.Effect<unknown, ContentOpError, FileSystem.FileSystem> =>
      Effect.gen(function* () {
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
    }
    return singleton
  }

  // Collection implementation
  // Auto-extract unique keys from schema + merge with config
  const autoKeys = hasSchema ? extractUniqueKeysFromFields(config.schema as any) : []
  const configKeys: string[] = config.uniqueKeys ?? []
  const uniqueKeys = [...new Set([...autoKeys, ...configKeys])]

  // Create content-addressable cache (hash → record)
  const cache = createCacheManager({
    path: `.continent/cache/${tag}.json`,
    recordSchema: outputSchema as any,
    uniqueKeys,
  })

  // Track if cache has been loaded
  let cacheLoaded = false

  const ensureCacheLoaded: Effect.Effect<void, PlatformErrorModule.PlatformError, FileSystem.FileSystem> = Effect.gen(
    function* () {
      if (!cacheLoaded) {
        yield* cache.load()
        cacheLoaded = true
      }
    },
  )

  // Define list as a closure-captured function (not using `this`)
  const list = (): Effect.Effect<unknown[], ContentOpError, FileSystem.FileSystem> =>
    Effect.gen(function* () {
      yield* ensureCacheLoaded
      const sourceRecords = yield* config.store.readMany()
      const results: unknown[] = []

      for (const source of sourceRecords) {
        // Content-addressable lookup by hash
        const cached = cache.get(source.hash)
        let record: unknown

        if (cached) {
          config.onCacheEvent?.({ type: 'hit', hash: source.hash })
          record = cached
        } else {
          config.onCacheEvent?.({ type: 'miss', hash: source.hash })
          // Cache miss - run map
          record = yield* runMap(source.data)
          cache.set(source.hash, record)
        }

        // Build/rebuild indices for unique keys (needed after loading from disk)
        for (const key of uniqueKeys) {
          const value = (record as Record<string, unknown>)[key]
          if (typeof value === 'string') {
            cache.setIndex(key, value, source.hash)
          }
        }

        results.push(record)
      }

      // Auto-flush cache to disk after populating
      yield* cache.flush()

      return results
    })

  // Define get as a closure-captured function (uses `list`, not `this.list()`)
  const get = (
    keyLookup: Record<string, string>,
  ): Effect.Effect<Option.Option<unknown>, ContentOpError, FileSystem.FileSystem> =>
    Effect.gen(function* () {
      yield* ensureCacheLoaded

      // Extract the single key from the lookup object
      const entries = Object.entries(keyLookup)
      if (entries.length !== 1) {
        return yield* Effect.fail(
          new ContentError({
            contentTag: tag,
            operation: 'get',
            message: `get() expects exactly one key, got ${entries.length}`,
          }),
        )
      }
      const [keyName, keyValue] = entries[0]!

      // Try O(1) index lookup first
      const cached = cache.getByKey(keyName, keyValue)
      if (cached) return Option.some(cached)

      // If not in cache, populate cache via list() and try again
      yield* list()
      return Option.fromNullable(cache.getByKey(keyName, keyValue))
    })

  const collection = {
    _tag: tag,
    store: config.store,
    uniqueKeys: uniqueKeys as readonly string[],
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
    flushCache: () => cache.flush(),
    loadCache: () => cache.load(),
  }

  return collection
}

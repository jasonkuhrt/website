import { Error as PlatformErrorModule, FileSystem } from '@effect/platform'
import { Effect, Hash, Option, Schema as S } from 'effect'
import type { Struct } from 'effect/Schema'
import { Cache, type CacheSchema } from './cache.js'
import { ContentError } from './errors.js'
import * as SecondaryKey from './secondary-key.js'
import { type Cardinality, Store as StoreInterface } from './store.js'

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
    /** Computed version hash for cache invalidation. */
    readonly version: number
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
    /** Computed version hash for cache invalidation. */
    readonly version: number
    readonly uniqueKeys: readonly $UniqueKeys[]
    /** List all records (uses cache). */
    list(): Effect.Effect<$Output[], ContentOpError, Cache | FileSystem.FileSystem>
    /** Get single record by unique key. Returns Option.none() if not found. */
    get(
      key: SecondaryKeyLookup<$UniqueKeys>,
    ): Effect.Effect<Option.Option<$Output>, ContentOpError, Cache | FileSystem.FileSystem>
  }

  // Conditional type to select the right interface based on store cardinality
  // dprint-ignore
  export type Class<
    $Tag extends string,
    $Store extends StoreInterface,
    $Output,
    $SecondaryKeys extends string = never,
    $Cardinality extends Cardinality = StoreInterface.GetCardinality<$Store>,
  > =
    $Cardinality extends '1' ? SingletonClass<$Tag, $Store, $Output> :
                               CollectionClass<$Tag, $Store, $Output, $SecondaryKeys>

  // ============================================================================
  // Config types for different scenarios
  // ============================================================================

  /** Base config shared by all Content configurations. */
  export interface ConfigBase<$Store extends StoreInterface> {
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

  /** Config when schema AND map are provided (transformed output). */
  export interface ConfigWithSchemaAndMap<
    $Tag extends string,
    $Store extends StoreInterface,
    $Fields extends Struct.Fields,
    $SecondaryKeys extends string = never,
  > extends ConfigBase<$Store> {
    schema: $Fields
    map: (
      data: StoreInterface.Data<$Store>,
    ) => Promise<Struct.Type<$Fields>> | Effect.Effect<Struct.Type<$Fields>, unknown>
    secondaryKeys?: $SecondaryKeys[]
    /**
     * Map a secondary key to the store's primary key.
     * Required when schema has SecondaryKey-branded fields.
     * Used for O(1) cache lookup on `get()` calls.
     *
     * @example
     * ```typescript
     * mapKeySecondaryToPrimary: (key) => {
     *   switch (key._tag) {
     *     case 'slug': return `content/essays/${key.value}/index.mdx`
     *   }
     * }
     * ```
     */
    mapKeySecondaryToPrimary?: (
      key: SecondaryKey.UnionFromFields<$Fields>,
    ) => StoreInterface.GetPrimaryKey<$Store>
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
    map: (
      data: StoreInterface.Data<$Store>,
    ) => Promise<Struct.Type<$Fields>> | Effect.Effect<Struct.Type<$Fields>, unknown>
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
  const $SecondaryKeys extends SecondaryKey.GetFromFields<$Fields> = SecondaryKey.GetFromFields<$Fields>,
>(
  tag: $Tag,
  config: Content.ConfigWithSchemaAndMap<$Tag, $Store, $Fields, $SecondaryKeys>,
): Content.CollectionClass<$Tag, $Store, Struct.Type<$Fields>, $SecondaryKeys>

// Overload 2: Collection passthrough (no schema, no map)
export function Content<
  $Tag extends string,
  $Store extends StoreInterface<SchemaNoContext, 'n'>,
>(
  tag: $Tag,
  config: Content.ConfigPassthrough<$Tag, $Store>,
): Content.CollectionClass<
  $Tag,
  $Store,
  StoreInterface.Data<$Store>,
  SecondaryKey.GetFromSchema<StoreInterface.Schema<$Store>>
>

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
    secondaryKeys?: string[]
    onCacheEvent?: (event: CacheEvent) => void
    version?: number | string | (() => number | string)
    mapKeySecondaryToPrimary?: (key: { _tag: string; value: string }) => unknown
  },
): unknown {
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
    // Singleton implementation - no caching needed for singletons
    const get = (): Effect.Effect<unknown, ContentOpError, FileSystem.FileSystem> =>
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
    }
    return singleton
  }

  // Collection implementation
  // Auto-extract unique keys from schema + merge with config
  const autoKeys = config.schema ? SecondaryKey.getFromFields(config.schema as any) : []
  const configKeys: string[] = config.secondaryKeys ?? []
  const secondaryKeys = [...new Set([...autoKeys, ...configKeys])]

  // Create schema for cache encode/decode if provided
  const outputSchema = config.schema ? S.Struct(config.schema as Struct.Fields) : null

  // Define list as a closure-captured function
  const list = (): Effect.Effect<unknown[], ContentOpError, Cache | FileSystem.FileSystem> =>
    Effect.gen(function*() {
      const cache = yield* Cache

      // Register schema for cache encode/decode (before load)
      if (outputSchema) cache.registerSchema(tag, outputSchema as CacheSchema)

      // Load this namespace's cache (schema already registered)
      yield* cache.load(tag)

      const sourceRecords = yield* config.store.readMany()
      const results: unknown[] = []

      for (const source of sourceRecords) {
        // Primary key is stable identifier (file path for DirStore)
        const primaryKey = String(source.primaryKey)

        // Compute combined hash: source data + definition version
        // Use string concatenation for stable/predictable hash combination
        const sourceHash = Hash.hash(source.data)
        const hash = Hash.hash(`${sourceHash}:${version}`)

        // Content-addressable lookup by primary key, validated by hash
        const cached = cache.getByPrimaryKey(tag, version, primaryKey, hash)
        let record: unknown

        if (Option.isSome(cached)) {
          config.onCacheEvent?.({ type: 'hit', hash })
          // Cache stores decoded values (schema handles encode/decode at disk boundary)
          record = cached.value
        } else {
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

  // Define get as a closure-captured function
  const get = (
    keyLookup: Record<string, string>,
  ): Effect.Effect<Option.Option<unknown>, ContentOpError, Cache | FileSystem.FileSystem> =>
    Effect.gen(function*() {
      const cache = yield* Cache

      // Register schema for cache encode/decode (before load)
      if (outputSchema) cache.registerSchema(tag, outputSchema as CacheSchema)

      // Load this namespace's cache (schema already registered)
      yield* cache.load(tag)

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
  }

  return collection
}

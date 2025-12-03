import { Schema as S } from 'effect'
import type { Struct } from 'effect/Schema'
import { createCacheManager } from './cache.js'
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
// Content
// ============================================================================

export namespace Content {
  /** Helper to create validated encoded store data. */
  export interface StoreMake<$Store extends StoreInterface> {
    make: (input: S.Schema.Encoded<StoreInterface.Schema<$Store>>) => S.Schema.Encoded<StoreInterface.Schema<$Store>>
  }

  /** Interface for cardinality '1' content (singleton). */
  export interface SingletonClass<$Tag extends string, $Store extends StoreInterface, $Output> {
    readonly _tag: $Tag
    readonly store: $Store
    readonly Store: StoreMake<$Store>
    readonly Type: $Output
    get(): Promise<$Output>
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
    list(): Promise<$Output[]>
    /** Get single record by unique key. */
    get(key: UniqueKeyLookup<$UniqueKeys>): Promise<$Output | undefined>
    /** Flush cache to disk. */
    flushCache(): Promise<void>
    /** Load cache from disk. */
    loadCache(): Promise<void>
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

  /** Config when schema AND map are provided (transformed output). */
  export interface ConfigWithSchemaAndMap<
    $Tag extends string,
    $Store extends StoreInterface,
    $Fields extends Struct.Fields,
    $UniqueKeys extends string = never,
  > {
    store: $Store
    schema: $Fields
    map: (data: StoreInterface.Data<$Store>) => Promise<Struct.Type<$Fields>>
    uniqueKeys?: $UniqueKeys[]
  }

  /** Config for passthrough (no schema, no map). */
  export interface ConfigPassthrough<
    $Tag extends string,
    $Store extends StoreInterface,
  > {
    store: $Store
  }

  /** Config for singleton with schema and map. */
  export interface ConfigSingletonWithSchemaAndMap<
    $Tag extends string,
    $Store extends StoreInterface,
    $Fields extends Struct.Fields,
  > {
    store: $Store
    schema: $Fields
    map: (data: StoreInterface.Data<$Store>) => Promise<Struct.Type<$Fields>>
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
    map?: (data: unknown) => Promise<unknown>
    uniqueKeys?: string[]
  },
): unknown {
  const cardinality = config.store.cardinality
  const hasSchema = config.schema !== undefined
  const hasMap = config.map !== undefined

  // Build the output schema for caching
  const outputSchema = hasSchema
    ? S.Struct(config.schema as any)
    : config.store.schema

  // Default map is identity
  const mapFn = hasMap
    ? config.map!
    : (data: any) => Promise.resolve(data)

  if (cardinality === '1') {
    // Singleton implementation
    const singleton = {
      _tag: tag,
      store: config.store,
      Store: {
        make: (input: any) => {
          S.decodeUnknownSync(config.store.schema)(input)
          return input
        },
      },
      async get() {
        const records = await config.store.readMany()
        if (records.length === 0) {
          throw new Error(`Content ${tag} has no data`)
        }
        const source = records[0]!
        return mapFn(source.data)
      },
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
    path: `.cache/${tag}.json`,
    recordSchema: outputSchema as any,
    uniqueKeys,
  })

  // Track if cache has been loaded
  let cacheLoaded = false

  const ensureCacheLoaded = async () => {
    if (!cacheLoaded) {
      await cache.load()
      cacheLoaded = true
    }
  }

  const collection = {
    _tag: tag,
    store: config.store,
    uniqueKeys: uniqueKeys as readonly string[],
    Store: {
      make: (input: any) => {
        S.decodeUnknownSync(config.store.schema)(input)
        return input
      },
    },

    async list(): Promise<any[]> {
      await ensureCacheLoaded()

      const sourceRecords = await config.store.readMany()
      const results: any[] = []

      for (const source of sourceRecords) {
        // Content-addressable lookup by hash
        const cached = cache.get(source.hash)
        let record: any

        if (cached) {
          record = cached
        } else {
          // Cache miss - run map
          record = await mapFn(source.data)
          cache.set(source.hash, record)
        }

        // Build/rebuild indices for unique keys (needed after loading from disk)
        for (const key of uniqueKeys) {
          const value = record[key]
          if (typeof value === 'string') {
            cache.setIndex(key, value, source.hash)
          }
        }

        results.push(record)
      }

      return results
    },

    async get(keyLookup: Record<string, string>) {
      await ensureCacheLoaded()

      // Extract the single key from the lookup object
      const entries = Object.entries(keyLookup)
      if (entries.length !== 1) {
        throw new Error(`get() expects exactly one key, got ${entries.length}`)
      }
      const [keyName, keyValue] = entries[0]!

      // Try O(1) index lookup first
      const cached = cache.getByKey(keyName, keyValue)
      if (cached) return cached

      // If not in cache, populate cache via list() and try again
      await this.list()
      return cache.getByKey(keyName, keyValue)
    },

    flushCache() {
      return cache.flush()
    },

    loadCache() {
      return cache.load()
    },
  }

  return collection
}

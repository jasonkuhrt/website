import { Error as PlatformErrorModule, FileSystem } from '@effect/platform'
import { Effect, Schema as S } from 'effect'

// ============================================================================
// Types
// ============================================================================

/** Schema without context requirements (can be decoded synchronously). */
export type SchemaNoContext = S.Schema<any, any, never>

export type Cardinality = '1' | 'n'

export const defaultCardinality = 'n' as const

/** Valid primary key types for stores. */
export type PrimaryKey = string | number

/** Common error type for store operations. */
export type StoreError = PlatformErrorModule.PlatformError

/** Runtime info about a PrimaryKey field (used by JsStore). */
export interface PrimaryKeyInfo {
  /** Field name in the struct */
  fieldName: string
  /** The schema for encoding/decoding */
  schema: S.Schema.Any
}

// ============================================================================
// Store
// ============================================================================

// dprint-ignore
export interface Store<
  $Schema extends SchemaNoContext = SchemaNoContext,
  $Cardinality extends Cardinality = Cardinality,
  $PrimaryKey extends PrimaryKey = PrimaryKey,
> {
  cardinality: $Cardinality
  /** Base directories for file watcher registration. */
  watchPaths: string[]
  /** Original glob patterns for precise file matching. */
  watchGlobs: string[]
  schema: $Schema
  /** PrimaryKey field info (optional, only for JsStore with PrimaryKey combinator). */
  primaryKeyInfo?: PrimaryKeyInfo
  /** Read all records from the store. */
  readMany(): Effect.Effect<
    SourceRecord<S.Schema.Type<$Schema>, $PrimaryKey>[],
    StoreError,
    FileSystem.FileSystem
  >
  /** Read a single record by primary key. For singletons (cardinality '1'), key is ignored. */
  readOne(
    ...args: $Cardinality extends '1' ? [] : [$PrimaryKey]
  ): Effect.Effect<
    SourceRecord<S.Schema.Type<$Schema>, $PrimaryKey>,
    StoreError,
    FileSystem.FileSystem
  >
}

export namespace Store {
  /** Infer the schema type from a Store. */
  export type Schema<$Store extends Store> = $Store extends Store<infer __schema__> ? __schema__ : never

  /** Infer the decoded data type from a Store. */
  export type Data<$Store extends Store> = S.Schema.Type<Schema<$Store>>

  /** Infer the cardinality from a Store. */
  export type GetCardinality<$Store extends Store> = $Store extends Store<any, infer __cardinality__> ?
    __cardinality__ :
    never

  /** Infer the primary key type from a Store. */
  export type GetPrimaryKey<$Store extends Store> = $Store extends Store<any, any, infer __primaryKey__> ?
    __primaryKey__ :
    never
}

// ============================================================================
// SourceRecord
// ============================================================================

/**
 * Record returned by store.readMany() and store.readOne().
 * Contains the data, its stable identifier (primary key), and a freshness signature.
 */
export interface SourceRecord<$Data = unknown, $PrimaryKey = PrimaryKey> {
  /** Stable identifier for this record (file path for DirStore, hash for JsStore). */
  primaryKey: $PrimaryKey
  /**
   * Source freshness indicator for load-time cache validation.
   * - DirStore: mtime (number)
   * - JsStore/MediaDirStore: null (no validation)
   */
  signature: number | string | null
  /** Raw data passed to map(). */
  data: $Data
}

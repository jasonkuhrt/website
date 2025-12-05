import { Error as PlatformErrorModule, FileSystem } from '@effect/platform'
import { Effect, Schema as S } from 'effect'

// ============================================================================
// Types
// ============================================================================

/** Schema without context requirements (can be decoded synchronously). */
export type SchemaNoContext = S.Schema<any, any, never>

export type Cardinality = '1' | 'n'

export const defaultCardinality = 'n' as const

/** Common error type for store operations. */
export type StoreError = PlatformErrorModule.PlatformError

// ============================================================================
// Store
// ============================================================================

export interface Store<
  $Schema extends SchemaNoContext = SchemaNoContext,
  $Cardinality extends Cardinality = Cardinality,
> {
  cardinality: $Cardinality
  watchPaths: string[]
  schema: $Schema
  readMany: () => Effect.Effect<SourceRecord<S.Schema.Type<$Schema>>[], StoreError, FileSystem.FileSystem>
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
}

// ============================================================================
// SourceRecord
// ============================================================================

/**
 * Record returned by store.readMany().
 * Hash is used for content-addressable caching.
 */
export interface SourceRecord<$Data = unknown> {
  /**
   * Content hash for cache key.
   * If omitted, computed as Hash.hash(data).
   */
  hash?: number
  /** Raw data passed to map(). */
  data: $Data
}

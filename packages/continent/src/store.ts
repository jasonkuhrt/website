import { Schema as S } from 'effect'

// ============================================================================
// Types
// ============================================================================

/** Schema without context requirements (can be decoded synchronously). */
export type SchemaNoContext = S.Schema<any, any, never>

export type Cardinality = '1' | 'n'

export const defaultCardinality = 'n' as const

// ============================================================================
// Store
// ============================================================================

export interface Store<$Schema extends SchemaNoContext = SchemaNoContext, $Cardinality extends Cardinality = Cardinality> {
  cardinality: $Cardinality
  watchPaths: string[]
  schema: $Schema
  readMany: () => Promise<SourceRecord<S.Schema.Type<$Schema>>[]>
}

export namespace Store {
  /** Infer the schema type from a Store. */
  export type Schema<$Store extends Store> = $Store extends Store<infer __schema__> ? __schema__ : never

  /** Infer the decoded data type from a Store. */
  export type Data<$Store extends Store> = S.Schema.Type<Schema<$Store>>

  /** Infer the cardinality from a Store. */
  export type GetCardinality<$Store extends Store> = $Store extends Store<any, infer __cardinality__> ? __cardinality__ : never
}

// ============================================================================
// SourceRecord
// ============================================================================

/**
 * Record returned by store.readMany().
 * Hash is computed from data for content-addressable caching.
 */
export interface SourceRecord<$Data = unknown> {
  /** Content hash (Effect Hash trait). */
  hash: number
  /** Raw data passed to map(). */
  data: $Data
}

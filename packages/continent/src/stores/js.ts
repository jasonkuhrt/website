import { Effect, Hash, Match, Schema as S } from 'effect'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { ensureHashable, ensureHashableSchema } from '../lib/hashable.js'
import { dynamicImport } from '../lib/import.js'
import * as PrimaryKey from '../primary-key.js'
import { type Cardinality, defaultCardinality, type SchemaNoContext, type SourceRecord, type Store } from '../store.js'

// ============================================================================
// Source Repository (tagged union)
// ============================================================================

type SourceRepository =
  | { _tag: 'collection'; records: unknown[] }
  | { _tag: 'singleton'; record: unknown }

// ============================================================================
// JS Store
// ============================================================================

/**
 * Type alias for JS manifest-based stores.
 * PrimaryKey is string if PrimaryKey combinator used with string-encoded schema,
 * otherwise falls back to hash (number) for backwards compatibility.
 */
export type Js<
  $Schema extends SchemaNoContext = SchemaNoContext,
  $Cardinality extends Cardinality = Cardinality,
  $PrimaryKey extends string | number = string,
> = Store<$Schema, $Cardinality, $PrimaryKey>

export interface JsConfig<
  $Schema extends SchemaNoContext,
  $Cardinality extends Cardinality = typeof defaultCardinality,
> {
  path: string
  schema: $Schema
  /**
   * How many records the source file contains.
   * - `'1'`: Single record (default export is the record itself)
   * - `'n'`: Multiple records (default export is an array)
   * @default 'n'
   */
  cardinality?: $Cardinality
}

/** Create a JS manifest-based store. */
export const js = <$Schema extends SchemaNoContext, $Cardinality extends Cardinality = typeof defaultCardinality>(
  config: JsConfig<$Schema, $Cardinality>,
): Js<$Schema, $Cardinality, string | number> => {
  const cardinality = config.cardinality ?? defaultCardinality
  const decodeSourceRecord = S.decodeUnknownSync(ensureHashableSchema(config.schema))

  // Helper to extract primaryKey from raw item
  const pkInfo = PrimaryKey.getFromSchema(config.schema)
  const extractPrimaryKey: (sourceRecord: any) => string | number = pkInfo ?
    (sourceRecord) => PrimaryKey.read(pkInfo, sourceRecord) :
    (sourceRecord) => Hash.hash(ensureHashable(sourceRecord))

  // Internal helper - import and validate source module
  const importSourceRepository = () =>
    Effect.gen(function*() {
      const fullPath = join(process.cwd(), config.path)
      const fileUrl = pathToFileURL(fullPath).href
      const mod = yield* dynamicImport(fileUrl, { bustCache: true })
      const raw = mod.default

      if (cardinality === '1') return { _tag: 'singleton', record: raw } as const

      if (!Array.isArray(raw))
        return yield* Effect.die(new Error(`JsStore: Expected array for cardinality 'n' but got ${typeof raw}`))
      return { _tag: 'collection', records: raw } as const
    })

  return {
    cardinality: cardinality as $Cardinality,
    watchPaths: [config.path],
    watchGlobs: [config.path],
    schema: config.schema,
    primaryKeyInfo: pkInfo,
    readMany: () =>
      Effect.gen(function*() {
        const repo = yield* importSourceRepository()

        return Match.value(repo).pipe(
          Match.tagsExhaustive({
            singleton: ({ record }) => {
              const primaryKey = extractPrimaryKey(record)
              const data = decodeSourceRecord(record)
              return [{ primaryKey, signature: null, data }]
            },
            collection: ({ records }) =>
              records.map((record) => {
                const primaryKey = extractPrimaryKey(record)
                const data = decodeSourceRecord(record)
                return { primaryKey, signature: null, data }
              }),
          }),
        ) as SourceRecord<S.Schema.Type<$Schema>, string | number>[]
      }),
    readOne: (primaryKey?: string | number) =>
      Effect.gen(function*() {
        const repo = yield* importSourceRepository()

        return yield* Match.value(repo).pipe(
          Match.tagsExhaustive({
            singleton: ({ record }) => {
              const data = decodeSourceRecord(record)
              return Effect.succeed({ primaryKey: extractPrimaryKey(record), signature: null, data })
            },
            collection: ({ records }) => {
              const record = records.find((r) => extractPrimaryKey(r) === primaryKey)
              if (!record) return Effect.die(new Error(`JsStore: No record found with key ${primaryKey}`))
              const data = decodeSourceRecord(record)
              return Effect.succeed({ primaryKey: primaryKey!, signature: null, data })
            },
          }),
        )
      }),
  } as any
}

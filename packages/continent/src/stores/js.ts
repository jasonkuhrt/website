import { FileSystem } from '@effect/platform'
import { Effect, Hash, Option, Schema as S } from 'effect'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { ensureHashableSchema } from '../lib/hashable.js'
import { dynamicImport } from '../lib/import.js'
import { type Cardinality, defaultCardinality, type SchemaNoContext, type SourceRecord, type Store } from '../store.js'

// ============================================================================
// JS Store
// ============================================================================

/** Type alias for JS manifest-based stores. PrimaryKey is hash (number). */
export type Js<$Schema extends SchemaNoContext = SchemaNoContext, $Cardinality extends Cardinality = Cardinality> =
  Store<$Schema, $Cardinality, number>

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
): Js<$Schema, $Cardinality> => {
  const cardinality = config.cardinality ?? defaultCardinality
  // Wrap schema at creation time to ensure decoded values are hashable
  const hashableSchema = ensureHashableSchema(config.schema)

  // Helper to load all records from the manifest file
  const loadRecords = () =>
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      const fullPath = join(process.cwd(), config.path)

      // Get mtime for cache busting
      const info = yield* fs.stat(fullPath)
      const mtime = Option.getOrElse(info.mtime, () => new Date(0)).getTime()

      // Dynamic import with cache busting via timestamp query param
      const fileUrl = pathToFileURL(fullPath).href + `?t=${mtime}`
      const mod = yield* dynamicImport(fileUrl)
      const raw = mod.default

      if (cardinality === '1') {
        const data = S.decodeUnknownSync(hashableSchema)(raw)
        const primaryKey = Hash.hash(data)
        return [{ primaryKey, signature: null, data }] as SourceRecord<S.Schema.Type<$Schema>, number>[]
      }

      // 'n'
      const items = Array.isArray(raw) ? raw : []
      return items.map((item) => {
        const data = S.decodeUnknownSync(hashableSchema)(item)
        const primaryKey = Hash.hash(data)
        return { primaryKey, signature: null, data }
      }) as SourceRecord<S.Schema.Type<$Schema>, number>[]
    })

  return {
    cardinality: cardinality as $Cardinality,
    watchPaths: [config.path],
    watchGlobs: [config.path],
    schema: config.schema,

    readMany: loadRecords,

    readOne: (primaryKey: number) =>
      Effect.gen(function*() {
        const records = yield* loadRecords()
        const found = records.find((r) => r.primaryKey === primaryKey)
        if (!found) return yield* Effect.die(new Error(`JsStore: No record found with hash ${primaryKey}`))
        return found
      }),
  }
}

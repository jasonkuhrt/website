import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { FileSystem } from '@effect/platform'
import { Effect, Hash, Option, Schema as S } from 'effect'
import { ensureHashable } from '../lib/hashable.js'
import { dynamicImport } from '../lib/import.js'
import { type Cardinality, defaultCardinality, type SchemaNoContext, type Store } from '../store.js'

// ============================================================================
// JS Store
// ============================================================================

/** Type alias for JS manifest-based stores. */
export type Js<$Schema extends SchemaNoContext = SchemaNoContext, $Cardinality extends Cardinality = Cardinality> =
  Store<$Schema, $Cardinality>

export interface JsConfig<$Schema extends SchemaNoContext, $Cardinality extends Cardinality = typeof defaultCardinality> {
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
  return {
    cardinality: cardinality as $Cardinality,
    watchPaths: [config.path],
    schema: config.schema,
    readMany: () =>
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem
        const fullPath = join(process.cwd(), config.path)

        // Get mtime for cache busting
        const info = yield* fs.stat(fullPath)
        const mtime = Option.getOrElse(info.mtime, () => new Date(0)).getTime()

        // Dynamic import with cache busting via timestamp query param
        // Requires tsx loader (--import tsx/esm) for TypeScript resolution in production
        const fileUrl = pathToFileURL(fullPath).href + `?t=${mtime}`
        const mod = yield* dynamicImport(fileUrl)
        const raw = mod.default

        if (cardinality === '1') {
          const data = S.decodeUnknownSync(config.schema)(raw)
          const hashable = ensureHashable(data)
          return [{ hash: Hash.hash(hashable), data }]
        }

        // 'n'
        const items = Array.isArray(raw) ? raw : []
        return items.map((item) => {
          const data = S.decodeUnknownSync(config.schema)(item)
          const hashable = ensureHashable(data)
          return { hash: Hash.hash(hashable), data }
        })
      }),
  }
}

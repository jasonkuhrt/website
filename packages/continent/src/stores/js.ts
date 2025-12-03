import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import { Hash, Schema as S } from 'effect'
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
    async readMany() {
      const fullPath = join(process.cwd(), config.path)
      const mtime = (await stat(fullPath)).mtimeMs
      const mod = await import(/* @vite-ignore */ `${fullPath}?t=${mtime}`)
      const raw = mod.default

      if (cardinality === '1') {
        const data = S.decodeUnknownSync(config.schema)(raw)
        return [{ hash: Hash.hash(data), data }]
      }

      // 'n'
      const items = Array.isArray(raw) ? raw : []
      return items.map((item) => {
        const data = S.decodeUnknownSync(config.schema)(item)
        return { hash: Hash.hash(data), data }
      })
    },
  }
}

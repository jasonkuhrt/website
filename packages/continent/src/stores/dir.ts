import { basename, extname } from 'node:path'
import { FileSystem } from '@effect/platform'
import { Effect, Hash, Schema as S } from 'effect'
import { glob as globFn } from 'tinyglobby'
import type { Store } from '../store.js'

// ============================================================================
// DirData - Fixed schema for directory stores
// ============================================================================

export const DirData = S.Struct({
  stem: S.String,
  path: S.String,
  content: S.String,
})

export type DirData = S.Schema.Type<typeof DirData>

// ============================================================================
// Dir Store
// ============================================================================

/** Type alias for directory-based stores. */
export type Dir = Store<typeof DirData, 'n'>

export interface DirConfig {
  glob: string
}

/** Create a directory-based store (always cardinality 'n'). */
export const dir = (config: DirConfig): Dir => ({
  cardinality: 'n',
  watchPaths: [config.glob.split('*')[0]!],
  schema: DirData,
  readMany: () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem

      // Use tinyglobby for globbing - treat failures as defects (unexpected)
      const files = yield* Effect.promise(() => globFn(config.glob, { cwd: process.cwd() }))

      // Read all files in parallel
      const results = yield* Effect.all(
        files.map((file) =>
          Effect.gen(function* () {
            const content = yield* fs.readFileString(file)
            const data: DirData = {
              stem: basename(file, extname(file)),
              path: file,
              content,
            }
            return { hash: Hash.hash(content), data }
          })
        ),
        { concurrency: 'unbounded' },
      )

      return results
    }),
})

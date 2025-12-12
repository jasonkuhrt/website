import { Error as PlatformError, FileSystem } from '@effect/platform'
import { Effect, Option, Schema as S } from 'effect'
import { basename, extname, resolve } from 'node:path'
import { glob as globFn } from 'tinyglobby'
import type { SourceRecord, Store } from '../store.js'

// ============================================================================
// DirData - Fixed schema for directory stores
// ============================================================================

export const DirData = S.Data(
  S.Struct({
    stem: S.String,
    path: S.String,
    content: S.String,
  }),
)

export type DirData = S.Schema.Type<typeof DirData>

// ============================================================================
// Dir Store
// ============================================================================

/** Type alias for directory-based stores. PrimaryKey is file path (string). */
export type Dir = Store<typeof DirData, 'n', string>

export interface DirConfig {
  glob: string
}

/** Helper to read a single file and return a SourceRecord. */
const readFile = (
  fs: FileSystem.FileSystem,
  filePath: string,
): Effect.Effect<SourceRecord<DirData, string>, PlatformError.PlatformError> =>
  Effect.gen(function*() {
    const info = yield* fs.stat(filePath)
    const mtime = Option.getOrElse(info.mtime, () => new Date(0)).getTime()
    const content = yield* fs.readFileString(filePath)
    const data = S.decodeUnknownSync(DirData)({
      stem: basename(filePath, extname(filePath)),
      path: filePath,
      content,
    })
    return { primaryKey: filePath, signature: mtime, data }
  })

/** Create a directory-based store (always cardinality 'n'). */
export const dir = (config: DirConfig): Dir => ({
  cardinality: 'n',
  watchPaths: [config.glob.split('*')[0]!],
  watchGlobs: [resolve(process.cwd(), config.glob)],
  schema: DirData,

  readMany: () =>
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      const files = yield* Effect.promise(() => globFn(config.glob, { cwd: process.cwd() }))
      return yield* Effect.all(
        files.map((file) => readFile(fs, file)),
        { concurrency: 'unbounded' },
      )
    }),

  readOne: (primaryKey: string) =>
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      return yield* readFile(fs, primaryKey)
    }),
})

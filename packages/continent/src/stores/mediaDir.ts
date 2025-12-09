import { Error as PlatformError, FileSystem } from '@effect/platform'
import { Effect, Schema as S } from 'effect'
import { basename, join } from 'node:path'
import { glob as globFn } from 'tinyglobby'
import type { SourceRecord, Store } from '../store.js'

// ============================================================================
// MediaDirData - Fixed schema for media directory stores
// ============================================================================

export const MediaFile = S.Struct({
  name: S.String,
  path: S.String,
  type: S.Union(S.Literal('image'), S.Literal('video')),
})

export type MediaFile = S.Schema.Type<typeof MediaFile>

export const MediaDirData = S.Struct({
  /** Directory name (stem). */
  stem: S.String,
  /** Full directory path. */
  path: S.String,
  /** Media files found in the directory. */
  mediaFiles: S.Array(MediaFile),
})

export type MediaDirData = S.Schema.Type<typeof MediaDirData>

// ============================================================================
// MediaDir Store
// ============================================================================

/** Type alias for media directory stores. PrimaryKey is directory path (string). */
export type MediaDir = Store<typeof MediaDirData, 'n', string>

export interface MediaDirConfig {
  /** Glob pattern matching directories (e.g., 'content/frame/*'). */
  glob: string
  /** Media file extensions to include. Default: ['jpg', 'jpeg', 'png', 'mp4', 'mov'] */
  extensions?: string[]
}

const defaultExtensions = ['jpg', 'jpeg', 'png', 'mp4', 'mov']

const inferMediaType = (filename: string): 'image' | 'video' => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext === 'mp4' || ext === 'mov' ? 'video' : 'image'
}

/** Helper to scan a single directory for media files. */
const scanDir = (
  fs: FileSystem.FileSystem,
  dirPath: string,
  extensions: string[],
): Effect.Effect<SourceRecord<MediaDirData, string> | null, PlatformError.PlatformError> =>
  Effect.gen(function*() {
    const info = yield* fs.stat(dirPath)
    if (info.type !== 'Directory') return null

    const entries = yield* fs.readDirectory(dirPath)
    const mediaFiles: MediaFile[] = []

    for (const entry of entries) {
      const ext = entry.split('.').pop()?.toLowerCase()
      if (ext && extensions.includes(ext)) {
        mediaFiles.push({
          name: entry,
          path: join(dirPath, entry),
          type: inferMediaType(entry),
        })
      }
    }

    mediaFiles.sort((a, b) => a.name.localeCompare(b.name))
    if (mediaFiles.length === 0) return null

    const data: MediaDirData = {
      stem: basename(dirPath),
      path: dirPath,
      mediaFiles,
    }

    return { primaryKey: dirPath, signature: null, data }
  })

/** Create a media directory store that scans directories for media files. */
export const mediaDir = (config: MediaDirConfig): MediaDir => {
  const extensions = config.extensions ?? defaultExtensions

  return {
    cardinality: 'n',
    watchPaths: [config.glob.split('*')[0]!],
    watchGlobs: [config.glob],
    schema: MediaDirData,

    readMany: () =>
      Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem
        const dirs = yield* Effect.promise(() => globFn(config.glob, { cwd: process.cwd(), onlyDirectories: true }))
        const results: SourceRecord<MediaDirData, string>[] = []

        for (const dirPath of dirs) {
          const record = yield* scanDir(fs, dirPath, extensions)
          if (record) results.push(record)
        }

        return results
      }),

    readOne: (primaryKey: string) =>
      Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem
        const record = yield* scanDir(fs, primaryKey, extensions)
        if (!record) return yield* Effect.die(new Error(`MediaDirStore: No media found in directory ${primaryKey}`))
        return record
      }),
  }
}

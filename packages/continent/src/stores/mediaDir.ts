import { FileSystem } from '@effect/platform'
import { Effect, Hash, Schema as S } from 'effect'
import { basename, join } from 'node:path'
import { glob as globFn } from 'tinyglobby'
import type { Store } from '../store.js'

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

/** Type alias for media directory stores. */
export type MediaDir = Store<typeof MediaDirData, 'n'>

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

/** Create a media directory store that scans directories for media files. */
export const mediaDir = (config: MediaDirConfig): MediaDir => {
  const extensions = config.extensions ?? defaultExtensions

  return {
    cardinality: 'n',
    watchPaths: [config.glob.split('*')[0]!],
    schema: MediaDirData,

    readMany: () =>
      Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem

        // Use tinyglobby for globbing - treat failures as defects (unexpected)
        const dirs = yield* Effect.promise(() => globFn(config.glob, { cwd: process.cwd(), onlyDirectories: true }))
        const results: { hash: number; data: MediaDirData }[] = []

        for (const dirPath of dirs) {
          // Check if it's actually a directory
          const info = yield* fs.stat(dirPath)
          if (info.type !== 'Directory') continue

          // Scan for media files
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

          // Sort by filename for consistent ordering
          mediaFiles.sort((a, b) => a.name.localeCompare(b.name))

          // Skip directories with no media files
          if (mediaFiles.length === 0) continue

          const data: MediaDirData = {
            stem: basename(dirPath),
            path: dirPath,
            mediaFiles,
          }

          // Hash based on directory structure (media file paths)
          const hashSource = mediaFiles.map((f) => f.path).join('|')
          results.push({ hash: Hash.hash(hashSource), data })
        }

        return results
      }),
  }
}

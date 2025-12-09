import { FileSystem } from '@effect/platform'
import { Effect, Option } from 'effect'
import { fileURLToPath } from 'node:url'

/**
 * Represents the structure of a dynamically imported ES module.
 */
export interface EsModule<$Default = unknown> {
  default: $Default
  [key: string]: unknown
}

export interface DynamicImportOptions {
  /**
   * Append mtime query param to bust Node.js ESM module cache.
   * Required because ESM caches by URL with no invalidation API.
   * @default false
   */
  bustCache?: boolean
}

/**
 * Dynamically import a module as an Effect.
 * Handles the promise wrapper and provides typed module structure.
 */
export const dynamicImport = <$Default = unknown>(
  url: string,
  options?: DynamicImportOptions,
): Effect.Effect<EsModule<$Default>, never, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    let importUrl = url

    if (options?.bustCache) {
      const fs = yield* FileSystem.FileSystem
      // Convert file:// URL to path for stat
      const filePath = url.startsWith('file://') ? fileURLToPath(url) : url
      const info = yield* fs.stat(filePath)
      const mtime = Option.getOrElse(info.mtime, () => new Date(0)).getTime()
      importUrl = `${url}?t=${mtime}`
    }

    return yield* Effect.promise(
      () => import(/* @vite-ignore */ importUrl) as Promise<EsModule<$Default>>
    )
  }) as Effect.Effect<EsModule<$Default>, never, FileSystem.FileSystem>

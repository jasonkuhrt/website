import { NodeContext } from '@effect/platform-node'
import { Effect, Fiber, HashMap, HashSet } from 'effect'
import fg from 'fast-glob'
import { readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'
import { backgroundFlush, CacheLive, flushIfDirty } from './cache.js'

/**
 * Content definition interface for the plugin.
 * Matches Content.CollectionClass and Content.SingletonClass.
 */
export interface ContentDefinition {
  readonly _tag: string
  readonly store: {
    watchPaths: string[]
  }
}

/**
 * MIME types for common asset extensions.
 */
const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
}

/**
 * Invalidate a module in Vite's module graph and trigger HMR.
 */
const invalidateModule = (server: ViteDevServer, modulePath: string): void => {
  const module = server.moduleGraph.getModuleById(modulePath)
  if (module) {
    server.moduleGraph.invalidateModule(module)
    server.ws.send({ type: 'full-reload', path: '*' })
  }
}

/**
 * Vite plugin for Continent content framework.
 *
 * Features:
 * - Auto-discovers content definitions from `content/` directory
 * - Dynamic loading: new content files are picked up without restart
 * - HMR for content changes (watches store.watchPaths)
 * - Asset serving from content directories in dev mode
 * - Background cache flushing with globalThis singleton
 *
 * @example
 * ```typescript
 * // waku.config.ts or vite.config.ts
 * import { continentPlugin } from 'continent'
 *
 * export default defineConfig({
 *   plugins: [
 *     continentPlugin(),
 *   ],
 * })
 * ```
 */
export const continentPlugin = (): Plugin => {
  let shutdownFiber: Fiber.RuntimeFiber<void, never> | null = null

  return {
    name: 'continent',

    async configureServer(server) {
      // Track watch paths per content file (Effect HashMap)
      let contentDefinitionFilesToWatchPaths = HashMap.empty<string, HashSet.HashSet<string>>()

      // Derived: union of all watch paths
      const getAllWatchPaths = () =>
        HashMap.reduce(
          contentDefinitionFilesToWatchPaths,
          HashSet.empty<string>(),
          (acc, paths) => HashSet.union(acc, paths),
        )

      // Helper: import content file via ssrLoadModule and extract watch paths
      const importContentFile = async (file: string) => {
        try {
          const mod = await server.ssrLoadModule(file)
          let paths = HashSet.empty<string>()

          for (const exp of Object.values(mod)) {
            if (exp && typeof exp === 'object' && 'store' in exp) {
              const store = (exp as ContentDefinition).store
              if (store?.watchPaths) {
                for (const p of store.watchPaths) {
                  const resolved = resolve(process.cwd(), p)
                  paths = HashSet.add(paths, resolved)
                  server.watcher.add(resolved)
                }
              }
            }
          }

          contentDefinitionFilesToWatchPaths = HashMap.set(contentDefinitionFilesToWatchPaths, file, paths)
          console.log(`[continent] Loaded ${file}`)
        } catch (err) {
          console.error(`[continent] Failed to import ${file}:`, err)
        }
      }

      // Helper: remove content file's watch paths
      const removeContentFile = (file: string) => {
        if (!HashMap.has(contentDefinitionFilesToWatchPaths, file)) return
        contentDefinitionFilesToWatchPaths = HashMap.remove(contentDefinitionFilesToWatchPaths, file)
        console.log(`[continent] Unloaded ${file}`)
      }

      // 1. Initial discovery
      const contentFiles = await fg('content/**/*.ts', {
        cwd: process.cwd(),
        absolute: true,
      })

      console.log(`[continent] Found ${contentFiles.length} content definitions`)

      for (const file of contentFiles)
        await importContentFile(file)

      // 2. Watch for new/removed content files
      const contentDir = resolve(process.cwd(), 'content')
      server.watcher.add(`${contentDir}/**/*.ts`)

      server.watcher.on('add', async (filePath) => {
        if (filePath.startsWith(contentDir) && filePath.endsWith('.ts')) {
          // Skip if already tracked (initial load)
          if (HashMap.has(contentDefinitionFilesToWatchPaths, filePath)) return
          await importContentFile(filePath)
        }
      })

      server.watcher.on('unlink', (filePath) => {
        if (HashMap.has(contentDefinitionFilesToWatchPaths, filePath))
          removeContentFile(filePath)
      })

      // 3. Start background flush with Cache service (uses globalThis singleton)
      shutdownFiber = Effect.runFork(
        backgroundFlush.pipe(
          Effect.provide(CacheLive),
          Effect.provide(NodeContext.layer),
        ),
      )

      // 4. HMR for content assets
      server.watcher.on('all', (event, filePath) => {
        if (event !== 'add' && event !== 'change' && event !== 'unlink') return
        const allPaths = getAllWatchPaths()
        if (HashSet.has(allPaths, filePath) || HashSet.some(allPaths, (wp) => filePath.startsWith(wp)))
          invalidateModule(server, filePath)
      })

      // 5. Shutdown handler
      server.httpServer?.on('close', () => {
        if (shutdownFiber) {
          Effect.runPromise(
            Effect.gen(function* () {
              yield* Fiber.interrupt(shutdownFiber!)
              yield* flushIfDirty
            }).pipe(
              Effect.provide(CacheLive),
              Effect.provide(NodeContext.layer),
            ),
          )
        }
      })

      // 6. Asset middleware
      return () => {
        server.middlewares.use((req, res, next) => {
          const url = req.url
          if (!url) return next()

          // Assets are served from content directories with /content/ prefix
          if (!url.startsWith('/content/')) return next()

          // Try to serve from content directory
          const assetPath = resolve(process.cwd(), url.slice(1)) // Remove leading /
          try {
            const content = readFileSync(assetPath)
            const ext = extname(assetPath).toLowerCase()
            const mimeType = MIME_TYPES[ext] || 'application/octet-stream'

            res.setHeader('Content-Type', mimeType)
            res.setHeader('Cache-Control', 'no-cache')
            res.end(content)
          } catch {
            next()
          }
        })
      }
    },
  }
}

import { NodeContext } from '@effect/platform-node'
import { Console, Effect, Fiber, Match, Option, Stream } from 'effect'
import { readFileSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import type { Plugin } from 'vite'
import * as Cache from './cache.js'
import type { Content } from './content.js'
import * as DefinitionRegistry from './definition-registry.js'

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
 * Options for the Continent Vite plugin.
 */
export interface ContinentPluginOptions {
  /** Glob pattern for discovering content definition files. */
  discoveryGlob?: string
  /** Initial definitions to register (optional). */
  definitions?: Content.Base[]
  /** Root directory for resolving paths. Defaults to process.cwd(). */
  root?: string
}

const DEFAULT_DISCOVERY_GLOB = 'src/content/**/[!_]*.ts'

/**
 * Vite plugin for Continent content framework.
 *
 * Features:
 * - Auto-discovers content definitions from `src/content/` directory
 * - Manual definitions override via `definitions` option
 * - Dynamic loading: new content files are picked up without restart
 * - HMR for content changes (watches store.watchPaths)
 * - Asset serving from content directories in dev mode
 * - Background cache flushing with globalThis singleton
 */
export const continentPlugin = (options: ContinentPluginOptions = {}): Plugin => {
  let shutdownFiber: Fiber.RuntimeFiber<void, never> | null = null
  let pruningFiber: Fiber.RuntimeFiber<void, never> | null = null
  let importFiber: Fiber.RuntimeFiber<void, never> | null = null

  return {
    name: 'continent',

    async configureServer(server) {
      const root = options.root ?? process.cwd()
      const registry = DefinitionRegistry.create({
        discoveryGlob: options.discoveryGlob ?? DEFAULT_DISCOVERY_GLOB,
        definitions: options.definitions,
        root,
      })
      const loadModule = (path: string) => Effect.tryPromise(() => server.ssrLoadModule(path))

      // 1. Start pruning stream (consumes registry.pruningStream)
      pruningFiber = Effect.runFork(
        registry.pruningStream.pipe(
          Effect.provide(Cache.CacheLive),
          Effect.provide(NodeContext.layer),
        ),
      )

      // 2. Start activation stream (handles watch path setup for all imported definitions)
      importFiber = Effect.runFork(
        registry.importStream.pipe(
          Stream.runForEach((def) =>
            Effect.sync(() => {
              for (const p of def.store.watchPaths) server.watcher.add(resolve(root, p))
              console.log(`[continent] Loaded ${def._tag}`)
            })
          ),
        ),
      )

      // 3. Run discovery (merges with any initial definitions from constructor)
      await Effect.runPromise(registry.discover(loadModule))

      // 3b. Preload cache for all discovered definitions
      for (const def of registry.getAll()) {
        await Effect.runPromise(
          def.restoreCache().pipe(
            Effect.provide(Cache.CacheLive),
            Effect.provide(NodeContext.layer),
          ),
        )
      }
      console.log(`[continent] Preloaded cache for ${registry.getAll().length} definitions`)

      // 4. Watch for definition files
      const discoveryGlob = resolve(root, registry.config.discoveryGlob)
      if (!options.definitions) server.watcher.add(discoveryGlob)

      // 5. Start background flush
      shutdownFiber = Effect.runFork(
        Cache.backgroundFlush.pipe(
          Effect.provide(Cache.CacheLive),
          Effect.provide(NodeContext.layer),
        ),
      )

      // 6. Handle SIGINT (Ctrl+C) for graceful shutdown
      // Vite only handles SIGTERM, not SIGINT, so we need to handle it ourselves
      const handleSigint = async () => {
        console.log('\n[continent] Received SIGINT, flushing cache...')
        await server.close()
        process.exit(0)
      }
      process.once('SIGINT', handleSigint)

      // Clean up SIGINT handler on server close
      server.httpServer?.on('close', () => {
        process.off('SIGINT', handleSigint)
      })

      // 7. File change handler
      server.watcher.on('all', (event, filePath) => {
        if (event !== 'add' && event !== 'change' && event !== 'unlink') return

        Effect.runPromise(
          Match.value(registry.getAffectedByFilePath(filePath)).pipe(
            Match.tag('Nothing', () => Effect.void),
            Match.tag('Definition', ({ definition }) =>
              Match.value(event).pipe(
                Match.when('add', () => registry.importFile(filePath, loadModule)),
                Match.when('change', () => registry.importFile(filePath, loadModule)),
                Match.when('unlink', () =>
                  Option.match(definition, {
                    onNone: () => Effect.void,
                    onSome: (def) =>
                      Effect.sync(() => {
                        registry.remove(def._tag)
                        console.log(`[continent] Unloaded ${def._tag}`)
                      }),
                  })),
                Match.exhaustive,
              )),
            Match.tag('Content', ({ definitions }) =>
              Effect.gen(function*() {
                yield* Console.log(`[continent] Content asset changed: ${filePath}`)

                const cache = yield* Cache.Cache

                for (const def of definitions) {
                  const relativePath = relative(root, filePath)
                  const removed = cache.removeByPrimaryKey(def._tag, def.version, relativePath)
                  if (removed) yield* Console.log(`[continent] Cleared cache for ${def._tag} key: ${relativePath}`)

                  if (def.sourceFilePath) {
                    const modules = server.moduleGraph.getModulesByFile(def.sourceFilePath)
                    if (modules) {
                      for (const mod of modules) server.moduleGraph.invalidateModule(mod)
                      yield* Console.log(`[continent] Invalidated ${modules.size} module(s) for ${def._tag}`)
                    }
                  }
                }

                const hot = (server as any).environments?.client?.hot ?? server.ws
                hot.send({
                  type: 'custom',
                  event: 'rsc:update',
                  data: { type: 'continent:content', file: filePath },
                })
                yield* Console.log(`[continent] Sent rsc:update event`)
              })),
            Match.exhaustive,
          ).pipe(Effect.provide(Cache.CacheLive)),
        ).catch((err) => console.error(`[continent] Error handling ${event} for ${filePath}:`, err))
      })

      // 9. Asset middleware
      return () => {
        server.middlewares.use((req, res, next) => {
          const url = req.url
          if (!url) return next()

          if (!url.startsWith('/content/')) return next()

          const assetPath = resolve(root, url.slice(1))
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

    async buildEnd() {
      if (shutdownFiber) Effect.runSync(Fiber.interrupt(shutdownFiber))
      if (pruningFiber) Effect.runSync(Fiber.interrupt(pruningFiber))
      if (importFiber) Effect.runSync(Fiber.interrupt(importFiber))

      await Effect.runPromise(
        Cache.flushIfDirty.pipe(
          Effect.provide(Cache.CacheLive),
          Effect.provide(NodeContext.layer),
        ),
      )
    },
  }
}

import { readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

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

export interface ContinentPluginOptions {
  /**
   * Content definitions to watch and serve assets for.
   * Import your content definitions and pass them here.
   *
   * @example
   * ```typescript
   * import { Essay } from './src/content/essay.js'
   * import { Drivel } from './src/content/drivel.js'
   *
   * continentPlugin({
   *   definitions: [Essay, Drivel],
   * })
   * ```
   */
  definitions: ContentDefinition[]
}

// TODO: Add async auto-discovery option that loads definitions from a directory
// This would require either:
// - A factory function that returns a Promise<Plugin>
// - Using a later hook like configureServer (but then configResolved can't use definitions)
// - Accepting a glob pattern and doing file-system only watching without importing

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
 * - HMR for content changes (watches store.watchPaths)
 * - Asset serving from content directories in dev mode
 *
 * @example
 * ```typescript
 * // waku.config.ts or vite.config.ts
 * import { continentPlugin } from 'continent'
 * import { Essay } from './src/content/essay.js'
 * import { Drivel } from './src/content/drivel.js'
 *
 * export default defineConfig({
 *   plugins: [
 *     continentPlugin({
 *       definitions: [Essay, Drivel],
 *     }),
 *   ],
 * })
 * ```
 */
export const continentPlugin = ({ definitions }: ContinentPluginOptions): Plugin => {
  return {
    name: 'continent',

    configResolved() {
      console.log(`[continent] Watching ${definitions.length} content definitions`)
    },

    configureServer(server) {
      // Collect all watch paths from definitions
      const watchPaths = new Set<string>()
      for (const def of definitions) {
        for (const path of def.store.watchPaths) {
          watchPaths.add(resolve(process.cwd(), path))
        }
      }

      // Add watch paths to Vite's watcher
      for (const path of watchPaths) {
        server.watcher.add(path)
      }

      // Handle file changes - trigger full reload for content changes
      server.watcher.on('all', (event, filePath) => {
        if (event !== 'add' && event !== 'change' && event !== 'unlink') return

        // Check if file is in any watched content path
        const isContentFile = [...watchPaths].some((watchPath) => filePath.startsWith(watchPath))
        if (isContentFile) {
          invalidateModule(server, filePath)
        }
      })

      // Middleware to serve content assets
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

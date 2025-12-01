import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'
import type { Definition } from './definition.js'

export interface ContinentPluginOptions {
  /**
   * Content definitions to manage.
   */
  definitions: Definition[]
  /**
   * Path to content definitions directory (for HMR invalidation).
   * Defaults to 'src/content'.
   */
  contentDefsPath?: string
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
 * Build a reverse mapping from dest paths to src paths for asset serving.
 */
const buildAssetMap = async (definitions: Definition[]): Promise<Map<string, string>> => {
  const assetMap = new Map<string, string>()
  for (const def of definitions) {
    const mappings = await def.getAssetMappings()
    for (const { src, dest } of mappings) {
      // Normalize dest to URL path format (leading slash, no 'public' prefix)
      const urlPath = '/' + dest
      assetMap.set(urlPath, src)
    }
  }
  return assetMap
}

/**
 * Find which definition owns a changed file and return its module path for HMR.
 */
const findDefinitionForFile = (
  filePath: string,
  definitions: Definition[],
  contentDefsPath: string,
): string | null => {
  for (const def of definitions) {
    const watchPaths = def.getWatchPaths()
    if (watchPaths.some(root => filePath.startsWith(root))) {
      // Return the definition module path for HMR invalidation
      return resolve(contentDefsPath, `${def.name}.ts`)
    }
  }
  return null
}

/**
 * Invalidate a module in Vite's module graph and trigger HMR.
 */
const invalidateModule = (server: ViteDevServer, modulePath: string): void => {
  const module = server.moduleGraph.getModuleById(modulePath)
  if (module) {
    server.moduleGraph.invalidateModule(module)
    // Send HMR update
    server.ws.send({
      type: 'full-reload',
      path: '*',
    })
  }
}

/**
 * Vite plugin for Continent content framework.
 *
 * Features:
 * - HMR via definition module invalidation (content change → invalidate definition → HMR propagates)
 * - Asset serving from source in dev (no copy to /public until build)
 * - Asset copying during build
 */
export const continentPlugin = ({
  definitions,
  contentDefsPath = 'src/content',
}: ContinentPluginOptions): Plugin => {
  let assetMap: Map<string, string> = new Map()
  let isProduction = false

  const copyAssets = async () => {
    for (const def of definitions) {
      const assets = await def.getAssetMappings()
      for (const { src, dest } of assets) {
        const destPath = join('public', dest)
        mkdirSync(dirname(destPath), { recursive: true })
        copyFileSync(src, destPath)
      }
    }
  }

  return {
    name: 'continent',

    configResolved(config) {
      isProduction = config.command === 'build'
    },

    async buildStart() {
      if (isProduction) {
        // Only copy assets during production build
        await copyAssets()
      } else {
        // In dev, build asset map for middleware serving
        assetMap = await buildAssetMap(definitions)
      }
    },

    configureServer(server) {
      // Resolve contentDefsPath to absolute
      const absoluteContentDefsPath = resolve(process.cwd(), contentDefsPath)

      // Watch all definition roots (content directories)
      const watchPaths = definitions.flatMap(def => def.getWatchPaths())
      for (const path of watchPaths) server.watcher.add(path)

      // Also watch the content definitions directory (for loader changes)
      server.watcher.add(absoluteContentDefsPath)

      // Handle file changes: invalidate definition cache and trigger HMR
      server.watcher.on('all', async (event, filePath) => {
        if (event !== 'add' && event !== 'change' && event !== 'unlink') return

        // Check if this is a definition module change (loader logic changed)
        if (filePath.startsWith(absoluteContentDefsPath) && filePath.endsWith('.ts')) {
          // Find the definition by matching filename to definition name
          const fileName = filePath.replace(absoluteContentDefsPath + '/', '').replace('.ts', '')
          const def = definitions.find(d => d.name === fileName)
          if (def) {
            // Invalidate this definition's cache (loader logic changed)
            def.invalidateCache()
            // Rebuild asset map
            assetMap = await buildAssetMap(definitions)
            // Trigger full reload
            invalidateModule(server, filePath)
          }
          return
        }

        // Find which definition owns this content file
        const defModulePath = findDefinitionForFile(filePath, definitions, contentDefsPath)
        if (!defModulePath) return

        // Find the definition and invalidate its cache
        for (const def of definitions) {
          const defWatchPaths = def.getWatchPaths()
          if (defWatchPaths.some(root => filePath.startsWith(root))) {
            def.invalidateCache()
            break
          }
        }

        // Rebuild asset map (in case assets changed)
        assetMap = await buildAssetMap(definitions)

        // Invalidate the definition module in Vite's graph and trigger HMR
        invalidateModule(server, defModulePath)
      })

      // Middleware to serve assets from source locations
      return () => {
        server.middlewares.use((req, res, next) => {
          const url = req.url
          if (!url) return next()

          // Check if this URL maps to a content asset
          const srcPath = assetMap.get(url)
          if (!srcPath) return next()

          try {
            const content = readFileSync(srcPath)
            const ext = extname(srcPath).toLowerCase()
            const mimeType = MIME_TYPES[ext] || 'application/octet-stream'

            res.setHeader('Content-Type', mimeType)
            res.setHeader('Cache-Control', 'no-cache')
            res.end(content)
          } catch {
            // File not found, continue to next middleware
            next()
          }
        })
      }
    },
  }
}

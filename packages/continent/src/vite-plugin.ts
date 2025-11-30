import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { Plugin } from 'vite'
import type { Definition } from './definition.js'

export interface AssetsPluginOptions {
  definitions: Definition[]
}

/**
 * Vite plugin that copies content assets to public directory.
 *
 * Uses Definition.getAssetsToCopy() for asset discovery and mapping.
 * Uses Definition.getWatchPaths() for dev server watching.
 */
export const assetsPlugin = ({ definitions }: AssetsPluginOptions): Plugin => {
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
    name: 'continent-assets',

    async buildStart() {
      await copyAssets()
    },

    configureServer(server) {
      // Watch all definition roots
      const watchPaths = definitions.flatMap(def => def.getWatchPaths())
      for (const path of watchPaths)
        server.watcher.add(path)

      server.watcher.on('all', async (event, file) => {
        // Check if file is in any watched path
        for (const def of definitions) {
          const roots = def.getWatchPaths()
          if (roots.some(root => file.startsWith(root))) {
            await copyAssets()
            break
          }
        }
      })
    },
  }
}

/**
 * Rehype plugin that injects image aspect ratios as CSS custom properties.
 *
 * This enables CSS-based grid-snapping of image heights using:
 * ```css
 * img {
 *   --h: round(down, 100cqi / var(--aspect-ratio), 6px);
 *   height: var(--h);
 *   width: calc(var(--h) * var(--aspect-ratio));
 * }
 * ```
 */
import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from 'image-size'
import type { Root } from 'hast'
import { visit } from 'unist-util-visit'

export interface Options {
  /** Base path for resolving image URLs to filesystem paths */
  basePath?: string
}

export const rehypeImageDimensions = (options: Options = {}) => {
  const basePath = options.basePath ?? process.cwd()

  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return

      const src = node.properties?.src
      if (typeof src !== 'string') return

      // Only process absolute paths (already rewritten by MDX processing)
      if (!src.startsWith('/')) return

      // Resolve to filesystem path (strip leading / since path.join treats absolute paths as root)
      const imagePath = path.join(basePath, src.slice(1))

      try {
        const buffer = fs.readFileSync(imagePath)
        const dimensions = imageSize(new Uint8Array(buffer))
        if (dimensions.width && dimensions.height) {
          const aspectRatio = dimensions.width / dimensions.height
          node.properties.style = `--aspect-ratio: ${aspectRatio}`
        }
      } catch {
        // Image not found or unreadable - skip silently
      }
    })
  }
}

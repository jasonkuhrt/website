'use client'

import { useEffect } from 'react'
import { detectMixedContent } from '../styles/core/debug-mixed-content.js'

/**
 * Client component that runs mixed content detection in dev mode.
 * Must be conditionally rendered with `import.meta.env.DEV` for tree-shaking:
 *
 * @example
 * ```tsx
 * {import.meta.env.DEV && <DebugMixedContent />}
 * ```
 */
export const DebugMixedContent: React.FC = () => {
  useEffect(() => {
    if (document.documentElement.classList.contains('debug')) detectMixedContent()
  }, [])
  return null
}

/**
 * Vertical Rhythm Grid Overlay
 *
 * Displays a visual grid overlay showing the 6px baseline grid
 * for design QA and debugging vertical rhythm alignment.
 *
 * Features:
 * - Horizontal lines every 6px (0.375rem)
 * - Adapts to light/dark theme
 * - Non-interactive (pointer-events: none)
 * - Toggleable via settings
 */

import { css } from '../../../styled-system/css'
import { token } from '../../../styled-system/tokens'
import { useSettings } from '../../lib/settings'

const overlay = css({
  position: 'fixed',
  inset: '0',
  zIndex: '49', // Below settings button (z-50)
  pointerEvents: 'none',
  // Repeating horizontal lines every 6px (baseline unit)
  backgroundImage: `repeating-linear-gradient(
    180deg,
    ${token('colors.text.primary')} 0px,
    ${token('colors.text.primary')} 1px,
    transparent 1px,
    transparent 6px
  )`,
  opacity: '20',
})

export function VerticalRhythmOverlay() {
  const { settings, isHydrated } = useSettings()

  // Don't render during SSR or if setting is off
  if (!isHydrated || settings.gridOverlay === 'off') return null

  return <div className={overlay} aria-hidden='true' />
}

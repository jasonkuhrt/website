import { css } from '../../../styled-system/css'

/**
 * Shared modal/overlay styles for centered dialogs and popups.
 * Use these utilities for modals, dialogs, and overlay content.
 */

/**
 * Full-screen overlay backdrop
 * Creates a fixed overlay that covers the entire viewport
 */
export const overlay = css({
  position: 'fixed',
  inset: '[0]',
  backgroundColor: 'overlay.medium',
  zIndex: '[40]',
})

/**
 * Centered modal content box
 * Positions content in the center of the viewport using transform
 */
export const centeredContent = css({
  position: 'fixed',
  top: '[50%]',
  left: '[50%]',
  transform: '[translate(-50%, -50%)]',
  zIndex: '[50]',
})

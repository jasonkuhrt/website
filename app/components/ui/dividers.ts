import { css } from '#styled-system/css'

/**
 * Border divider utilities for consistent separators.
 * Use these for table rows, card sections, and other content divisions.
 */

/**
 * Solid divider with default border color
 * Most common divider style for headers and sections
 */
export const solid = css({
  borderBottom: '1px solid',
  borderColor: 'border.default',
})

/**
 * Subtle divider with lighter border color
 * Use for row separators that should be less prominent
 */
export const subtle = css({
  borderBottom: '1px solid',
  borderColor: 'border.subtle',
})

/**
 * Dotted divider with reduced opacity
 * Use for metadata rows and decorative separators
 */
export const dotted = css({
  borderBottom: '1px dotted',
  borderColor: 'border.default',
  opacity: '40',
})

/**
 * Thick divider for major section breaks
 */
export const thick = css({
  borderBottom: '2px solid',
  borderColor: 'border.default',
})

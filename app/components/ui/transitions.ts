/**
 * Common transition utilities for consistent animations
 */

import { css } from '#styled-system/css'

/**
 * Opacity transition with base duration
 * Common pattern for hover/active states
 */
export const opacityTransition = css({
  transitionProperty: '[opacity]',
  transitionDuration: 'base',
})

/**
 * Opacity transition with fast duration
 * For quicker feedback on interactions
 */
export const opacityTransitionFast = css({
  transitionProperty: '[opacity]',
  transitionDuration: 'fast',
})

/**
 * Opacity transition with slow duration
 * For more gradual effects
 */
export const opacityTransitionSlow = css({
  transitionProperty: '[opacity]',
  transitionDuration: 'slow',
})

/**
 * Color transition with base duration
 * Common for text color changes on hover
 */
export const colorTransition = css({
  transitionProperty: 'colors',
  transitionDuration: 'base',
})

/**
 * All properties transition with base duration
 * Use sparingly - specific transitions are more performant
 */
export const allTransition = css({
  transitionProperty: '[all]',
  transitionDuration: 'base',
})

/**
 * Opacity utilities with built-in hover states
 * Common patterns for interactive elements
 */

/**
 * Hidden state - very low opacity that increases on hover
 * Useful for secondary actions that should be discoverable
 */
export const opacityHidden = css({
  opacity: '20',
  transitionProperty: '[opacity]',
  transitionDuration: 'base',
  _hover: {
    opacity: '100',
  },
})

/**
 * Inactive state - reduced opacity that increases on hover
 * Common for filter buttons and toggles
 */
export const opacityInactive = css({
  opacity: '40',
  transitionProperty: '[opacity]',
  transitionDuration: 'base',
  _hover: {
    opacity: '100',
  },
})

/**
 * Dimmed state - very low opacity with no hover effect
 * For disabled or unavailable states
 */
export const opacityDimmed = css({
  opacity: '10',
})

/**
 * Medium opacity - 60% with no hover effect
 * For semi-prominent static elements
 */
export const opacity60 = css({
  opacity: '60',
})

/**
 * Medium opacity with hover - 60% → 100% on hover
 * For interactive elements that should be discoverable
 */
export const opacity60Hover = css({
  opacity: '60',
  transitionProperty: '[opacity]',
  transitionDuration: 'base',
  _hover: {
    opacity: '100',
  },
})

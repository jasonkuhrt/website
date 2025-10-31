/**
 * Shared flex variant definitions used across Row, Col, Box, and ItemBox components.
 * Extracted to avoid duplication (200+ lines saved).
 */

export const FLEX_ALIGN_VARIANTS = {
  start: { alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  end: { alignItems: 'flex-end' },
  stretch: { alignItems: 'stretch' },
  baseline: { alignItems: 'baseline' },
} as const

export const FLEX_JUSTIFY_VARIANTS = {
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
  around: { justifyContent: 'space-around' },
  evenly: { justifyContent: 'space-evenly' },
} as const

export const FLEX_WRAP_VARIANTS = {
  true: { flexWrap: 'wrap' },
  false: { flexWrap: 'nowrap' },
  reverse: { flexWrap: 'wrap-reverse' },
} as const

/**
 * Grid-Locked Design System Types
 *
 * Restricts component props to grid-aligned values only.
 * All measurements are multiples of 6px baseline unit.
 */

/**
 * ScaleKey represents valid baseline multiples
 * Each number = N × 6px when 1rem = 6px
 */
export type ScaleKey =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 10
  | 12
  | 14
  | 16
  | 20
  | 24
  | 128
  | 213
  | 267

/**
 * Spacing properties restricted to grid-aligned values
 */
export interface SpacingProps {
  gap?: ScaleKey
  padding?: ScaleKey
  paddingBlock?: ScaleKey
  paddingInline?: ScaleKey
  paddingTop?: ScaleKey
  paddingRight?: ScaleKey
  paddingBottom?: ScaleKey
  paddingLeft?: ScaleKey
  margin?: ScaleKey
  marginBlock?: ScaleKey
  marginInline?: ScaleKey
  marginTop?: ScaleKey
  marginRight?: ScaleKey
  marginBottom?: ScaleKey
  marginLeft?: ScaleKey
}

/**
 * Sizing properties restricted to grid-aligned values or semantic keywords
 */
export interface SizingProps {
  width?: ScaleKey | 'auto' | 'full' | 'half'
  height?: ScaleKey | 'auto'
  minWidth?: ScaleKey
  minHeight?: ScaleKey
  maxWidth?: ScaleKey
  maxHeight?: ScaleKey
}

/**
 * Flexbox layout properties
 */
export interface FlexLayoutProps {
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean | 'reverse'
}

/**
 * Border properties with automatic grid-locking compensation
 * Note: 1px and 2px borders will auto-adjust padding via calc()
 */
export interface BorderProps {
  border?: 0 | 1 | 2
  borderTop?: 0 | 1 | 2
  borderRight?: 0 | 1 | 2
  borderBottom?: 0 | 1 | 2
  borderLeft?: 0 | 1 | 2
}

/**
 * Base component properties
 */
export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

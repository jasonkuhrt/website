import { styled } from '#styled-system/jsx'
import { FLEX_ALIGN_VARIANTS, FLEX_JUSTIFY_VARIANTS, FLEX_WRAP_VARIANTS } from './variants'

/**
 * Flex Box - Flexible container with directional flow
 *
 * Primary flex container component with full control over direction.
 * Use Row/Col shortcuts for common cases.
 *
 * @example
 * <Box direction="column" align="center" gap="4">
 *   <Logo />
 *   <Nav />
 * </Box>
 */
export const Box = styled('div', {
  base: {
    display: 'flex',
  },
  variants: {
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
      rowReverse: { flexDirection: 'row-reverse' },
      columnReverse: { flexDirection: 'column-reverse' },
    },
    align: FLEX_ALIGN_VARIANTS,
    justify: FLEX_JUSTIFY_VARIANTS,
    wrap: FLEX_WRAP_VARIANTS,
  },
  defaultVariants: {
    direction: 'row',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
})

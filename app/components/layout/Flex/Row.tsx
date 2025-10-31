import { styled } from '../../../../styled-system/jsx'
import { FLEX_ALIGN_VARIANTS, FLEX_JUSTIFY_VARIANTS, FLEX_WRAP_VARIANTS } from './variants'

/**
 * Flex Row - Horizontal flex container
 *
 * Convenience component for flex containers with row direction.
 * For column direction, use Col. For dynamic direction, use Box.
 *
 * @example
 * <Row align="center" gap="2">
 *   <Icon />
 *   <Label />
 * </Row>
 */
export const Row = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'row',
  },
  variants: {
    align: FLEX_ALIGN_VARIANTS,
    justify: FLEX_JUSTIFY_VARIANTS,
    wrap: FLEX_WRAP_VARIANTS,
  },
  defaultVariants: {
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
})

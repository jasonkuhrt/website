import { styled } from '../../../../styled-system/jsx'
import { FLEX_ALIGN_VARIANTS, FLEX_JUSTIFY_VARIANTS, FLEX_WRAP_VARIANTS } from './variants'

/**
 * Flex Col - Vertical flex container
 *
 * Convenience component for flex containers with column direction.
 * For row direction, use Row. For dynamic direction, use Box.
 *
 * @example
 * <Col align="center" gap="4">
 *   <Header />
 *   <Content />
 *   <Footer />
 * </Col>
 */
export const Col = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
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

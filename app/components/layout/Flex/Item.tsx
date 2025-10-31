import { styled } from '#styled-system/jsx'

/**
 * Flex Item - Child element in a flex container
 *
 * Provides flex item-specific properties for controlling how this element
 * behaves within its flex container parent (Box, Row, or Col).
 *
 * @example
 * <Row>
 *   <Item grow>Grows to fill space</Item>
 *   <Item shrink={false}>Won't shrink</Item>
 * </Row>
 */
export const Item = styled('div', {
  variants: {
    grow: {
      true: { flexGrow: 1 },
      false: { flexGrow: 0 },
    },
    shrink: {
      true: { flexShrink: 1 },
      false: { flexShrink: 0 },
    },
    alignSelf: {
      auto: { alignSelf: 'auto' },
      start: { alignSelf: 'flex-start' },
      center: { alignSelf: 'center' },
      end: { alignSelf: 'flex-end' },
      stretch: { alignSelf: 'stretch' },
      baseline: { alignSelf: 'baseline' },
    },
  },
  defaultVariants: {
    grow: false,
    shrink: true,
  },
})

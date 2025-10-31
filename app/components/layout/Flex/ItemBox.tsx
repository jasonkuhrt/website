import { styled } from '#styled-system/jsx'
import { FLEX_ALIGN_VARIANTS, FLEX_JUSTIFY_VARIANTS, FLEX_WRAP_VARIANTS } from './variants'

/**
 * Flex ItemBox - Component that's both a flex container AND a flex item
 *
 * Combines Box (container) properties with Item properties. Use when
 * a component needs to lay out its own children AND control its behavior
 * within its parent's flex layout.
 *
 * @example
 * <Row>
 *   <ItemBox grow direction="column" align="center">
 *     <Icon />
 *     <Label />
 *   </ItemBox>
 * </Row>
 */
export const ItemBox = styled('div', {
  base: {
    display: 'flex',
  },
  variants: {
    // Container properties (from Box)
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
      rowReverse: { flexDirection: 'row-reverse' },
      columnReverse: { flexDirection: 'column-reverse' },
    },
    align: FLEX_ALIGN_VARIANTS,
    justify: FLEX_JUSTIFY_VARIANTS,
    wrap: FLEX_WRAP_VARIANTS,
    // Item properties (from Item)
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
    direction: 'row',
    align: 'stretch',
    justify: 'start',
    wrap: false,
    grow: false,
    shrink: true,
  },
})

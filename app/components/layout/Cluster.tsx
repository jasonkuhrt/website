import { styled } from '../../../styled-system/jsx'

/**
 * Cluster - Horizontal wrapping group
 *
 * A layout component for horizontal groups of items that wrap to multiple
 * lines when space runs out. Perfect for tags, filters, navigation links, and button groups.
 *
 * Based on the "Cluster" pattern from Every Layout by Heydon Pickering.
 *
 * @example
 * <Cluster gap="2" align="center">
 *   <Tag>React</Tag>
 *   <Tag>TypeScript</Tag>
 *   <Tag>Panda CSS</Tag>
 * </Cluster>
 */
export const Cluster = styled('div', {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  variants: {
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      baseline: { alignItems: 'baseline' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },
  },
  defaultVariants: {
    align: 'center',
    justify: 'start',
  },
})

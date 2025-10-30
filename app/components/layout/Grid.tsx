import React from 'react'
import { styled } from '../../../styled-system/jsx'

/**
 * Grid - Enhanced CSS Grid primitive
 *
 * A powerful grid layout component with support for CSS Grid Level 2 features
 * including subgrid (89% browser support). Replaces custom grid implementations.
 *
 * @example
 * // Auto-fit responsive grid
 * <Grid autoFit minColumnWidth="250px" gap="4">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 *
 * @example
 * // Fixed 3-column grid with subgrid support
 * <Grid columns={3} gap="8">
 *   <Card />
 * </Grid>
 */
const GridStyled = styled('div', {
  base: {
    display: 'grid',
  },
  variants: {
    columns: {
      1: { gridTemplateColumns: 'repeat(1, 1fr)' },
      2: { gridTemplateColumns: 'repeat(2, 1fr)' },
      3: { gridTemplateColumns: 'repeat(3, 1fr)' },
      4: { gridTemplateColumns: 'repeat(4, 1fr)' },
      6: { gridTemplateColumns: 'repeat(6, 1fr)' },
      12: { gridTemplateColumns: 'repeat(12, 1fr)' },
    },
    autoFlow: {
      row: { gridAutoFlow: 'row' },
      column: { gridAutoFlow: 'column' },
      dense: { gridAutoFlow: 'dense' },
      rowDense: { gridAutoFlow: 'row dense' },
      columnDense: { gridAutoFlow: 'column dense' },
    },
  },
  defaultVariants: {
    autoFlow: 'row',
  },
})

type GridProps = React.ComponentProps<typeof GridStyled> & {
  autoFit?: boolean
  minColumnWidth?: string
}

export const Grid: React.FC<GridProps> = ({ autoFit, minColumnWidth = '300px', style, ...props }) => {
  const autoFitStyle: React.CSSProperties | undefined = autoFit
    ? { gridTemplateColumns: `repeat(auto-fit, minmax(min(${minColumnWidth}, 100%), 1fr))` }
    : undefined

  return <GridStyled {...props} style={{ ...autoFitStyle, ...style } as any} />
}

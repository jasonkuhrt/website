import { css } from '#styled-system/css'

/**
 * Shared table styles for consistent table layouts.
 * Use these utilities in DataTable, TimelineTable, and other table components.
 */

// Table structure
export const tableWrapper = css({
  overflowX: 'auto',
})

export const table = css({
  width: 'full',
})

// Header styles
export const headerRow = css({
  borderBottom: '1px solid',
  borderColor: 'border.default',
})

export const headerCell = css({
  paddingBlock: '3',
  paddingInlineEnd: '4',
})

export const headerCellLeft = css({
  textAlign: 'left',
})

export const headerCellCenter = css({
  textAlign: 'center',
  paddingInline: '2',
})

export const headerCellRight = css({
  textAlign: 'right',
})

// Row styles
export const row = css({
  borderBottom: '1px solid',
  borderColor: 'border.subtle',
  transitionProperty: '[background-color]',
  transitionDuration: 'fast',
  '&:last-child': {
    borderBottom: '[0]',
  },
  _hover: {
    backgroundColor: 'bg.subtle',
  },
})

// Cell layouts
export const cellLayout = css({
  paddingBlock: '3',
  paddingInlineEnd: '4',
  verticalAlign: 'top',
})

export const cellCenter = css({
  paddingBlock: '3',
  paddingInline: '2',
  textAlign: 'center',
  verticalAlign: 'top',
})

export const cellRight = css({
  paddingBlock: '3',
  paddingInlineStart: '4',
  textAlign: 'right',
  verticalAlign: 'top',
})

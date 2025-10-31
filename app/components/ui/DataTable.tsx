import { Box } from '#styled-system/jsx'
import { Text, UI } from '../__'

interface Header {
  /**
   * Header label text
   */
  label: string
  /**
   * Text alignment for this column
   */
  align?: 'left' | 'center' | 'right'
  /**
   * Column key (must match keys in row data objects)
   */
  key: string
}

interface Props {
  /**
   * Table header configuration
   */
  headers: Header[]
  /**
   * Table row data. Each row is an object where keys match header keys
   * and values are React nodes to render in cells.
   */
  rows: Array<Record<string, React.ReactNode>>
  /**
   * Optional callback when a row is hovered
   */
  onRowHover?: (index: number) => void
}

/**
 * A styled data table component with headers, rows, and hover effects.
 * Supports left, center, and right alignment for columns.
 */
export const DataTable: React.FC<Props> = ({ headers, rows, onRowHover }) => {
  const getHeaderCellClass = ($align: Header['align']) => {
    switch ($align) {
      case 'center':
        return `${UI.tableStyles.headerCell} ${UI.tableStyles.headerCellCenter}`
      case 'right':
        return `${UI.tableStyles.headerCell} ${UI.tableStyles.headerCellRight}`
      default:
        return `${UI.tableStyles.headerCell} ${UI.tableStyles.headerCellLeft}`
    }
  }

  const getCellClass = ($align: Header['align']) => {
    switch ($align) {
      case 'center':
        return UI.tableStyles.cellCenter
      case 'right':
        return UI.tableStyles.cellRight
      default:
        return UI.tableStyles.cellLayout
    }
  }

  return (
    <div className={UI.tableStyles.tableWrapper}>
      <table className={UI.tableStyles.table}>
        <thead>
          <tr className={UI.tableStyles.headerRow}>
            {headers.map(($header) => (
              <th key={$header.key} className={getHeaderCellClass($header.align)}>
                <Text.Text fontSize='2' color='text.primary' fontWeight='semibold'>
                  {$header.label}
                </Text.Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(($row, $index) => (
            <tr
              key={$index}
              className={UI.tableStyles.row}
              onMouseEnter={() => onRowHover?.($index)}
            >
              {headers.map(($header) => (
                <td key={$header.key} className={getCellClass($header.align)}>
                  {$row[$header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

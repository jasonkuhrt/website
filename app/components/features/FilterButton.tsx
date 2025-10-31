import { css } from '#styled-system/css'
import { L, Text, UI } from '../__'

const buttonPadding = css({
  paddingInline: '2',
  paddingBlock: '1',
})

interface Props {
  /**
   * Icon element
   */
  icon: React.ReactNode
  /**
   * Button label text
   */
  label: string
  /**
   * Active state
   * @default true
   */
  active?: boolean
  /**
   * Click handler
   */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Filter button with icon and label.
 * Used for timeline filters and similar toggles.
 */
export const FilterButton: React.FC<Props> = ({ icon, label, active = true, onClick }) => {
  return (
    <UI.Button
      variant='ghost'
      className={buttonPadding}
      onClick={onClick}
    >
      <L.Flex.Row align='center' gap='2'>
        {icon}
        <Text.Text fontSize='2' opacity={active ? '100' : '40'}>{label}</Text.Text>
      </L.Flex.Row>
    </UI.Button>
  )
}

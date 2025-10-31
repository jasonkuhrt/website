import { SegmentGroup } from '@ark-ui/react/segment-group'
import { css } from '../../../styled-system/css'
import { UI } from '../__'

const toggleGroup = css({
  display: 'inline-flex',
  gap: '2',
})

const toggleItem = css({
  padding: '2',
  border: 'none',
  borderRadius: '1',
  cursor: 'pointer',
  transitionProperty: '[all]',
  transitionDuration: 'base',
  '&[data-state="on"]': {
    backgroundColor: 'bg.subtle',
    color: 'text.primary',
  },
  '&[data-state="off"]': {
    backgroundColor: '[transparent]',
    color: 'text.tertiary',
    _hover: {
      color: 'text.primary',
      backgroundColor: 'bg.surface',
    },
  },
})

interface Option {
  /**
   * React icon element to display
   */
  icon: React.ReactNode
  /**
   * Value to use when this option is selected
   */
  value: string
  /**
   * Title attribute for accessibility
   */
  title: string
}

interface Props {
  /**
   * Available view options
   */
  options: Option[]
  /**
   * Currently selected value
   */
  value: string
  /**
   * Callback when selection changes
   */
  onChange: ($value: string) => void
}

/**
 * A view mode toggle with icon buttons.
 * Used to switch between different display modes (timeline/table, grid/list, etc.).
 */
export const ViewToggle: React.FC<Props> = ({ options, value, onChange }) => {
  return (
    <SegmentGroup.Root
      value={value}
      onValueChange={(details) => {
        if (details.value) {
          onChange(details.value)
        }
      }}
      className={toggleGroup}
    >
      {options.map(($option) => (
        <SegmentGroup.Item
          key={$option.value}
          value={$option.value}
          className={toggleItem}
          title={$option.title}
        >
          <SegmentGroup.ItemText>
            <UI.Icon size='md'>{$option.icon}</UI.Icon>
          </SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  )
}

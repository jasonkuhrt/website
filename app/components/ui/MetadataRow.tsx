import { css } from '#styled-system/css'
import { L, Text, UI } from '../__'

const metadataDivider = css({
  marginInline: '2',
})

interface Props {
  /**
   * Label text (left side)
   */
  label: string
  /**
   * Value to display (right side) - can be ReactNode for links
   */
  value: React.ReactNode
}

/**
 * Metadata row component with dotted divider between label and value.
 * Commonly used in compact data lists.
 */
export const MetadataRow: React.FC<Props> = ({ label, value }) => {
  return (
    <L.Flex.Row align='center'>
      <Text.Text as='dt' fontSize='2' color='text.tertiary' flexShrink={0}>
        {label}
      </Text.Text>
      <L.Flex.Item grow className={`${metadataDivider} ${UI.dividers.dotted}`} />
      <Text.Text
        as='dd'
        fontSize='2'
        color='text.tertiary'
        flexShrink={0}
        textAlign='right'
        overflow='hidden'
        textOverflow='ellipsis'
      >
        {value}
      </Text.Text>
    </L.Flex.Row>
  )
}

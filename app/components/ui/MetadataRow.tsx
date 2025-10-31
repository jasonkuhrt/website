import { css } from '../../../styled-system/css'
import { L, T, UI } from '../__'

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
      <T.Text as='dt' fontSize='2' color='text.tertiary' flexShrink={0}>
        {label}
      </T.Text>
      <L.Flex.Item grow className={`${metadataDivider} ${UI.dividers.dotted}`} />
      <T.Text
        as='dd'
        fontSize='2'
        color='text.tertiary'
        flexShrink={0}
        textAlign='right'
        overflow='hidden'
        textOverflow='ellipsis'
      >
        {value}
      </T.Text>
    </L.Flex.Row>
  )
}

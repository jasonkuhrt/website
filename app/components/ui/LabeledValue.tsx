import { L } from '../__'

interface Props {
  /**
   * Label text
   */
  label: string
  /**
   * Value text
   */
  value: string
  /**
   * Use monospace font for value
   * @default false
   */
  mono?: boolean
  /**
   * Text size
   * @default 'xs'
   */
  size?: 'xs' | 'sm' | 'md'
}

/**
 * Label/value pair component.
 * Commonly used for displaying metadata like countdowns, stats, etc.
 */
export const LabeledValue: React.FC<Props> = ({ label: labelText, value, mono = false, size = 'xs' }) => {
  const fontSize = size === 'xs' ? '2' : size === 'sm' ? '2' : '4' // xs/sm: 12px, md: 24px

  return (
    <L.Flex.Row align='center' gap='2' fontSize={fontSize} color='text.tertiary'>
      <L.Box as='span' opacity='60'>{labelText}</L.Box>
      <L.Box as='span' fontFamily={mono ? 'mono' : undefined}>{value}</L.Box>
    </L.Flex.Row>
  )
}

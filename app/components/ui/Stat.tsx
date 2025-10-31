import { L, T, UI } from '../__'

interface Props {
  /**
   * Icon element to display
   */
  icon: React.ReactNode
  /**
   * Value to display (number or string)
   */
  value: string | number
  /**
   * Accessible label for the stat
   */
  label: string
  /**
   * Optional link URL
   */
  href?: string
}

/**
 * Stat component for displaying metrics with an icon and value.
 * Commonly used in cards to show stars, forks, followers, etc.
 */
export const Stat: React.FC<Props> = ({ icon, value, label, href }) => {
  const content = (
    <L.Flex.Row align='center' gap='1' title={label}>
      <L.Box width='icon.xs' height='icon.xs'>{icon}</L.Box>
      <T.Text fontSize='2'>{value}</T.Text>
    </L.Flex.Row>
  )

  if (href) {
    return (
      <UI.Link href={href} external>
        {content}
      </UI.Link>
    )
  }

  return content
}

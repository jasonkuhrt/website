import { L, UI } from '../__'

interface Props {
  /**
   * Icon element to display
   */
  icon: React.ReactNode
  /**
   * Content to display alongside the icon
   */
  children: React.ReactNode
  /**
   * Gap between icon and text
   * @default '1'
   */
  gap?: '1' | '2' | '3'
  /**
   * Icon size variant
   * @default 'xs'
   */
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Additional class name for the wrapper
   */
  className?: string
}

/**
 * Icon + Text combination component.
 * Common pattern for displaying an icon alongside text content.
 * Used for stats, labels, and inline decorators.
 */
export const IconText: React.FC<Props> = ({
  icon,
  children,
  gap = '1',
  iconSize = 'xs',
  className,
}) => {
  return (
    <L.Flex.Row align='center' gap={gap} className={className}>
      <UI.Icon size={iconSize}>{icon}</UI.Icon>
      {children}
    </L.Flex.Row>
  )
}

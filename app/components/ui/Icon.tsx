import { Box } from '../../../styled-system/jsx'

interface Props {
  /**
   * Icon element to display (typically from lucide-react)
   */
  children: React.ReactNode
  /**
   * Icon size
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Additional CSS class name
   */
  className?: string
}

/**
 * Standardized icon wrapper with consistent sizing.
 * Uses design system icon size tokens.
 */
export const Icon: React.FC<Props> = ({ children, size = 'md', className }) => {
  return (
    <Box
      width={`icon.${size}` as any}
      height={`icon.${size}` as any}
      className={className}
    >
      {children}
    </Box>
  )
}

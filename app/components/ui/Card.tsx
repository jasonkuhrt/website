import { css } from '../../../styled-system/css'

const cardBase = css({
  border: '1px solid',
  borderColor: 'border.default',
})

const cardRounded = css({
  borderRadius: '1',
})

const cardHoverable = css({
  transitionProperty: '[border-color]',
  transitionDuration: 'base',
  _hover: {
    borderColor: 'border.hover',
  },
})

interface Props {
  /**
   * Card content
   */
  children: React.ReactNode
  /**
   * Enable hover effect
   * @default false
   */
  hoverable?: boolean
  /**
   * Enable rounded corners
   * @default false
   */
  rounded?: boolean
  /**
   * Optional className for additional styles (use for padding, e.g., css({ padding: '4' }))
   */
  className?: string
  /**
   * Optional tab index for keyboard navigation
   */
  tabIndex?: number
}

/**
 * Card component with border and optional hover effect.
 * Base primitive for content containers.
 * Control padding via className with Panda CSS utilities.
 */
export const Card: React.FC<Props> = ({
  children,
  hoverable = false,
  rounded = false,
  className = '',
  tabIndex,
}) => {
  const roundedClass = rounded ? cardRounded : ''
  const hoverClass = hoverable ? cardHoverable : ''

  return (
    <div
      className={`${cardBase} ${roundedClass} ${hoverClass} ${className}`}
      tabIndex={tabIndex}
    >
      {children}
    </div>
  )
}

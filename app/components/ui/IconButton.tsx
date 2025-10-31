import { cx, css } from '../../../styled-system/css'
import * as transitions from './transitions'

const buttonBase = css({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const buttonSizeSm = css({
  width: '1', // 6px (1 baseline)
  height: '1',
})

const buttonSizeMd = css({
  width: '2', // 12px (2 baselines)
  height: '2',
})

const buttonSizeLg = css({
  width: '4', // 24px (4 baselines)
  height: '4',
})

const SIZE_CLASSES = {
  sm: buttonSizeSm,
  md: buttonSizeMd,
  lg: buttonSizeLg,
} as const

const variantDefault = css({
  opacity: '[1]',
})

const VARIANT_CLASSES = {
  default: variantDefault,
  hidden: transitions.opacityHidden,
  dimmed: transitions.opacityDimmed,
} as const

interface Props {
  /**
   * Icon element to display
   */
  icon: React.ReactNode
  /**
   * Accessible label
   */
  label: string
  /**
   * Click handler (creates button)
   */
  onClick?: () => void
  /**
   * Link URL (creates anchor)
   */
  href?: string
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: 'default' | 'hidden' | 'dimmed'
  /**
   * Icon size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Icon button component with multiple variants and sizes.
 * Can render as button or link.
 */
export const IconButton: React.FC<Props> = ({
  icon,
  label,
  onClick,
  href,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClass = SIZE_CLASSES[size]
  const variantClass = VARIANT_CLASSES[variant]

  const combinedClass = cx(buttonBase, sizeClass, variantClass, className)

  if (href) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={label}
        className={combinedClass}
      >
        {icon}
      </a>
    )
  }

  return (
    <button type='button' onClick={onClick} aria-label={label} className={combinedClass}>
      {icon}
    </button>
  )
}

import styles from './Container.module.css'

/**
 * Container component - provides consistent width constraints and padding
 *
 * Variants:
 * - content: 768px max-width, for text-heavy content (default)
 * - standard: 1280px max-width, for general layouts
 * - wide: 1600px max-width, for wide content like photo galleries
 * - full: Full viewport width, breaks out of parent constraints
 */
export function Container({
  variant = 'content',
  className,
  children,
}: {
  variant?: 'content' | 'standard' | 'wide' | 'full'
  className?: string
  children?: React.ReactNode
}) {
  return <div className={`${styles[variant]} ${className || ''}`}>{children}</div>
}

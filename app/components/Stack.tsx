import styles from './Stack.module.css'

/**
 * Stack component - vertical layout with consistent spacing
 *
 * Uses CSS gap for spacing between children
 */
export function Stack({
  spacing = 'base',
  className,
  children,
}: {
  spacing?: 'sm' | 'base' | 'lg' | 'xl'
  className?: string
  children?: React.ReactNode
}) {
  const spacingMap = {
    sm: 'var(--spacing-base-2)',
    base: 'var(--spacing-base-4)',
    lg: 'var(--spacing-base-6)',
    xl: 'var(--spacing-base-8)',
  }

  return (
    <div
      className={`${styles.stack} ${className || ''}`}
      style={{
        '--stack-gap': spacingMap[spacing],
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

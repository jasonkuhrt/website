import styles from './Grid.module.css'

/**
 * Grid component - responsive fluid grid layout
 *
 * Uses CSS auto-fit to create a fluid grid that automatically adjusts
 * the number of columns based on available space.
 */
export function Grid({
  minWidth = '300px',
  gap = 'base',
  className,
  children,
}: {
  minWidth?: string
  gap?: 'sm' | 'base' | 'lg'
  className?: string
  children?: React.ReactNode
}) {
  const gapMap = {
    sm: 'var(--spacing-base-2)',
    base: 'var(--spacing-base-4)',
    lg: 'var(--spacing-base-6)',
  }

  return (
    <div
      className={`${styles.grid} ${className || ''}`}
      style={{
        '--grid-min-width': minWidth,
        '--grid-gap': gapMap[gap],
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

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
    sm: 'var(--spacing-2)',
    base: 'var(--spacing-4)',
    lg: 'var(--spacing-6)',
  }

  return (
    <div
      className={`grid ${className || ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minWidth}, 100%), 1fr))`,
        gap: gapMap[gap],
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

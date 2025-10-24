/**
 * Grid component - responsive grid layout
 *
 * Columns are responsive:
 * - 1 column on mobile
 * - 2 columns on tablet (md)
 * - 3 columns on desktop (lg)
 */
export function Grid({
  cols = { sm: 1, md: 2, lg: 3 },
  gap = 'base',
  className,
  children,
}: {
  cols?: { sm?: number; md?: number; lg?: number } | number
  gap?: 'sm' | 'base' | 'lg'
  className?: string
  children?: React.ReactNode
}) {
  const gapMap = {
    sm: 'var(--spacing-2)',
    base: 'var(--spacing-4)',
    lg: 'var(--spacing-6)',
  }

  const colsObj = typeof cols === 'number' ? { sm: cols, md: cols, lg: cols } : cols

  return (
    <div
      className={`grid ${className || ''}`}
      style={{
        '--grid-gap': gapMap[gap],
        '--cols-sm': colsObj.sm || 1,
        '--cols-md': colsObj.md || 2,
        '--cols-lg': colsObj.lg || 3,
        display: 'grid',
        gridTemplateColumns: 'repeat(var(--cols-sm), 1fr)',
        gap: 'var(--grid-gap)',
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

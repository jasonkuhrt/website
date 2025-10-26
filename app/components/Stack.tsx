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
    sm: 'var(--spacing-2)',
    base: 'var(--spacing-4)',
    lg: 'var(--spacing-6)',
    xl: 'var(--spacing-8)',
  }

  return (
    <div
      className={`stack ${className || ''}`}
      style={{
        '--stack-gap': spacingMap[spacing],
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--stack-gap)',
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

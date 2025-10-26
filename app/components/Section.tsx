export function Section({
  spacing = 'base',
  className,
  children,
}: {
  spacing?: 'sm' | 'base' | 'lg' | 'xl'
  className?: string
  children?: React.ReactNode
}) {
  const spacingClasses = {
    sm: 'py-8',
    base: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  }

  return <section className={`${spacingClasses[spacing]} ${className || ''}`}>{children}</section>
}

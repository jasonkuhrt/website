import styles from './Section.module.css'

export function Section({
  spacing = 'base',
  className,
  children,
}: {
  spacing?: 'sm' | 'base' | 'lg' | 'xl'
  className?: string
  children?: React.ReactNode
}) {
  return <section className={`${styles[spacing]} ${className || ''}`}>{children}</section>
}

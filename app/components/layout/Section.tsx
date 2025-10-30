import { cva } from '../../../styled-system/css'

const section = cva({
  variants: {
    spacing: {
      sm: { paddingBlock: '8' },
      base: { paddingBlock: '12' },
      lg: { paddingBlock: '16' },
      xl: { paddingBlock: '24' },
    },
  },
  defaultVariants: {
    spacing: 'base',
  },
})

export function Section({
  spacing = 'base',
  className,
  children,
}: {
  spacing?: 'sm' | 'base' | 'lg' | 'xl'
  className?: string
  children?: React.ReactNode
}) {
  return <section className={section({ spacing }) + (className ? ` ${className}` : '')}>{children}</section>
}

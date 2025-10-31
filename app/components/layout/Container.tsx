import { cva, cx } from '../../../styled-system/css'

/**
 * Container component - provides consistent width constraints and padding
 *
 * Variants:
 * - content: 768px max-width, for text-heavy content (default)
 * - standard: 1280px max-width, for general layouts
 * - wide: 1600px max-width, for wide content like photo galleries
 * - full: Full viewport width, breaks out of parent constraints
 */
const container = cva({
  base: {
    marginInline: '[auto]',
  },
  variants: {
    variant: {
      content: {
        maxWidth: '[128rem]', // 768px (128 baselines)
        paddingInline: '4', // 24px (4 baselines)
      },
      standard: {
        maxWidth: '[213rem]', // 1278px (213 baselines)
        paddingInline: '6', // 36px (6 baselines)
      },
      wide: {
        maxWidth: '[267rem]', // 1602px (267 baselines)
        paddingInline: '8', // 48px (8 baselines)
      },
      full: {
        width: '[100%]',
      },
    },
  },
  defaultVariants: {
    variant: 'content',
  },
})

export function Container({
  variant = 'content',
  className,
  children,
}: {
  variant?: 'content' | 'standard' | 'wide' | 'full'
  className?: string
  children?: React.ReactNode
}) {
  return <div className={cx(container({ variant }), className)}>{children}</div>
}

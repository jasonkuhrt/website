import { cva, cx } from '../../../styled-system/css'
import { token } from '../../../styled-system/tokens'

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
    marginInline: 'auto',
  },
  variants: {
    variant: {
      content: {
        maxWidth: token('sizes.container.content'),
        paddingInline: token('spacing.4'),
      },
      standard: {
        maxWidth: token('sizes.container.standard'),
        paddingInline: token('spacing.6'),
      },
      wide: {
        maxWidth: token('sizes.container.wide'),
        paddingInline: token('spacing.8'),
      },
      full: {
        width: '100%',
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

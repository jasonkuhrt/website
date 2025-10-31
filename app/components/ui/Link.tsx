import { cva } from '../../../styled-system/css'

const link = cva({
  base: {
    textDecoration: 'none',
    transitionProperty: 'colors',
    transitionDuration: 'base',
  },
  variants: {
    variant: {
      default: {
        color: 'text.secondary',
        _hover: {
          color: 'text.primary',
        },
      },
      accent: {
        color: 'text.tertiary',
        _hover: {
          color: 'accent.default',
        },
      },
      subtle: {
        color: 'text.tertiary',
        _hover: {
          color: 'text.secondary',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Link destination
   */
  href: string
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: 'default' | 'accent' | 'subtle'
  /**
   * Link content
   */
  children: React.ReactNode
  /**
   * Additional class name
   */
  className?: string
  /**
   * Whether this is an external link (auto-adds target and rel attributes)
   * @default false
   */
  external?: boolean
}

/**
 * Base link component with consistent styling and variants.
 * Automatically handles external link attributes when external prop is true.
 */
export const Link: React.FC<Props> = ({
  href,
  variant = 'default',
  children,
  className = '',
  external = false,
  ...props
}) => {
  const combinedClassName = className ? `${link({ variant })} ${className}` : link({ variant })

  const externalProps = external ?
    {
      target: '_blank' as const,
      rel: 'noopener noreferrer',
    } :
    {}

  return (
    <a href={href} className={combinedClassName} {...externalProps} {...props}>
      {children}
    </a>
  )
}

import { cva } from '../../../styled-system/css'

const button = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1',
    transitionProperty: '[all]',
    transitionDuration: 'base',
    cursor: 'pointer',
    border: '[none]',
    fontFamily: '[inherit]',
    fontSize: '[inherit]',
  },
  variants: {
    variant: {
      ghost: {
        backgroundColor: '[transparent]',
        color: 'text.secondary',
        _hover: {
          backgroundColor: 'bg.subtle',
          color: 'text.primary',
        },
      },
      subtle: {
        backgroundColor: 'bg.subtle',
        color: 'text.primary',
        _hover: {
          backgroundColor: 'bg.hover',
        },
      },
      primary: {
        backgroundColor: 'accent.default',
        color: '[white]',
        _hover: {
          backgroundColor: 'accent.dark',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'ghost',
  },
})

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant
   * @default 'ghost'
   */
  variant?: 'ghost' | 'subtle' | 'primary'
  /**
   * Button content
   */
  children: React.ReactNode
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Base button component with consistent styling and variants.
 * Use this for all button elements to maintain design system consistency.
 * Control padding via className with Panda CSS utilities (e.g., className={css({ padding: '2' })}).
 */
export const Button: React.FC<Props> = ({
  variant = 'ghost',
  children,
  className = '',
  ...props
}) => {
  const combinedClassName = className ? `${button({ variant })} ${className}` : button({ variant })

  return (
    <button type='button' className={combinedClassName} {...props}>
      {children}
    </button>
  )
}

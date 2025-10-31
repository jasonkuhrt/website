import { Link as RouterLink, useLocation } from 'react-router'
import { cva, cx } from '#styled-system/css'

/**
 * Shared link variant styles used by both Link.Nav and Link.Ext
 */
const linkVariants = cva({
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
      active: {
        fontWeight: 'bold',
        opacity: '[100]',
        cursor: 'default',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/**
 * Link.Nav - Internal Navigation Link
 *
 * Uses React Router's Link component for client-side navigation.
 *
 * Features:
 * - Active state detection (renders as aria-disabled when on current page)
 * - viewTransition support (enabled by default)
 * - Prefetching and optimistic UI
 * - Automatic active styling
 */

interface NavProps {
  /**
   * Internal route path
   */
  href: string
  /**
   * Link content
   */
  children: React.ReactNode
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: 'default' | 'accent' | 'subtle'
  /**
   * Additional class name
   */
  className?: string
  /**
   * Enable view transitions
   * @default true
   */
  viewTransition?: boolean
}

const Nav: React.FC<NavProps> = ({
  href,
  children,
  variant = 'default',
  className,
  viewTransition = true,
}) => {
  const location = useLocation()
  const isActive = location.pathname === href

  const linkClassName = cx(
    linkVariants({ variant: isActive ? 'active' : variant }),
    className,
  )

  if (isActive) {
    return (
      <a
        href={href}
        aria-disabled='true'
        aria-current='page'
        className={linkClassName}
        onClick={(e) => e.preventDefault()}
      >
        {children}
      </a>
    )
  }

  return (
    <RouterLink to={href} viewTransition={viewTransition} className={linkClassName}>
      {children}
    </RouterLink>
  )
}

/**
 * Link.Ext - External Link
 *
 * Standard anchor tag for external URLs.
 *
 * Features:
 * - Auto-applies target="_blank" and rel="noopener noreferrer"
 * - Inherits variant styles
 * - Supports all standard anchor attributes
 */

interface ExtProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * External URL
   */
  href: string
  /**
   * Link content
   */
  children: React.ReactNode
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: 'default' | 'accent' | 'subtle'
  /**
   * Additional class name
   */
  className?: string
}

const Ext: React.FC<ExtProps> = ({
  href,
  children,
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={cx(linkVariants({ variant }), className)}
      {...props}
    >
      {children}
    </a>
  )
}

/**
 * Link namespace with specialized link components:
 * - Link.Nav: Internal navigation with React Router
 * - Link.Ext: External links with security attributes
 */
export const Link = {
  Nav,
  Ext,
}

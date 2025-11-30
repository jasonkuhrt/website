'use client'

import type { ComponentProps } from 'react'
import { Link, useRouter } from 'waku'

type LinkProps = ComponentProps<typeof Link>

interface NavProps {
  /**
   * Type-safe route path
   */
  to: LinkProps['to']
  /**
   * Link content
   */
  children: React.ReactNode
}

export const In: React.FC<NavProps> = ({ to, children }) => {
  const router = useRouter()
  const isActive = router.path === to

  if (isActive) {
    return (
      <Link
        to={to}
        aria-disabled='true'
        aria-current='page'
        style={{ pointerEvents: 'none' }}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link to={to}>
      {children}
    </Link>
  )
}

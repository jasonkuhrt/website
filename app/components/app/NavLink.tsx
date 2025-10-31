import { NavLink as RouterNavLink } from 'react-router'
import { cva } from '../../../styled-system/css'
import { UI } from '../__'

const navLink = cva({
  base: {
    fontSize: '2', // 12px (2 baselines)
    _hover: {
      opacity: '[100]',
    },
  },
  variants: {
    active: {
      true: {
        fontWeight: 'bold',
        opacity: '[100]',
      },
      false: {
        opacity: '[50]',
      },
    },
  },
})

export function NavLink({
  href,
  text,
}: {
  href: string
  text?: string
}) {
  const linkText = text ?? href.replace(/^\//, '').replace(/\/$/, '')

  return (
    <RouterNavLink
      to={href}
      viewTransition
      className={({ isActive }) => `${UI.transitions.opacityTransition} ${navLink({ active: isActive })}`}
    >
      {linkText}
    </RouterNavLink>
  )
}

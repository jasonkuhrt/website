import { NavLink as RouterNavLink } from 'react-router'
import { cva } from '../../../styled-system/css'

const navLink = cva({
  base: {
    fontSize: 'xs',
    transition: 'opacity {durations.base}',
    _hover: {
      opacity: 1,
    },
  },
  variants: {
    active: {
      true: {
        fontWeight: 'bold',
        opacity: 1,
      },
      false: {
        opacity: 0.5,
      },
    },
  },
})

export function NavLink({
  href,
  text,
  activePath,
}: {
  href: string
  text?: string
  activePath?: RegExp
}) {
  const linkText = text ?? href.replace(/^\//, '').replace(/\/$/, '')

  return (
    <RouterNavLink
      to={href}
      viewTransition
      className={({ isActive }) => navLink({ active: isActive })}
    >
      {linkText}
    </RouterNavLink>
  )
}

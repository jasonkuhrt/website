import { NavLink as RouterNavLink } from 'react-router'

export function NavLink({
  href,
  text,
  activePath
}: {
  href: string
  text?: string
  activePath?: RegExp
}) {
  const linkText = text ?? href.replace(/^\//, '').replace(/\/$/, '')

  return (
    <RouterNavLink
      to={href}
      className={({ isActive }) =>
        `text-xs ${isActive ? 'font-bold' : 'opacity-50'} hover:opacity-100`
      }
      style={({ isActive }) => ({
        marginLeft: '0.75rem',
      })}
    >
      {linkText}
    </RouterNavLink>
  )
}

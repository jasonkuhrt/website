import { NavLink as RouterNavLink } from 'react-router'
import styles from './NavLink.module.css'

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
      className={({ isActive }) =>
        `${styles.link} ${isActive ? styles.active : styles.inactive}`}
    >
      {linkText}
    </RouterNavLink>
  )
}

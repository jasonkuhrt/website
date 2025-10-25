import { useLocation } from 'react-router'
import { Logo } from './Logo'
import { NavLink } from './NavLink'
import styles from './Header.module.css'

export function Header() {
  const location = useLocation()
  const isHomepage = location.pathname === '/'

  return (
    <header className={styles.header}>
      {isHomepage ?
        (
          <div className={styles.logoContainer}>
            <Logo width={40} height={40} />
          </div>
        ) :
        (
          <a className={styles.logoContainer} href='/'>
            <Logo width={40} height={40} />
          </a>
        )}
      <nav className={styles.nav}>
        <NavLink href='/crafting' />
        <NavLink href='/writing' />
        <NavLink href='/capturing' />
        <NavLink href='/designing' />
        <NavLink href='/speaking' />
        <NavLink href='/bio' />
      </nav>
    </header>
  )
}

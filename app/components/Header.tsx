import { NavLink } from './NavLink'
import { Logo } from './Logo'

export function Header() {
  return (
    <header className="flex flex-col items-center mt-12">
      <a className="opacity-100 hover:opacity-80 active:opacity-40" href="/">
        <Logo width={40} height={40} />
      </a>
      <nav className="mt-2">
        <NavLink href="/writing" />
        <NavLink href="/speaking" />
        <NavLink href="/coding" />
        <NavLink href="/photographing" />
        <NavLink href="/drawing" />
        <NavLink href="/bio" />
      </nav>
    </header>
  )
}

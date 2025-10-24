import { useLocation } from 'react-router'
import { Logo } from './Logo'
import { NavLink } from './NavLink'

export function Header() {
  const location = useLocation()
  const isHomepage = location.pathname === '/'

  return (
    <header className='flex flex-col items-center mt-12'>
      {isHomepage ? (
        <div className='opacity-100 hover:opacity-80 active:opacity-40'>
          <Logo width={40} height={40} />
        </div>
      ) : (
        <a className='opacity-100 hover:opacity-80 active:opacity-40' href='/'>
          <Logo width={40} height={40} />
        </a>
      )}
      <nav className='mt-2'>
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

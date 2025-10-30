import { useLocation } from 'react-router'
import { css } from '../../../styled-system/css'
import { L } from '../__'
import { Logo } from './Logo'
import { NavLink } from './NavLink'

const logoContainer = css({
  opacity: 1,
  transition: 'opacity {durations.base}',
  _hover: {
    opacity: 0.8,
  },
  _active: {
    opacity: 0.4,
  },
})

export function Header() {
  const location = useLocation()
  const isHomepage = location.pathname === '/'

  return (
    <L.Flex direction='column' align='center' gap={2} marginTop='12'>
      {isHomepage ?
        (
          <div className={logoContainer}>
            <Logo width={40} height={40} />
          </div>
        ) :
        (
          <a className={logoContainer} href='/'>
            <Logo width={40} height={40} />
          </a>
        )}
      <L.Cluster gap={3}>
        <NavLink href='/crafting' />
        <NavLink href='/writing' />
        {/* <NavLink href='/capturing' /> */}
        {/* <NavLink href='/designing' /> */}
        <NavLink href='/speaking' />
        <NavLink href='/bio' />
      </L.Cluster>
    </L.Flex>
  )
}

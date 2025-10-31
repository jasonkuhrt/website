import { useLocation } from 'react-router'
import { css } from '../../../styled-system/css'
import { L, UI } from '../__'
import { Logo } from './Logo'
import { NavLink } from './NavLink'

const logoContainer = css({
  opacity: '[100]',
  _hover: {
    opacity: '[80]',
  },
  _active: {
    opacity: '[40]',
  },
})

export function Header() {
  const location = useLocation()
  const isHomepage = location.pathname === '/'

  return (
    <L.Flex.Col align='center' gap='2' marginTop='12'>
      {isHomepage ?
        (
          <div className={`${UI.transitions.opacityTransition} ${logoContainer}`}>
            <Logo width={40} height={40} />
          </div>
        ) :
        (
          <a className={`${UI.transitions.opacityTransition} ${logoContainer}`} href='/'>
            <Logo width={40} height={40} />
          </a>
        )}
      <L.Cluster gap='3'>
        <NavLink href='/crafting' />
        <NavLink href='/writing' />
        {/* <NavLink href='/capturing' /> */}
        {/* <NavLink href='/designing' /> */}
        <NavLink href='/speaking' />
        <NavLink href='/bio' />
      </L.Cluster>
    </L.Flex.Col>
  )
}

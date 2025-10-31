import type { JsxStyleProps } from '#styled-system/types'
import { L, UI } from '../__'
import { Flex } from '../layout/__'
import { Logo } from './Logo'

interface Props extends JsxStyleProps {}

export const Header: React.FC<Props> = (props) => {
  return (
    <Flex.Col align='center' gap='12' {...props}>
      <UI.Link.Nav href='/'>
        <Logo scale='7' />
      </UI.Link.Nav>
      <L.Cluster gap='3'>
        {/*<UI.Link.Nav href='/crafting'>crafting</UI.Link.Nav>*/}
        <UI.Link.Nav href='/writing'>writing</UI.Link.Nav>
        {/* <UI.Link.Nav href='/capturing'>capturing</UI.Link.Nav> */}
        {/* <UI.Link.Nav href='/designing'>designing</UI.Link.Nav> */}
        {/*<UI.Link.Nav href='/speaking'>speaking</UI.Link.Nav>*/}
        {/*<UI.Link.Nav href='/bio'>bio</UI.Link.Nav>*/}
      </L.Cluster>
    </Flex.Col>
  )
}

import { Code, Star, Users } from 'lucide-react'
import { css } from '../../../styled-system/css'
import { L, T, UI } from '../__'

const card = css({
  height: '[100%]',
  border: '[1px solid]',
  borderColor: 'border.default',
  borderRadius: '1',
  padding: '6',
  background: 'bg.primary',
  transitionProperty: '[border-color]',
  transitionDuration: 'base',
  _hover: {
    borderColor: 'border.hover',
    '& .github-username': {
      color: 'accent.default',
    },
  },
})

const header = css({
  marginBottom: '5',
})

const statIcon = css({
  width: 'icon.xs',
  height: 'icon.xs',
})

export const GitHubProfileCard: React.FC = () => {
  return (
    <L.Flex.Col className={card}>
      {/* Header with avatar and username - clickable to profile */}
      <UI.Link
        href='https://github.com/jasonkuhrt'
        external
        className={header}
      >
        <L.Flex.Row align='center' gap='3'>
          <UI.Avatar
            src='https://github.com/jasonkuhrt.png'
            alt='Jason Kuhrt'
            size='md'
          />
          <L.Flex.Col>
            <T.H3 textStyle='heading.3' className='github-username'>
              @jasonkuhrt
            </T.H3>
            <T.Text textStyle='label' color='text.secondary'>
              View GitHub Profile →
            </T.Text>
          </L.Flex.Col>
        </L.Flex.Row>
      </UI.Link>

      {/* Bio */}
      <T.P textStyle='body.base' color='text.secondary' marginBottom='5' flexGrow='1'>
        Software engineer passionate about developer experience, type safety, and open source. Building tools for the
        GraphQL and TypeScript communities.
      </T.P>

      {/* Quick stats */}
      <L.Flex.Row justify='start' gap='4' paddingTop='4'>
        <UI.Link href='https://github.com/jasonkuhrt?tab=repositories' external>
          <L.Flex.Row align='center' gap='1'>
            <Code className={statIcon} />
            <T.Text textStyle='caption' _hover={{ color: 'accent.default' }}>
              Repositories
            </T.Text>
          </L.Flex.Row>
        </UI.Link>
        <UI.Link href='https://github.com/jasonkuhrt?tab=stars' external>
          <L.Flex.Row align='center' gap='1'>
            <Star className={statIcon} />
            <T.Text textStyle='caption' _hover={{ color: 'accent.default' }}>
              Stars
            </T.Text>
          </L.Flex.Row>
        </UI.Link>
        <UI.Link href='https://github.com/jasonkuhrt?tab=followers' external>
          <L.Flex.Row align='center' gap='1'>
            <Users className={statIcon} />
            <T.Text textStyle='caption' _hover={{ color: 'accent.default' }}>
              Followers
            </T.Text>
          </L.Flex.Row>
        </UI.Link>
      </L.Flex.Row>
    </L.Flex.Col>
  )
}

import { css } from '#styled-system/css'
import { Code, Star, Users } from 'lucide-react'
import { L, Text, UI } from '../__'

const statIcon = css({
  width: 'icon.xs',
  height: 'icon.xs',
})

export const GitHubProfileCard: React.FC = () => {
  return (
    <L.Flex.Col
      className={css({
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
      })}
    >
      {/* Header with avatar and username - clickable to profile */}
      <UI.Link.Ext
        href='https://github.com/jasonkuhrt'
        className={css({ marginBottom: '5' })}
      >
        <L.Flex.Row align='center' gap='3'>
          <UI.Avatar
            src='https://github.com/jasonkuhrt.png'
            alt='Jason Kuhrt'
            scale='4'
          />
          <L.Flex.Col>
            <Text.H3 textStyle='heading.3' className='github-username'>
              @jasonkuhrt
            </Text.H3>
            <Text.Text textStyle='label' color='text.secondary'>
              View GitHub Profile →
            </Text.Text>
          </L.Flex.Col>
        </L.Flex.Row>
      </UI.Link.Ext>

      {/* Bio */}
      <Text.P textStyle='body.base' color='text.secondary' marginBottom='5' flexGrow='1'>
        Software engineer passionate about developer experience, type safety, and open source. Building tools for the
        GraphQL and TypeScript communities.
      </Text.P>

      {/* Quick stats */}
      <L.Flex.Row justify='start' gap='4' paddingTop='4'>
        <UI.Link.Ext href='https://github.com/jasonkuhrt?tab=repositories'>
          <L.Flex.Row align='center' gap='1'>
            <Code className={statIcon} />
            <Text.Text textStyle='caption' _hover={{ color: 'accent.default' }}>
              Repositories
            </Text.Text>
          </L.Flex.Row>
        </UI.Link.Ext>
        <UI.Link.Ext href='https://github.com/jasonkuhrt?tab=stars'>
          <L.Flex.Row align='center' gap='1'>
            <Star className={statIcon} />
            <Text.Text textStyle='caption' _hover={{ color: 'accent.default' }}>
              Stars
            </Text.Text>
          </L.Flex.Row>
        </UI.Link.Ext>
        <UI.Link.Ext href='https://github.com/jasonkuhrt?tab=followers'>
          <L.Flex.Row align='center' gap='1'>
            <Users className={statIcon} />
            <Text.Text textStyle='caption' _hover={{ color: 'accent.default' }}>
              Followers
            </Text.Text>
          </L.Flex.Row>
        </UI.Link.Ext>
      </L.Flex.Row>
    </L.Flex.Col>
  )
}

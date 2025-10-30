import { Code, Star, Users } from 'lucide-react'
import { css } from '../../../styled-system/css'
import { token } from '../../../styled-system/tokens'

const card = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  border: '1px solid',
  borderColor: 'border.default',
  borderRadius: 'radii.base',
  padding: '6',
  background: token('colors.bg.primary'),
  transition: 'border-color {durations.base}',
  _hover: {
    borderColor: 'border.hover',
    '& .github-username': {
      color: 'accent.default',
    },
  },
})

const header = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  marginBottom: '5',
})

const avatar = css({
  width: '3rem',
  height: '3rem',
  borderRadius: '50%',
})

const userInfo = css({
  display: 'flex',
  flexDirection: 'column',
})

const username = css({
  textStyle: 'heading.3',
  transition: 'color {durations.base}',
})

const profileLink = css({
  textStyle: 'label',
  color: 'text.secondary',
})

const bio = css({
  textStyle: 'body.base',
  color: 'text.secondary',
  marginBottom: '5',
  flexGrow: 1,
})

const stats = css({
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '4',
  textStyle: 'caption',
  paddingTop: '4',
})

const statLink = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1',
  transition: 'color {durations.base}',
  _hover: {
    color: 'accent.default',
  },
})

const statIcon = css({
  width: '1rem',
  height: '1rem',
})

export const GitHubProfileCard: React.FC = () => {
  return (
    <div className={card}>
      {/* Header with avatar and username - clickable to profile */}
      <a
        href='https://github.com/jasonkuhrt'
        target='_blank'
        rel='noopener noreferrer'
        className={header}
      >
        <img
          src='https://github.com/jasonkuhrt.png'
          alt='Jason Kuhrt'
          className={avatar}
        />
        <div className={userInfo}>
          <h3 className={`${username} github-username`}>
            @jasonkuhrt
          </h3>
          <p className={profileLink}>
            View GitHub Profile →
          </p>
        </div>
      </a>

      {/* Bio */}
      <p className={bio}>
        Software engineer passionate about developer experience, type safety, and open source. Building tools for the
        GraphQL and TypeScript communities.
      </p>

      {/* Quick stats */}
      <div className={stats}>
        <a
          href='https://github.com/jasonkuhrt?tab=repositories'
          target='_blank'
          rel='noopener noreferrer'
          className={statLink}
        >
          <Code className={statIcon} />
          <span>Repositories</span>
        </a>
        <a
          href='https://github.com/jasonkuhrt?tab=stars'
          target='_blank'
          rel='noopener noreferrer'
          className={statLink}
        >
          <Star className={statIcon} />
          <span>Stars</span>
        </a>
        <a
          href='https://github.com/jasonkuhrt?tab=followers'
          target='_blank'
          rel='noopener noreferrer'
          className={statLink}
        >
          <Users className={statIcon} />
          <span>Followers</span>
        </a>
      </div>
    </div>
  )
}

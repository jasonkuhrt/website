import { MapPin } from 'lucide-react'
import { css } from '../../styled-system/css'
import { token } from '../../styled-system/tokens'
import { L, F, T } from '../components/__'
import type { Route } from './+types/home'

const avatar = css({
  borderRadius: token('radii.full'),
  overflow: 'hidden',
  width: '8rem',
  height: '8rem',
  marginBottom: token('spacing.8'),
  border: '1px solid',
  borderColor: 'border.subtle',
})

const avatarImage = css({
  objectFit: 'cover',
})

const bio = css({
  fontSize: 'lg',
  lineHeight: 'lg',
  fontFamily: 'serif',
  textAlign: 'center',
  maxWidth: '42rem',
  marginBottom: token('spacing.8'),
  color: 'text.secondary',
})

const location = css({
  display: 'flex',
  alignItems: 'center',
  gap: token('spacing.2'),
  color: 'text.tertiary',
  marginBottom: token('spacing.8'),
})

const locationIcon = css({
  width: '1rem',
  height: '1rem',
})

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Jason Kuhrt' },
    { name: 'description', content: 'Personal website of Jason Kuhrt' },
  ]
}

export default function Home() {
  return (
    <L.Section spacing='xl'>
      <L.Cover minHeight='60vh'>
        {/* Avatar */}
        <div className={avatar}>
          <img
            src='/images/avatar2@1x.jpg'
            alt='Jason Kuhrt'
            width='128'
            height='128'
            className={avatarImage}
          />
        </div>

        {/* Name */}
        <T.DisplayHero marginBottom='6'>
          Jason Kuhrt
        </T.DisplayHero>

        {/* Bio */}
        <p className={bio}>
          Shapeshifting Polymath ≒ Art ∙ Design ∙ Engineering. Heart humanities. In alternate universes ⊻ Coureur de
          Bois, Architect, Athlete, Lego Master Builder.
        </p>

        {/* Location */}
        <div className={location}>
          <MapPin className={locationIcon} />
          <span>Montreal, Canada</span>
        </div>

        {/* Social Links */}
        <F.Socials />
      </L.Cover>
    </L.Section>
  )
}

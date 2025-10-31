import { A, F, L, T, UI } from '../components/__'
import { createHomePageMeta } from '../lib/metaHelpers'
import type { Route } from './+types/home'

export const meta: Route.MetaFunction = () =>
  createHomePageMeta('Personal website of Jason Kuhrt')

export default function Home() {
  return (
    <L.PageSection withContainer={false}>
      <L.Cover minHeight='[60vh]'>
        {/* Avatar */}
        <UI.Avatar
          src='/images/avatar2@1x.jpg'
          alt='Jason Kuhrt'
          size='lg'
          border
          width={128}
          height={128}
        />

        {/* Name */}
        <T.DisplayHero marginBottom='6'>
          Jason Kuhrt
        </T.DisplayHero>

        {/* Bio */}
        <T.P
          fontSize='5'
          lineHeight='5'
          textAlign='center'
          maxWidth='42'
          marginBottom='8'
          color='text.secondary'
        >
          Shapeshifting Polymath ≒ Art ∙ Design ∙ Engineering. Heart humanities. In alternate universes ⊻ Coureur de
          Bois, Architect, Athlete, Lego Master Builder.
        </T.P>

        {/* Location */}
        <L.Flex.Item marginBottom='8'>
          <A.LocationBadge location='Montreal, Canada' />
        </L.Flex.Item>

        {/* Social Links */}
        <F.Socials />
      </L.Cover>
    </L.PageSection>
  )
}

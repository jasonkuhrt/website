import { A, F, L, Text, UI } from '#~/components/__'
import { profile } from '#~/data/profile'
import { createHomePageMeta } from '#~/lib/metaHelpers'
import type { Route } from './+types/home'

export const meta: Route.MetaFunction = () => createHomePageMeta('Personal website of Jason Kuhrt')

const Home: React.FC<Route.ComponentProps> = () => {
  return (
    <L.PageSection withContainer={false}>
      <L.Cover>
        <A.Avatar scale='24' />

        {/* Name */}
        <Text.DisplayHero>
          Jason Kuhrt
        </Text.DisplayHero>

        {/* Bio */}
        <Text.P textAlign={'center'}>
          {profile.tagline}
        </Text.P>

        {/* Location */}
        <L.Flex.Item marginBottom='8'>
          <UI.Badge icon='MapPin' scale='4'>Montreal, Canada</UI.Badge>
        </L.Flex.Item>

        {/* Social Links */}
        <F.Socials />
      </L.Cover>
    </L.PageSection>
  )
}

export default Home

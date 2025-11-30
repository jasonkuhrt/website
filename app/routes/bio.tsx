import { A, F, L, Text } from '#~/components/__'
import * as Bio from '#~/content/bio.js'
import { createPageMeta } from '#~/lib/metaHelpers'
import { List, Table } from 'lucide-react'
import { useState } from 'react'
import type { Route } from './+types/bio'

export const loader = async () => {
  const [profile, experiences] = await Promise.all([
    Bio.getProfile(),
    Bio.getExperiences(),
  ])
  return { profile, experiences }
}

export const meta: Route.MetaFunction = () => createPageMeta('Bio', 'About Jason Kuhrt')

const BioPage: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  const { profile, experiences } = loaderData
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')

  return (
    <>
      {/* Photo Gallery Section */}
      <L.PageSection spacing='12' withContainer={false}>
        <F.PhotoGallery />
      </L.PageSection>

      {/* Hero Section */}
      <L.PageSection>
        <L.Flex.Col align='center' gap='4' marginBottom='10'>
          <Text.H2 marginBottom='[0]'>
            {profile.name.first} {profile.name.last}
          </Text.H2>
          <Text.Text textStyle='body.base' color='text.secondary' marginBottom='2' textAlign='center'>
            {profile.headline}
          </Text.Text>
          <L.Flex.Item marginBottom='6'>
            <UI.Badge icon='MapPin' scale='4'>{profile.location}</UI.Badge>
          </L.Flex.Item>
          <F.Socials />
        </L.Flex.Col>

        {/* Bio */}
        <L.Box marginTop='10'>
          <Text.P textStyle='body.lg' marginBottom='8'>
            {profile.summary}
          </Text.P>
        </L.Box>
      </L.PageSection>

      {/* Timeline */}
      <L.PageSection spacing='16'>
        <L.Flex.Row justify='between' align='center' marginBottom='10'>
          <Text.H2 marginBottom='0'>
            Experiences
          </Text.H2>
          <A.ViewToggle
            options={[
              { icon: <List />, value: 'timeline', title: 'Timeline view' },
              { icon: <Table />, value: 'table', title: 'Table view' },
            ]}
            value={viewMode}
            onChange={($value) => setViewMode($value as 'timeline' | 'table')}
          />
        </L.Flex.Row>
        {viewMode === 'timeline' ? <F.Timeline items={experiences} /> : <F.TimelineTable items={experiences} />}
      </L.PageSection>
    </>
  )
}

export default BioPage

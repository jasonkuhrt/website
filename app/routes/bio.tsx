import { A, F, L, Text } from '#~/components/__'
import { experiences as experiencesData } from '#~/data/experiences.js'
import { profile as profileData } from '#~/data/profile.js'
import { ExperienceOrder } from '#~/data/schemas/experiences/__.js'
import { createPageMeta } from '#~/lib/metaHelpers'
import { Array } from 'effect'
import { List, Table } from 'lucide-react'
import { useState } from 'react'
import type { Route } from './+types/bio'

export const meta: Route.MetaFunction = () => createPageMeta('Bio', 'About Jason Kuhrt')

const Bio: React.FC<Route.ComponentProps> = () => {
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')

  // Sort experiences
  const experiences = Array.sort(experiencesData, ExperienceOrder)

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
            {profileData.name.first} {profileData.name.last}
          </Text.H2>
          <Text.Text textStyle='body.base' color='text.secondary' marginBottom='2' textAlign='center'>
            {profileData.headline}
          </Text.Text>
          <L.Flex.Item marginBottom='6'>
            <UI.Badge icon='MapPin' scale='4'>{profileData.location}</UI.Badge>
          </L.Flex.Item>
          <F.Socials />
        </L.Flex.Col>

        {/* Bio */}
        <L.Box marginTop='10'>
          <Text.P textStyle='body.lg' marginBottom='8'>
            {profileData.summary}
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

export default Bio

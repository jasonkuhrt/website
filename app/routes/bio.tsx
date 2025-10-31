import { Array } from 'effect'
import { List, Table } from 'lucide-react'
import { useState } from 'react'
import { A, F, L, T } from '../components/__'
import { experiences as experiencesData } from '../data/experiences.js'
import { profile as profileData } from '../data/profile.js'
import { ExperienceOrder } from '../data/schemas/experiences/__.js'
import { createPageMeta } from '../lib/metaHelpers'
import type { Route } from './+types/bio'

export const meta: Route.MetaFunction = () => createPageMeta('Bio', 'About Jason Kuhrt')

export default function Bio() {
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')

  // Sort experiences
  const experiences = Array.sort(experiencesData, ExperienceOrder)

  return (
    <>
      {/* Photo Gallery Section */}
      <L.PageSection spacing='sm' withContainer={false}>
        <F.PhotoGallery />
      </L.PageSection>

      {/* Hero Section */}
      <L.PageSection>
        <L.Flex.Col align='center' gap='4' marginBottom='10'>
          <T.H2 marginBottom='[0]'>
            {profileData.name.first} {profileData.name.last}
          </T.H2>
          <T.Text textStyle='body.base' color='text.secondary' marginBottom='2' textAlign='center'>
            {profileData.headline}
          </T.Text>
          <L.Flex.Item marginBottom='6'>
            <A.LocationBadge location={profileData.location} variant='inline' />
          </L.Flex.Item>
          <F.Socials />
        </L.Flex.Col>

        {/* Bio */}
        <L.Box marginTop='10'>
          <T.P textStyle='body.lg' marginBottom='8'>
            {profileData.summary}
          </T.P>
        </L.Box>
      </L.PageSection>

      {/* Timeline */}
      <L.PageSection spacing='md'>
        <L.Flex.Row justify='between' align='center' marginBottom='10'>
          <T.H2 marginBottom='0'>
            Experiences
          </T.H2>
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

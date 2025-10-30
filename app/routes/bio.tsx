import { List, MapPin, Table } from 'lucide-react'
import { useState } from 'react'
import { Array } from 'effect'
import { css } from '../../styled-system/css'
import { Box } from '../../styled-system/jsx'
import { experiences as experiencesData } from '../data/experiences.js'
import { ExperienceOrder } from '../data/schemas/experiences/__.js'
import { profile as profileData } from '../data/profile.js'
import { L, F, T } from '../components/__'
import type { Route } from './+types/bio'

const locationIcon = css({
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  marginRight: '1',
})

const bio = css({
  marginTop: '10',
})

const viewButton = css({
  padding: '2',
  borderRadius: 'radii.base',
  transition: 'all {durations.base}',
})

const active = css({
  backgroundColor: 'bg.subtle',
  color: 'text.primary',
})

const inactive = css({
  color: 'text.tertiary',
  _hover: {
    color: 'text.primary',
  },
})

const viewButtonIcon = css({
  width: '1rem',
  height: '1rem',
})

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Bio – Kuhrt' },
    { name: 'description', content: 'About Jason Kuhrt' },
  ]
}

export default function Bio() {
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')

  // Sort experiences
  const experiences = Array.sort(experiencesData, ExperienceOrder)

  return (
    <>
      {/* Photo Gallery Section */}
      <L.Section spacing='base'>
        <F.PhotoGallery />
      </L.Section>

      {/* Hero Section */}
      <L.Section spacing='xl'>
        <L.Container variant='content'>
          <L.Flex direction='column' align='center' gap={4} marginBottom='10'>
            <T.H2 marginBottom='4'>
              {profileData.name.first} {profileData.name.last}
            </T.H2>
            <Box as='p' textStyle='body.base' color='text.secondary' marginBottom='2' textAlign='center'>
              {profileData.headline}
            </Box>
            <Box as='p' textStyle='body.sm' fontFamily='sans' color='text.tertiary' marginBottom='6'>
              <MapPin className={locationIcon} />
              {profileData.location}
            </Box>
            <F.Socials />
          </L.Flex>

          {/* Bio */}
          <div className={bio}>
            <Box as='p' textStyle='body.lg' marginBottom='8'>
              {profileData.summary}
            </Box>
          </div>
        </L.Container>
      </L.Section>

      {/* Timeline */}
      <L.Section spacing='lg'>
        <L.Container variant='content'>
          <L.Flex justify='between' align='center' marginBottom='10'>
            <T.H2 marginBottom={0}>
              Experiences
            </T.H2>
            <L.Flex gap={2}>
              <button
                type='button'
                className={`${viewButton} ${viewMode === 'timeline' ? active : inactive}`}
                onClick={() => setViewMode('timeline')}
                title='Timeline view'
              >
                <List className={viewButtonIcon} />
              </button>
              <button
                type='button'
                className={`${viewButton} ${viewMode === 'table' ? active : inactive}`}
                onClick={() => setViewMode('table')}
                title='Table view'
              >
                <Table className={viewButtonIcon} />
              </button>
            </L.Flex>
          </L.Flex>
          {viewMode === 'timeline' ? <F.Timeline items={experiences} /> : <F.TimelineTable items={experiences} />}
        </L.Container>
      </L.Section>
    </>
  )
}

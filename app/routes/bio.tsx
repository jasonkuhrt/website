import { List, MapPin, Table } from 'lucide-react'
import { useState } from 'react'
import { Container } from '../components/Container'
import { PhotoGallery } from '../components/PhotoGallery'
import { Section } from '../components/Section'
import { Socials } from '../components/Socials'
import { Timeline } from '../components/Timeline'
import { TimelineTable } from '../components/TimelineTable'
import { talks } from '../consts'
import linkedinData from '../../public/data/linkedin.json'
import personalEventsData from '../../public/data/personal-events.json'
import type { Route } from './+types/bio'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Bio – Kuhrt' },
    { name: 'description', content: 'About Jason Kuhrt' },
  ]
}

export default function Bio() {
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')

  // Transform data into tagged union timeline events
  const experienceEvents = linkedinData.experience.map((exp) => ({
    type: 'experience' as const,
    ...exp,
  }))

  const educationEvents = linkedinData.education.map((edu) => ({
    type: 'education' as const,
    ...edu,
  }))

  const achievementEvents = linkedinData.achievements.map((ach) => ({
    type: 'achievement' as const,
    ...ach,
  }))

  const speakingEvents = talks.map((talk) => ({
    type: 'speaking' as const,
    ...talk,
  }))

  const personalEvents = personalEventsData.map((event) => ({
    type: 'personal' as const,
    ...event,
  }))

  // Combine all events
  const allEvents = [
    ...experienceEvents,
    ...educationEvents,
    ...achievementEvents,
    ...speakingEvents,
    ...personalEvents,
  ]

  // Parse dates for sorting
  const parseDate = (dateStr: string): Date => {
    if (dateStr === 'Present') return new Date()

    const monthYear = dateStr.match(/^([A-Za-z]+)\s+(\d{4})$/)
    if (monthYear) return new Date(`${monthYear[1]} 1, ${monthYear[2]}`)

    const year = dateStr.match(/^\d{4}$/)
    if (year) return new Date(`${dateStr}-01-01`)

    return new Date(dateStr)
  }

  const getStartDate = (event: typeof allEvents[0]): Date => {
    if (event.type === 'achievement' || event.type === 'speaking' || event.type === 'personal')
      return parseDate(event.date)
    return parseDate(event.startDate)
  }

  // Sort chronologically (newest first)
  allEvents.sort((a, b) => getStartDate(b).getTime() - getStartDate(a).getTime())

  return (
    <>
      {/* Photo Gallery Section */}
      <Section spacing='xl'>
        <PhotoGallery />
      </Section>

      {/* Hero Section */}
      <Section spacing='lg'>
        <Container variant='content'>
          <div className='flex flex-col items-center text-center mb-12'>
            <h1 className='text-4xl font-bold mb-4'>
              {linkedinData.name.first} {linkedinData.name.last}
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mb-2'>{linkedinData.headline}</p>
            <p className='text-sm text-gray-500 dark:text-gray-500 mb-6'>
              <MapPin className='inline-block w-4 h-4 mr-1' />
              {linkedinData.location}
            </p>
            <Socials />
          </div>

          {/* Bio */}
          <div className='prose prose-gray dark:prose-invert max-w-none'>
            <p className='text-lg leading-relaxed'>{linkedinData.summary}</p>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section spacing='lg'>
        <Container variant='content'>
          <div className='flex justify-between items-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Experiences</h2>
            <div className='flex gap-2'>
              <button
                type='button'
                className={`p-2 rounded transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                onClick={() => setViewMode('timeline')}
                title='Timeline view'
              >
                <List className='w-4 h-4' />
              </button>
              <button
                type='button'
                className={`p-2 rounded transition-all ${
                  viewMode === 'table'
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                onClick={() => setViewMode('table')}
                title='Table view'
              >
                <Table className='w-4 h-4' />
              </button>
            </div>
          </div>
          {viewMode === 'timeline' ? <Timeline items={allEvents} /> : <TimelineTable items={allEvents} />}
        </Container>
      </Section>
    </>
  )
}

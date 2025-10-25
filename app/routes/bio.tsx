import { List, MapPin, Table } from 'lucide-react'
import { useState } from 'react'
import linkedinData from '../../public/data/linkedin.json'
import personalEventsData from '../../public/data/personal-events.json'
import { Container } from '../components/Container'
import { PhotoGallery } from '../components/PhotoGallery'
import { Section } from '../components/Section'
import { Socials } from '../components/Socials'
import { Timeline } from '../components/Timeline'
import { TimelineTable } from '../components/TimelineTable'
import { talks } from '../consts'
import type { Route } from './+types/bio'
import styles from './bio.module.css'

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
          <div className={styles.hero}>
            <h1 className={styles.name}>
              {linkedinData.name.first} {linkedinData.name.last}
            </h1>
            <p className={styles.headline}>{linkedinData.headline}</p>
            <p className={styles.location}>
              <MapPin className={styles.locationIcon} />
              {linkedinData.location}
            </p>
            <Socials />
          </div>

          {/* Bio */}
          <div className={styles.bio}>
            <p className={styles.bioText}>{linkedinData.summary}</p>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section spacing='lg'>
        <Container variant='content'>
          <div className={styles.experiencesHeader}>
            <h2 className={styles.experiencesTitle}>Experiences</h2>
            <div className={styles.viewToggle}>
              <button
                type='button'
                className={`${styles.viewButton} ${viewMode === 'timeline' ? styles.active : styles.inactive}`}
                onClick={() => setViewMode('timeline')}
                title='Timeline view'
              >
                <List className={styles.viewButtonIcon} />
              </button>
              <button
                type='button'
                className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : styles.inactive}`}
                onClick={() => setViewMode('table')}
                title='Table view'
              >
                <Table className={styles.viewButtonIcon} />
              </button>
            </div>
          </div>
          {viewMode === 'timeline' ? <Timeline items={allEvents} /> : <TimelineTable items={allEvents} />}
        </Container>
      </Section>
    </>
  )
}

import { Array } from 'effect'
import { Github, Link, Play, Twitter } from 'lucide-react'
import { css } from '../../styled-system/css'
import { L, T, UI } from '../components/__'
import { experiences as experiencesData } from '../data/experiences.js'
import { DateString } from '../data/schemas/DateString.js'
import { ExperienceOrder } from '../data/schemas/experiences/__.js'
import type { Speaking as SpeakingType } from '../data/schemas/experiences/Speaking.js'
import { createPageMeta } from '../lib/metaHelpers'
import type { Route } from './+types/speaking'

const icon = css({
  width: '1',
  height: '1',
})

export const meta: Route.MetaFunction = () =>
  createPageMeta('Speaking', 'Talks and presentations by Jason Kuhrt')

export default function Speaking() {
  // Get speaking engagements from experiences data
  const experiences = Array.sort(experiencesData, ExperienceOrder)
  const talks = experiences.filter(($exp): $exp is SpeakingType => $exp._tag === 'Speaking')

  const headers = [
    { key: 'date', label: 'Date', align: 'left' as const },
    { key: 'title', label: 'Title', align: 'left' as const },
    { key: 'venue', label: 'Venue', align: 'left' as const },
    { key: 'slides', label: 'Slides', align: 'center' as const },
    { key: 'info', label: 'Info', align: 'center' as const },
    { key: 'recording', label: 'Recording', align: 'center' as const },
    { key: 'post', label: 'Post', align: 'center' as const },
  ]

  const rows = talks.map(($talk) => ({
    date: (
      <L.Box whiteSpace='nowrap'>
        <T.Text fontSize='2' color='text.secondary'>{DateString.format($talk.date)}</T.Text>
      </L.Box>
    ),
    title: <T.Text fontSize='2' color='text.primary'>{$talk.title}</T.Text>,
    venue: <T.Text fontSize='2' color='text.secondary'>{$talk.venue}</T.Text>,
    slides: <UI.IconLink href={$talk.links?.repo} title='Slides' icon={<Github className={icon} />} />,
    info: <UI.IconLink href={$talk.links?.info} title='Event Info' icon={<Link className={icon} />} />,
    recording: <UI.IconLink href={$talk.links?.recording} title='Recording' icon={<Play className={icon} />} />,
    post: <UI.IconLink href={$talk.links?.twitter} title='Twitter' icon={<Twitter className={icon} />} />,
  }))

  return (
    <L.PageSection>
      <UI.DataTable headers={headers} rows={rows} />
    </L.PageSection>
  )
}

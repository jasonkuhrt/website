import { Github, Link, Play, Twitter } from 'lucide-react'
import { Array } from 'effect'
import { css } from '../../styled-system/css'
import { experiences as experiencesData } from '../data/experiences.js'
import { ExperienceOrder } from '../data/schemas/experiences/__.js'
import { DateString } from '../data/schemas/DateString.js'
import { L } from '../components/__'
import type { Speaking as SpeakingType } from '../data/schemas/experiences/Speaking.js'
import type { Route } from './+types/speaking'

const tableWrapper = css({
  overflowX: 'auto',
})

const table = css({
  width: '100%',
  fontSize: 'sm',
})

const headerRow = css({
  borderBottom: '1px solid',
  borderColor: 'border.default',
})

const headerCell = css({
  paddingBlock: '3',
  paddingInlineEnd: '4',
  color: 'text.primary',
  fontWeight: 'fontWeights.semibold',
})

const headerCellLeft = css({
  textAlign: 'left',
})

const headerCellCenter = css({
  textAlign: 'center',
  paddingInline: '2',
})

const row = css({
  borderBottom: '1px solid',
  borderColor: 'border.subtle',
  transition: 'background-color {durations.fast}',
  '&:last-child': {
    borderBottom: 0,
  },
  _hover: {
    backgroundColor: 'bg.subtle',
  },
})

const cellDate = css({
  paddingBlock: '3',
  paddingInlineEnd: '4',
  color: 'text.secondary',
  whiteSpace: 'nowrap',
  verticalAlign: 'top',
})

const cellTitle = css({
  paddingBlock: '3',
  paddingInlineEnd: '4',
  color: 'text.primary',
  verticalAlign: 'top',
})

const cellVenue = css({
  paddingBlock: '3',
  paddingInlineEnd: '4',
  color: 'text.secondary',
  verticalAlign: 'top',
})

const cellIcon = css({
  paddingBlock: '3',
  paddingInline: '2',
  textAlign: 'center',
  verticalAlign: 'top',
})

const iconLink = css({
  color: 'text.tertiary',
  transition: 'color {durations.fast}',
  display: 'inline-block',
  _hover: {
    color: 'text.primary',
  },
})

const icon = css({
  width: '1rem',
  height: '1rem',
})

const emptyIcon = css({
  color: 'border.default',
})

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Speaking – Kuhrt' },
    { name: 'description', content: 'Talks and presentations by Jason Kuhrt' },
  ]
}

export default function Speaking() {
  // Get speaking engagements from experiences data
  const experiences = Array.sort(experiencesData, ExperienceOrder)
  const talks = experiences.filter((exp): exp is SpeakingType => exp._tag === 'Speaking')

  return (
    <L.Section spacing='xl'>
      <L.Container variant='content'>
        <div className={tableWrapper}>
          <table className={table}>
            <thead>
              <tr className={headerRow}>
                <th className={`${headerCell} ${headerCellLeft}`}>Date</th>
                <th className={`${headerCell} ${headerCellLeft}`}>Title</th>
                <th className={`${headerCell} ${headerCellLeft}`}>Venue</th>
                <th className={`${headerCell} ${headerCellCenter}`}>Slides</th>
                <th className={`${headerCell} ${headerCellCenter}`}>Info</th>
                <th className={`${headerCell} ${headerCellCenter}`}>Recording</th>
                <th className={`${headerCell} ${headerCellCenter}`}>Post</th>
              </tr>
            </thead>
            <tbody>
              {talks.map((talk) => (
                <tr
                  key={`${talk.title}-${talk.date}`}
                  className={row}
                >
                  <td className={cellDate}>
                    {DateString.format(talk.date)}
                  </td>
                  <td className={cellTitle}>
                    {talk.title}
                  </td>
                  <td className={cellVenue}>
                    {talk.venue}
                  </td>
                  <td className={cellIcon}>
                    {talk.links?.repo ?
                      (
                        <a
                          className={iconLink}
                          href={talk.links.repo}
                          target='_blank'
                          rel='noopener noreferrer'
                          title='Slides'
                        >
                          <Github className={icon} />
                        </a>
                      ) :
                      <span className={emptyIcon}>-</span>}
                  </td>
                  <td className={cellIcon}>
                    {talk.links?.info ?
                      (
                        <a
                          className={iconLink}
                          href={talk.links.info}
                          target='_blank'
                          rel='noopener noreferrer'
                          title='Event Info'
                        >
                          <Link className={icon} />
                        </a>
                      ) :
                      <span className={emptyIcon}>-</span>}
                  </td>
                  <td className={cellIcon}>
                    {talk.links?.recording ?
                      (
                        <a
                          className={iconLink}
                          href={talk.links.recording}
                          target='_blank'
                          rel='noopener noreferrer'
                          title='Recording'
                        >
                          <Play className={icon} />
                        </a>
                      ) :
                      <span className={emptyIcon}>-</span>}
                  </td>
                  <td className={cellIcon}>
                    {talk.links?.twitter ?
                      (
                        <a
                          className={iconLink}
                          href={talk.links.twitter}
                          target='_blank'
                          rel='noopener noreferrer'
                          title='Twitter'
                        >
                          <Twitter className={icon} />
                        </a>
                      ) :
                      <span className={emptyIcon}>-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </L.Container>
    </L.Section>
  )
}

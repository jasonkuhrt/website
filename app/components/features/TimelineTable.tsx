import { Match } from 'effect'
import { css } from '../../../styled-system/css'
import { Github, Link, Play, X } from 'lucide-react'
import type { Experience } from '../../data/schemas/experiences/__.js'
import { DateString } from '../../data/schemas/DateString.js'

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

const cellOrg = css({
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

interface Props {
  items: Experience[]
}

const getEventType = (tag: Experience['_tag']): string =>
  Match.value(tag).pipe(
    Match.when('WorkExperience', () => 'Work'),
    Match.when('Education', () => 'Education'),
    Match.when('Achievement', () => 'Honour'),
    Match.when('Speaking', () => 'Talk'),
    Match.when('Personal', () => 'Life'),
    Match.exhaustive,
  )

const getDateRange = (item: Experience): string => {
  if (item._tag === 'Achievement' || item._tag === 'Speaking' || item._tag === 'Personal') {
    return DateString.format(item.date)
  }
  return `${DateString.format(item.date)} - ${DateString.format(item.endDate)}`
}

const getTitle = (item: Experience): string =>
  Match.value(item).pipe(
    Match.tagsExhaustive({
      WorkExperience: (exp) => exp.title,
      Education: (exp) => exp.degree,
      Achievement: (exp) => exp.title,
      Speaking: (exp) => exp.title,
      Personal: (exp) => exp.title
    })
  )

const getOrganization = (item: Experience): string =>
  Match.value(item).pipe(
    Match.tagsExhaustive({
      WorkExperience: (exp) => exp.company,
      Education: (exp) => exp.institution,
      Achievement: (exp) => exp.issuer,
      Speaking: (exp) => exp.venue,
      Personal: () => ''
    })
  )

export const TimelineTable: React.FC<Props> = ({ items }) => {
  return (
    <div className={tableWrapper}>
      <table className={table}>
        <thead>
          <tr className={headerRow}>
            <th className={`${headerCell} ${headerCellLeft}`}>Date</th>
            <th className={`${headerCell} ${headerCellLeft}`}>Type</th>
            <th className={`${headerCell} ${headerCellLeft}`}>Title</th>
            <th className={`${headerCell} ${headerCellLeft}`}>Organization</th>
            <th className={`${headerCell} ${headerCellCenter}`}>Slides</th>
            <th className={`${headerCell} ${headerCellCenter}`}>Info</th>
            <th className={`${headerCell} ${headerCellCenter}`}>Recording</th>
            <th className={`${headerCell} ${headerCellCenter}`}>Post</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const org = getOrganization(item)
            return (
              <tr
                key={index}
                className={row}
              >
                <td className={cellDate}>
                  {getDateRange(item)}
                </td>
                <td className={cellDate}>
                  {getEventType(item._tag)}
                </td>
                <td className={cellTitle}>
                  {getTitle(item)}
                </td>
                <td className={cellOrg}>
                  {org}
                </td>
                <td className={cellIcon}>
                  {item._tag === 'Speaking' && item.links?.repo ?
                    (
                      <a
                        className={iconLink}
                        href={item.links.repo}
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
                  {item._tag === 'Speaking' && item.links?.info ?
                    (
                      <a
                        className={iconLink}
                        href={item.links.info}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Event Info'
                      >
                        <Link className={icon} />
                      </a>
                    ) :
                    item._tag === 'Personal' && item.url ?
                    (
                      <a
                        className={iconLink}
                        href={item.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Learn more'
                      >
                        <Link className={icon} />
                      </a>
                    ) :
                    <span className={emptyIcon}>-</span>}
                </td>
                <td className={cellIcon}>
                  {item._tag === 'Speaking' && item.links?.recording ?
                    (
                      <a
                        className={iconLink}
                        href={item.links.recording}
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
                  {item._tag === 'Speaking' && item.links?.twitter ?
                    (
                      <a
                        className={iconLink}
                        href={item.links.twitter}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Post'
                      >
                        <X className={icon} />
                      </a>
                    ) :
                    <span className={emptyIcon}>-</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

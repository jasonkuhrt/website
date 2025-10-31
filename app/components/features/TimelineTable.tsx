import { Match } from 'effect'
import { css } from '#styled-system/css'
import { DateString } from '#~/data/schemas/DateString.js'
import type { Experience } from '#~/data/schemas/experiences/__.js'
import { UI } from '../__'

const table = css({
  width: '[100%]',
  fontSize: '2',
})

const headerCell = css({
  color: 'text.primary',
  fontWeight: 'semibold',
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
  if (item._tag === 'Achievement' || item._tag === 'Speaking' || item._tag === 'Personal')
    return DateString.format(item.date)
  return `${DateString.format(item.date)} - ${DateString.format(item.endDate)}`
}

const getTitle = (item: Experience): string =>
  Match.value(item).pipe(
    Match.tagsExhaustive({
      WorkExperience: (exp) => exp.title,
      Education: (exp) => exp.degree,
      Achievement: (exp) => exp.title,
      Speaking: (exp) => exp.title,
      Personal: (exp) => exp.title,
    }),
  )

const getOrganization = (item: Experience): string =>
  Match.value(item).pipe(
    Match.tagsExhaustive({
      WorkExperience: (exp) => exp.company,
      Education: (exp) => exp.institution,
      Achievement: (exp) => exp.issuer,
      Speaking: (exp) => exp.venue,
      Personal: () => '',
    }),
  )

export const TimelineTable: React.FC<Props> = ({ items }) => {
  return (
    <div className={UI.tableStyles.tableWrapper}>
      <table className={table}>
        <thead>
          <tr className={UI.tableStyles.headerRow}>
            <th className={`${UI.tableStyles.headerCell} ${headerCell} ${UI.tableStyles.headerCellLeft}`}>Date</th>
            <th className={`${UI.tableStyles.headerCell} ${headerCell} ${UI.tableStyles.headerCellLeft}`}>Type</th>
            <th className={`${UI.tableStyles.headerCell} ${headerCell} ${UI.tableStyles.headerCellLeft}`}>Title</th>
            <th className={`${UI.tableStyles.headerCell} ${headerCell} ${UI.tableStyles.headerCellLeft}`}>
              Organization
            </th>
            <th className={`${UI.tableStyles.headerCell} ${headerCell} ${UI.tableStyles.headerCellCenter}`}>Slides</th>
            <th className={`${UI.tableStyles.headerCell} ${headerCell} ${UI.tableStyles.headerCellCenter}`}>Info</th>
            <th className={`${UI.tableStyles.headerCell} ${headerCell} ${UI.tableStyles.headerCellCenter}`}>
              Recording
            </th>
            <th className={`${UI.tableStyles.headerCell} ${headerCell} ${UI.tableStyles.headerCellCenter}`}>Post</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const org = getOrganization(item)
            return (
              <tr
                key={index}
                className={UI.tableStyles.row}
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
                  <UI.IconLink
                    href={item._tag === 'Speaking' ? item.links?.repo : undefined}
                    title='Slides'
                    icon={<UI.Badge icon='Github' scale='1' />}
                  />
                </td>
                <td className={cellIcon}>
                  <UI.IconLink
                    href={item._tag === 'Speaking' ?
                      item.links?.info :
                      item._tag === 'Personal' ?
                      item.url :
                      undefined}
                    title={item._tag === 'Personal' ? 'Learn more' : 'Event Info'}
                    icon={<UI.Badge icon='Link' scale='1' />}
                  />
                </td>
                <td className={cellIcon}>
                  <UI.IconLink
                    href={item._tag === 'Speaking' ? item.links?.recording : undefined}
                    title='Recording'
                    icon={<UI.Badge icon='Play' scale='1' />}
                  />
                </td>
                <td className={cellIcon}>
                  <UI.IconLink
                    href={item._tag === 'Speaking' ? item.links?.twitter : undefined}
                    title='Post'
                    icon={<UI.Badge icon='X' scale='1' />}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

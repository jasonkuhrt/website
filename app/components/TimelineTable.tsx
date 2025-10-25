import styles from "./TimelineTable.module.css"
import { Github, Link, Play, X } from 'lucide-react'

type TimelineEvent =
  | {
    type: 'experience'
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    description: string
  }
  | {
    type: 'education'
    institution: string
    degree: string
    startDate: string
    endDate: string
    description: string
  }
  | {
    type: 'achievement'
    title: string
    issuer: string
    date: string
    description: string
  }
  | {
    type: 'speaking'
    title: string
    venue: string
    date: string
    links: {
      info?: string
      repo?: string
      recording?: string
      twitter?: string
    }
  }
  | {
    type: 'personal'
    title: string
    date: string
    description?: string
    icon?: string
    url?: string
  }

interface Props {
  items: TimelineEvent[]
}

const getEventType = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'experience':
      return 'Work'
    case 'education':
      return 'Education'
    case 'achievement':
      return 'Honour'
    case 'speaking':
      return 'Talk'
    case 'personal':
      return 'Life'
  }
}

const getDateRange = (item: TimelineEvent): string => {
  if (item.type === 'achievement' || item.type === 'speaking' || item.type === 'personal') return item.date
  const endDate = item.endDate === 'Present' ? 'Now' : item.endDate
  return `${item.startDate} - ${endDate}`
}

const getTitle = (item: TimelineEvent): string => {
  switch (item.type) {
    case 'experience':
      return item.title
    case 'education':
      return item.degree
    case 'achievement':
    case 'speaking':
    case 'personal':
      return item.title
  }
}

const getOrganization = (item: TimelineEvent): string => {
  switch (item.type) {
    case 'experience':
      return item.company
    case 'education':
      return item.institution
    case 'achievement':
      return item.issuer
    case 'speaking':
      return item.venue
    case 'personal':
      return ''
  }
}

export const TimelineTable: React.FC<Props> = ({ items }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={`${styles.headerCell} ${styles.headerCellLeft}`}>Date</th>
            <th className={`${styles.headerCell} ${styles.headerCellLeft}`}>Type</th>
            <th className={`${styles.headerCell} ${styles.headerCellLeft}`}>Title</th>
            <th className={`${styles.headerCell} ${styles.headerCellLeft}`}>Organization</th>
            <th className={`${styles.headerCell} ${styles.headerCellCenter}`}>Slides</th>
            <th className={`${styles.headerCell} ${styles.headerCellCenter}`}>Info</th>
            <th className={`${styles.headerCell} ${styles.headerCellCenter}`}>Recording</th>
            <th className={`${styles.headerCell} ${styles.headerCellCenter}`}>Post</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const org = getOrganization(item)
            return (
              <tr
                key={index}
                className={styles.row}
              >
                <td className={styles.cellDate}>
                  {getDateRange(item)}
                </td>
                <td className={styles.cellDate}>
                  {getEventType(item.type)}
                </td>
                <td className={styles.cellTitle}>
                  {getTitle(item)}
                </td>
                <td className={styles.cellOrg}>
                  {org}
                </td>
                <td className={styles.cellIcon}>
                  {item.type === 'speaking' && item.links.repo ?
                    (
                      <a
                        className={styles.iconLink}
                        href={item.links.repo}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Slides'
                      >
                        <Github className={styles.icon} />
                      </a>
                    ) :
                    <span className={styles.emptyIcon}>-</span>}
                </td>
                <td className={styles.cellIcon}>
                  {item.type === 'speaking' && item.links.info ?
                    (
                      <a
                        className={styles.iconLink}
                        href={item.links.info}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Event Info'
                      >
                        <Link className={styles.icon} />
                      </a>
                    ) :
                    item.type === 'personal' && item.url ?
                    (
                      <a
                        className={styles.iconLink}
                        href={item.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Learn more'
                      >
                        <Link className={styles.icon} />
                      </a>
                    ) :
                    <span className={styles.emptyIcon}>-</span>}
                </td>
                <td className={styles.cellIcon}>
                  {item.type === 'speaking' && item.links.recording ?
                    (
                      <a
                        className={styles.iconLink}
                        href={item.links.recording}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Recording'
                      >
                        <Play className={styles.icon} />
                      </a>
                    ) :
                    <span className={styles.emptyIcon}>-</span>}
                </td>
                <td className={styles.cellIcon}>
                  {item.type === 'speaking' && item.links.twitter ?
                    (
                      <a
                        className={styles.iconLink}
                        href={item.links.twitter}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Post'
                      >
                        <X className={styles.icon} />
                      </a>
                    ) :
                    <span className={styles.emptyIcon}>-</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

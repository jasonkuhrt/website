import { Github, Link, Play, Twitter } from 'lucide-react'
import { Container } from '../components/Container'
import { Section } from '../components/Section'
import { talks } from '../consts'
import type { Route } from './+types/speaking'
import styles from './speaking.module.css'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Speaking – Kuhrt' },
    { name: 'description', content: 'Talks and presentations by Jason Kuhrt' },
  ]
}

export default function Speaking() {
  return (
    <Section spacing='xl'>
      <Container variant='content'>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                <th className={`${styles.headerCell} ${styles.headerCellLeft}`}>Date</th>
                <th className={`${styles.headerCell} ${styles.headerCellLeft}`}>Title</th>
                <th className={`${styles.headerCell} ${styles.headerCellLeft}`}>Venue</th>
                <th className={`${styles.headerCell} ${styles.headerCellCenter}`}>Slides</th>
                <th className={`${styles.headerCell} ${styles.headerCellCenter}`}>Info</th>
                <th className={`${styles.headerCell} ${styles.headerCellCenter}`}>Recording</th>
                <th className={`${styles.headerCell} ${styles.headerCellCenter}`}>Post</th>
              </tr>
            </thead>
            <tbody>
              {talks.map((talk) => (
                <tr
                  key={`${talk.title}-${talk.date}`}
                  className={styles.row}
                >
                  <td className={styles.cellDate}>
                    {talk.date}
                  </td>
                  <td className={styles.cellTitle}>
                    {talk.title}
                  </td>
                  <td className={styles.cellVenue}>
                    {talk.venue}
                  </td>
                  <td className={styles.cellIcon}>
                    {talk.links.repo ?
                      (
                        <a
                          className={styles.iconLink}
                          href={talk.links.repo}
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
                    {talk.links.info ?
                      (
                        <a
                          className={styles.iconLink}
                          href={talk.links.info}
                          target='_blank'
                          rel='noopener noreferrer'
                          title='Event Info'
                        >
                          <Link className={styles.icon} />
                        </a>
                      ) :
                      <span className={styles.emptyIcon}>-</span>}
                  </td>
                  <td className={styles.cellIcon}>
                    {talk.links.recording ?
                      (
                        <a
                          className={styles.iconLink}
                          href={talk.links.recording}
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
                    {talk.links.twitter ?
                      (
                        <a
                          className={styles.iconLink}
                          href={talk.links.twitter}
                          target='_blank'
                          rel='noopener noreferrer'
                          title='Twitter'
                        >
                          <Twitter className={styles.icon} />
                        </a>
                      ) :
                      <span className={styles.emptyIcon}>-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  )
}

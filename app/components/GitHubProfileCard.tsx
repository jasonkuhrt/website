import { Code, Star, Users } from 'lucide-react'
import styles from './GitHubProfileCard.module.css'

export const GitHubProfileCard: React.FC = () => {
  return (
    <div className={styles.card}>
      {/* Header with avatar and username - clickable to profile */}
      <a
        href='https://github.com/jasonkuhrt'
        target='_blank'
        rel='noopener noreferrer'
        className={styles.header}
      >
        <img
          src='https://github.com/jasonkuhrt.png'
          alt='Jason Kuhrt'
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h3 className={styles.username}>
            @jasonkuhrt
          </h3>
          <p className={styles.profileLink}>
            View GitHub Profile →
          </p>
        </div>
      </a>

      {/* Bio */}
      <p className={styles.bio}>
        Software engineer passionate about developer experience, type safety, and open source. Building tools for the
        GraphQL and TypeScript communities.
      </p>

      {/* Quick stats */}
      <div className={styles.stats}>
        <a
          href='https://github.com/jasonkuhrt?tab=repositories'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.statLink}
        >
          <Code className={styles.statIcon} />
          <span>Repositories</span>
        </a>
        <a
          href='https://github.com/jasonkuhrt?tab=stars'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.statLink}
        >
          <Star className={styles.statIcon} />
          <span>Stars</span>
        </a>
        <a
          href='https://github.com/jasonkuhrt?tab=followers'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.statLink}
        >
          <Users className={styles.statIcon} />
          <span>Followers</span>
        </a>
      </div>
    </div>
  )
}

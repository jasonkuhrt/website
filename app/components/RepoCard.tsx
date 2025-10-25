import { format } from 'date-fns'
import { GitFork, Star } from 'lucide-react'
import { useState } from 'react'
import type { GitHubRepo } from '../lib/github'
import styles from './RepoCard.module.css'

interface Props {
  repo: GitHubRepo
}

export const RepoCard: React.FC<Props> = ({ repo }) => {
  const [showRelative, setShowRelative] = useState(true)

  // Format the last updated date (relative)
  const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (diffInDays === 0) return 'today'
    if (diffInDays === 1) return 'yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  // Format abbreviated date
  const formatAbbreviatedDate = (dateString: string): string => {
    return format(new Date(dateString), 'MMM d, yyyy')
  }

  const relativeDate = formatRelativeDate(repo.pushedAt)
  const abbreviatedDate = formatAbbreviatedDate(repo.pushedAt)

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target === e.currentTarget ||
      !(e.target instanceof HTMLAnchorElement)
    ) {
      window.open(repo.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      window.open(repo.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      role='link'
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.content}>
        {/* Header with name and stats */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            {repo.name}
          </h3>
          <div className={styles.stats}>
            <div className={styles.stat} title='Stars'>
              <Star className={styles.statIcon} />
              <span>{repo.stargazerCount}</span>
            </div>
            <div className={styles.stat} title='Forks'>
              <GitFork className={styles.statIcon} />
              <span>{repo.forkCount}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className={styles.description}>
          {repo.description || 'No description available'}
        </p>

        {/* Topics */}
        {repo.repositoryTopics.nodes.length > 0 && (
          <div className={styles.topics}>
            {repo.repositoryTopics.nodes.map(({ topic }) => (
              <a
                key={topic.name}
                href={`https://github.com/topics/${topic.name}`}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.topic}
                onClick={(e) => e.stopPropagation()}
              >
                {topic.name}
              </a>
            ))}
          </div>
        )}

        {/* Compact data list */}
        <dl className={styles.metadata}>
          {repo.primaryLanguage && (
            <div className={styles.metadataRow}>
              <dt className={styles.metadataLabel}>Language</dt>
              <div className={styles.metadataDivider}></div>
              <dd className={styles.metadataValue}>
                <a
                  href={`https://github.com/${
                    repo.url.split('github.com/')[1].split('/')[0]
                  }?tab=repositories&language=${repo.primaryLanguage.name.toLowerCase()}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.metadataLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  {repo.primaryLanguage.name}
                </a>
              </dd>
            </div>
          )}
          {repo.latestRelease && (
            <div className={styles.metadataRow}>
              <dt className={styles.metadataLabel}>Latest release</dt>
              <div className={styles.metadataDivider}></div>
              <dd className={styles.metadataValue}>
                <a
                  href={repo.latestRelease.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.metadataLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  {repo.latestRelease.tagName}
                </a>
              </dd>
            </div>
          )}
          {repo.defaultBranchRef && (
            <div className={styles.metadataRow}>
              <dt className={styles.metadataLabel}>Last commit</dt>
              <div className={styles.metadataDivider}></div>
              <dd className={styles.metadataValue}>
                <a
                  href={repo.defaultBranchRef.target.commitUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.commitLink}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowRelative(!showRelative)
                  }}
                >
                  {showRelative ? relativeDate : abbreviatedDate}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}

import { format } from 'date-fns'
import { GitFork, Star } from 'lucide-react'
import { useState } from 'react'
import { css } from '../../../styled-system/css'
import type { GitHubRepo } from '../../data/schemas/repos'

const card = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  border: '1px solid',
  borderColor: 'border.default',
  borderRadius: 'radii.base',
  padding: '6',
  transition: 'border-color {durations.base}',
  cursor: 'pointer',
  _hover: {
    borderColor: 'border.hover',
    '& .card-title': {
      color: 'accent.default',
    },
  },
})

const content = css({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
})

const header = css({
  marginBottom: '3',
})

const title = css({
  textStyle: 'heading.4',
  color: 'text.primary',
  transition: 'color {durations.base}',
})

const stats = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  fontSize: 'sm',
  color: 'text.tertiary',
  marginBottom: '5',
})

const stat = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1',
})

const statIcon = css({
  width: '1rem',
  height: '1rem',
})

const description = css({
  textStyle: 'body.base',
  color: 'text.secondary',
  marginBottom: '5',
  flexGrow: 1,
})

const topics = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  marginBottom: '5',
})

const topic = css({
  fontSize: 'xs',
  paddingInline: '3',
  paddingBlock: '1',
  borderRadius: 'radii.full',
  backgroundColor: 'bg.subtle',
  color: 'accent.default',
  transition: 'background-color {durations.fast}',
  _hover: {
    backgroundColor: 'bg.hover',
  },
})

const metadata = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  fontSize: 'sm',
  color: 'text.tertiary',
})

const metadataRow = css({
  display: 'flex',
  alignItems: 'center',
})

const metadataLabel = css({
  flexShrink: 0,
})

const metadataDivider = css({
  flexGrow: 1,
  marginInline: '2',
  borderBottom: '1px dotted',
  borderColor: 'border.default',
  opacity: 0.4,
})

const metadataValue = css({
  flexShrink: 0,
  textAlign: 'right',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const metadataLink = css({
  transition: 'color {durations.base}',
  _hover: {
    color: 'accent.default',
  },
})

const commitLink = css({
  cursor: 'pointer',
  transition: 'color {durations.base}',
  _hover: {
    color: 'accent.default',
  },
})

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
      className={card}
      onClick={handleCardClick}
      role='link'
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={content}>
        {/* Header with name */}
        <div className={header}>
          <h3 className={`${title} card-title`}>
            {repo.name}
          </h3>
        </div>

        {/* Stats */}
        <div className={stats}>
          <div className={stat} title='Stars'>
            <Star className={statIcon} />
            <span>{repo.stargazerCount}</span>
          </div>
          <div className={stat} title='Forks'>
            <GitFork className={statIcon} />
            <span>{repo.forkCount}</span>
          </div>
        </div>

        {/* Description */}
        <p className={description}>
          {repo.description || 'No description available'}
        </p>

        {/* Topics */}
        {repo.repositoryTopics.nodes.length > 0 && (
          <div className={topics}>
            {repo.repositoryTopics.nodes.map(({ topic: topicData }) => (
              <a
                key={topicData.name}
                href={`https://github.com/topics/${topicData.name}`}
                target='_blank'
                rel='noopener noreferrer'
                className={topic}
                onClick={(e) => e.stopPropagation()}
              >
                {topicData.name}
              </a>
            ))}
          </div>
        )}

        {/* Compact data list */}
        <dl className={metadata}>
          {repo.primaryLanguage && (
            <div className={metadataRow}>
              <dt className={metadataLabel}>Language</dt>
              <div className={metadataDivider}></div>
              <dd className={metadataValue}>
                <a
                  href={`https://github.com/${
                    repo.url.split('github.com/')[1].split('/')[0]
                  }?tab=repositories&language=${repo.primaryLanguage.name.toLowerCase()}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={metadataLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  {repo.primaryLanguage.name}
                </a>
              </dd>
            </div>
          )}
          {repo.latestRelease && (
            <div className={metadataRow}>
              <dt className={metadataLabel}>Latest release</dt>
              <div className={metadataDivider}></div>
              <dd className={metadataValue}>
                <a
                  href={repo.latestRelease.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={metadataLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  {repo.latestRelease.tagName}
                </a>
              </dd>
            </div>
          )}
          {repo.defaultBranchRef && (
            <div className={metadataRow}>
              <dt className={metadataLabel}>Last commit</dt>
              <div className={metadataDivider}></div>
              <dd className={metadataValue}>
                <a
                  href={repo.defaultBranchRef.target.commitUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={commitLink}
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

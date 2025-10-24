import { format } from 'date-fns'
import { GitFork, Star } from 'lucide-react'
import { useState } from 'react'
import type { GitHubRepo } from '../lib/github'

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
      className='flex flex-col h-full group border border-gray-200 dark:border-gray-800 rounded p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer'
      onClick={handleCardClick}
      role='link'
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className='flex flex-col flex-grow'>
        {/* Header with name and stats */}
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
            {repo.name}
          </h3>
          <div className='flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4'>
            <div className='flex items-center gap-1' title='Stars'>
              <Star className='w-4 h-4' />
              <span>{repo.stargazerCount}</span>
            </div>
            <div className='flex items-center gap-1' title='Forks'>
              <GitFork className='w-4 h-4' />
              <span>{repo.forkCount}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow'>
          {repo.description || 'No description available'}
        </p>

        {/* Topics */}
        {repo.repositoryTopics.nodes.length > 0 && (
          <div className='flex flex-wrap gap-1.5 mb-3'>
            {repo.repositoryTopics.nodes.map(({ topic }) => (
              <a
                key={topic.name}
                href={`https://github.com/topics/${topic.name}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors'
                onClick={(e) => e.stopPropagation()}
              >
                {topic.name}
              </a>
            ))}
          </div>
        )}

        {/* Compact data list */}
        <dl className='space-y-1 text-xs text-gray-500 dark:text-gray-400'>
          {repo.primaryLanguage && (
            <div className='flex items-center'>
              <dt className='opacity-60 flex-shrink-0'>Language</dt>
              <div className='flex-grow mx-2 border-b border-dotted border-gray-300 dark:border-gray-700 opacity-30'>
              </div>
              <dd className='flex-shrink-0 truncate text-right'>
                <a
                  href={`https://github.com/${
                    repo.url.split('github.com/')[1].split('/')[0]
                  }?tab=repositories&language=${repo.primaryLanguage.name.toLowerCase()}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  onClick={(e) => e.stopPropagation()}
                >
                  {repo.primaryLanguage.name}
                </a>
              </dd>
            </div>
          )}
          {repo.latestRelease && (
            <div className='flex items-center'>
              <dt className='opacity-60 flex-shrink-0'>Latest release</dt>
              <div className='flex-grow mx-2 border-b border-dotted border-gray-300 dark:border-gray-700 opacity-30'>
              </div>
              <dd className='flex-shrink-0 truncate text-right'>
                <a
                  href={repo.latestRelease.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  onClick={(e) => e.stopPropagation()}
                >
                  {repo.latestRelease.tagName}
                </a>
              </dd>
            </div>
          )}
          {repo.defaultBranchRef && (
            <div className='flex items-center'>
              <dt className='opacity-60 flex-shrink-0'>Last commit</dt>
              <div className='flex-grow mx-2 border-b border-dotted border-gray-300 dark:border-gray-700 opacity-30'>
              </div>
              <dd className='flex-shrink-0 text-right'>
                <a
                  href={repo.defaultBranchRef.target.commitUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
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

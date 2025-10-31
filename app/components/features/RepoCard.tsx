import { GitFork, Star } from 'lucide-react'
import { useState } from 'react'
import { css } from '../../../styled-system/css'
import type { GitHubRepo } from '../../data/schemas/repos'
import { formatAbbreviatedDate, formatRelativeDate } from '../../lib/dateFormatting'
import { L, T, UI } from '../__'

const padding = css({
  padding: '4',
})

const topics = css({
  marginBottom: '5',
})

const commitLink = css({
  cursor: 'pointer',
})

interface Props {
  repo: GitHubRepo
}

export const RepoCard: React.FC<Props> = ({ repo }) => {
  const [showRelative, setShowRelative] = useState(true)

  const relativeDate = formatRelativeDate(repo.pushedAt)
  const abbreviatedDate = formatAbbreviatedDate(repo.pushedAt)

  return (
    <UI.Card className={padding} tabIndex={0}>
      <L.Flex.Col>
        <L.Flex.ItemBox direction='column' grow>
        {/* Header with name */}
        <div>
          <T.H3
            textStyle='heading.4'
            color='text.primary'
            transitionProperty='colors'
            transitionDuration='base'
            className='card-title'
          >
            {repo.name}
          </T.H3>
        </div>

        {/* Stats */}
        <L.Flex.Row align='center' gap='1' marginBottom='5'>
          <UI.Stat
            icon={<Star />}
            value={repo.stargazerCount}
            label='Stars'
          />
          <UI.Stat
            icon={<GitFork />}
            value={repo.forkCount}
            label='Forks'
          />
        </L.Flex.Row>

        {/* Description */}
        <T.Text textStyle='body.base' color='text.secondary' marginBottom='5' flexGrow={1}>
          {repo.description || 'No description available'}
        </T.Text>

        {/* Topics */}
        {repo.repositoryTopics.nodes.length > 0 && (
          <L.Flex.Row wrap gap='2' className={topics}>
            {repo.repositoryTopics.nodes.map(({ topic: $topicData }) => (
              <UI.TagBadge
                key={$topicData.name}
                label={$topicData.name}
                href={`https://github.com/topics/${$topicData.name}`}
              />
            ))}
          </L.Flex.Row>
        )}

        {/* Compact data list */}
        <L.Flex.Col as='dl' gap='2'>
          {repo.primaryLanguage && (
            <UI.MetadataRow
              label='Language'
              value={
                <UI.Link
                  href={`https://github.com/${
                    repo.url.split('github.com/')[1].split('/')[0]
                  }?tab=repositories&language=${repo.primaryLanguage.name.toLowerCase()}`}
                  external
                  variant='accent'
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  {repo.primaryLanguage.name}
                </UI.Link>
              }
            />
          )}
          {repo.latestRelease && (
            <UI.MetadataRow
              label='Latest release'
              value={
                <UI.Link
                  href={repo.latestRelease.url}
                  external
                  variant='accent'
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  {repo.latestRelease.tagName}
                </UI.Link>
              }
            />
          )}
          {repo.defaultBranchRef && (
            <UI.MetadataRow
              label='Last commit'
              value={
                <UI.Link
                  href={repo.defaultBranchRef.target.commitUrl}
                  external
                  variant='accent'
                  className={commitLink}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    setShowRelative(!showRelative)
                  }}
                >
                  {showRelative ? relativeDate : abbreviatedDate}
                </UI.Link>
              }
            />
          )}
        </L.Flex.Col>
      </L.Flex.ItemBox>
      </L.Flex.Col>
    </UI.Card>
  )
}

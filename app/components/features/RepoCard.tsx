import { css } from '#styled-system/css'
import type { GitHubRepo } from '../../../src/content/crafting.js'
import { formatAbbreviatedDate, formatRelativeDate } from '#~/lib/dateFormatting'
import { GitFork, Star } from 'lucide-react'
import { useState } from 'react'
import { L, Text, UI } from '../__'

interface Props {
  repo: GitHubRepo
}

export const RepoCard: React.FC<Props> = ({ repo }) => {
  const [showRelative, setShowRelative] = useState(true)

  const relativeDate = formatRelativeDate(repo.pushedAt)
  const abbreviatedDate = formatAbbreviatedDate(repo.pushedAt)

  return (
    <UI.Card className={css({ padding: '4' })} tabIndex={0}>
      <L.Flex.Col>
        <L.Flex.ItemBox direction='column' grow>
          {/* Header with name */}
          <div>
            <Text.H3
              textStyle='heading.4'
              color='text.primary'
              transitionProperty='colors'
              transitionDuration='base'
              className='card-title'
            >
              {repo.name}
            </Text.H3>
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
          <Text.Text textStyle='body.base' color='text.secondary' marginBottom='5' flexGrow={1}>
            {repo.description || 'No description available'}
          </Text.Text>

          {/* Topics */}
          {repo.repositoryTopics.nodes.length > 0 && (
            <L.Flex.Row wrap gap='2' className={css({ marginBottom: '5' })}>
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
                  <UI.Link.Ext
                    href={`https://github.com/${
                      repo.url.split('github.com/')[1].split('/')[0]
                    }?tab=repositories&language=${repo.primaryLanguage.name.toLowerCase()}`}
                    variant='accent'
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    {repo.primaryLanguage.name}
                  </UI.Link.Ext>
                }
              />
            )}
            {repo.latestRelease && (
              <UI.MetadataRow
                label='Latest release'
                value={
                  <UI.Link.Ext
                    href={repo.latestRelease.url}
                    variant='accent'
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    {repo.latestRelease.tagName}
                  </UI.Link.Ext>
                }
              />
            )}
            {repo.defaultBranchRef && (
              <UI.MetadataRow
                label='Last commit'
                value={
                  <UI.Link.Ext
                    href={repo.defaultBranchRef.target.commitUrl}
                    variant='accent'
                    className={css({ cursor: 'pointer' })}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      setShowRelative(!showRelative)
                    }}
                  >
                    {showRelative ? relativeDate : abbreviatedDate}
                  </UI.Link.Ext>
                }
              />
            )}
          </L.Flex.Col>
        </L.Flex.ItemBox>
      </L.Flex.Col>
    </UI.Card>
  )
}

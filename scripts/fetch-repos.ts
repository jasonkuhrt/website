#!/usr/bin/env tsx

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { curatedRepos } from '../src/config/repos.js'

interface GitHubRepo {
  name: string
  description: string | null
  stargazerCount: number
  forkCount: number
  primaryLanguage: {
    name: string
    color: string
  } | null
  pushedAt: string
  url: string
  repositoryTopics: {
    nodes: Array<{
      topic: {
        name: string
      }
    }>
  }
  latestRelease: {
    tagName: string
    publishedAt: string
    url: string
  } | null
  defaultBranchRef: {
    target: {
      commitUrl: string
    }
  } | null
}

interface GraphQLResponse {
  data: Record<string, GitHubRepo>
  errors?: Array<{ message: string }>
}

const fetchRepoData = async (token: string): Promise<GitHubRepo[]> => {
  // Build GraphQL query with aliases for each repo
  const repoFragments = curatedRepos
    .map(
      (repo) => `
    ${repo}: repository(owner: "jasonkuhrt", name: "${repo}") {
      name
      description
      stargazerCount
      forkCount
      primaryLanguage {
        name
        color
      }
      pushedAt
      url
      repositoryTopics(first: 10) {
        nodes {
          topic {
            name
          }
        }
      }
      latestRelease {
        tagName
        publishedAt
        url
      }
      defaultBranchRef {
        target {
          ... on Commit {
            commitUrl
          }
        }
      }
    }
  `,
    )
    .join('\n')

  const query = `
    query GetCuratedRepos {
      ${repoFragments}
    }
  `

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}: ${response.statusText}`)
  }

  const result = (await response.json()) as GraphQLResponse

  if (result.errors) {
    throw new Error(`GitHub GraphQL API returned errors: ${result.errors.map((e) => e.message).join(', ')}`)
  }

  if (!result.data) {
    throw new Error('GitHub GraphQL API returned no data')
  }

  // Convert the aliased response object to an array
  const repos = Object.values(result.data).filter((repo): repo is GitHubRepo => repo !== null)

  if (repos.length === 0) {
    throw new Error('No repositories found in GitHub API response')
  }

  return repos
}

const main = async () => {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable is required')
    console.error('Run: gh auth token | xargs -I {} sh -c "GITHUB_TOKEN={} tsx scripts/fetch-repos.ts"')
    process.exit(1)
  }

  console.log('Fetching repository data from GitHub...')

  try {
    const repos = await fetchRepoData(token)

    const data = {
      fetchedAt: new Date().toISOString(),
      repos,
    }

    const outputPath = join(process.cwd(), 'data', 'repos.json')
    writeFileSync(outputPath, JSON.stringify(data, null, 2))

    console.log(`✓ Successfully fetched ${repos.length} repositories`)
    console.log(`✓ Data saved to ${outputPath}`)
    console.log(`✓ Fetched at: ${data.fetchedAt}`)
    console.log('\nRepositories:')
    repos.forEach((repo) => {
      console.log(`  - ${repo.name} (⭐ ${repo.stargazerCount})`)
    })
  } catch (error) {
    console.error('Error fetching repository data:', error)
    process.exit(1)
  }
}

main()

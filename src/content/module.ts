import { Continent, Explorers } from 'continent'
import * as S from 'effect/Schema'

// ============================================================================
// Shared Schemas
// ============================================================================

const PrimaryLanguage = S.Struct({
  name: S.String,
  color: S.String,
})

const LatestRelease = S.Struct({
  tagName: S.String,
  publishedAt: S.String,
  url: S.String,
})

const DefaultBranchRef = S.Struct({
  target: S.Struct({
    commitUrl: S.String,
  }),
})

// ============================================================================
// GitHub API Response Schemas
// ============================================================================

const RepositoryTopic = S.Struct({
  topic: S.Struct({
    name: S.String,
  }),
})

const GitHubRepo = S.Struct({
  name: S.String,
  description: S.NullOr(S.String),
  stargazerCount: S.Number,
  forkCount: S.Number,
  primaryLanguage: S.NullOr(PrimaryLanguage),
  pushedAt: S.String,
  url: S.String,
  repositoryTopics: S.Struct({
    nodes: S.Array(RepositoryTopic),
  }),
  latestRelease: S.NullOr(LatestRelease),
  defaultBranchRef: S.NullOr(DefaultBranchRef),
})

export type GitHubRepo = S.Schema.Type<typeof GitHubRepo>

// ============================================================================
// GitHub API Fetching
// ============================================================================

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

const getGitHubToken = () => {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error(
      'GITHUB_TOKEN environment variable is required.\n' +
        'Run: gh auth token | xargs -I {} sh -c "GITHUB_TOKEN={} pnpm dev"',
    )
  }
  return token
}

const repoFragment = `
  name
  description
  stargazerCount
  forkCount
  primaryLanguage { name color }
  pushedAt
  url
  repositoryTopics(first: 10) { nodes { topic { name } } }
  latestRelease { tagName publishedAt url }
  defaultBranchRef { target { ... on Commit { commitUrl } } }
`

/**
 * Fetch a single repo from GitHub API.
 * Used by loadOne for incremental cache updates.
 */
const fetchGitHubRepo = async (owner: string, name: string): Promise<GitHubRepo> => {
  const token = getGitHubToken()

  const query = `
    query GetRepo($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        ${repoFragment}
      }
    }
  `

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { owner, name } }),
  })

  if (!response.ok) throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`)

  const result = (await response.json()) as {
    data?: { repository: GitHubRepo }
    errors?: { message: string }[]
  }

  if (result.errors) throw new Error(`GitHub GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`)

  if (!result.data?.repository) throw new Error(`Repository ${owner}/${name} not found`)

  return result.data.repository
}

/**
 * Batch fetch repos from GitHub API.
 * Uses aliased queries to fetch all repos in a single request.
 * Used by loadAll for cold cache efficiency.
 */
const fetchGitHubRepos = async (
  repos: { owner: string; name: string }[],
): Promise<Map<string, GitHubRepo>> => {
  const token = getGitHubToken()

  // Build aliased query for all repos
  const fragments = repos
    .map(
      (r, i) => `
    repo${i}: repository(owner: "${r.owner}", name: "${r.name}") {
      ${repoFragment}
    }
  `,
    )
    .join('\n')

  const query = `query GetRepos { ${fragments} }`

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`)

  const result = (await response.json()) as {
    data?: Record<string, GitHubRepo | null>
    errors?: { message: string }[]
  }

  if (result.errors) throw new Error(`GitHub GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`)

  if (!result.data) throw new Error('No data returned from GitHub API')

  // Map results by repo full name
  const resultMap = new Map<string, GitHubRepo>()
  repos.forEach((r, i) => {
    const repoData = result.data![`repo${i}`]
    if (repoData) resultMap.set(`${r.owner}/${r.name}`, repoData)
  })

  return resultMap
}

/**
 * Transform GitHub repo data to output format.
 */
const transformRepoData = (
  entry: { repo: string; featured?: boolean },
  owner: string,
  name: string,
  repoData: GitHubRepo,
) => ({
  id: entry.repo,
  repo: entry.repo,
  owner,
  name,
  featured: entry.featured ?? false,
  description: repoData.description,
  stargazerCount: repoData.stargazerCount,
  forkCount: repoData.forkCount,
  primaryLanguage: repoData.primaryLanguage,
  pushedAt: repoData.pushedAt,
  url: repoData.url,
  topics: repoData.repositoryTopics.nodes.map((n) => n.topic.name),
  latestRelease: repoData.latestRelease,
  defaultBranchRef: repoData.defaultBranchRef,
})

// ============================================================================
// Module Content Definition
// ============================================================================

/**
 * Module content definition.
 *
 * Module entries are defined in content/crafting/manifest.ts.
 * Each entry is a GitHub repository that gets enriched with API data.
 *
 * Uses smart dispatch:
 * - loadAll: Batch fetch when cache is cold (single GraphQL request)
 * - loadOne: Individual fetch when cache is warm (incremental updates)
 */
export const Module = Continent.define({
  name: 'module',
  input: S.Struct({
    repo: S.String.pipe(S.pattern(/^[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/)),
    featured: S.optional(S.Boolean),
  }),
  loaded: S.Struct({
    id: S.String,
    repo: S.String,
    owner: S.String,
    name: S.String,
    featured: S.Boolean,
    description: S.NullOr(S.String),
    stargazerCount: S.Number,
    forkCount: S.Number,
    primaryLanguage: S.NullOr(PrimaryLanguage),
    pushedAt: S.String,
    url: S.String,
    topics: S.Array(S.String),
    latestRelease: S.NullOr(LatestRelease),
    defaultBranchRef: S.NullOr(DefaultBranchRef),
  }),
  explorer: Explorers.Manifest.create(),
  async loadOne(exploration) {
    const { entry } = exploration

    const [owner, name] = entry.repo.split('/')
    if (!owner || !name) throw new Error(`Invalid repo format: ${entry.repo}. Expected "owner/name"`)

    const repoData = await fetchGitHubRepo(owner, name)
    return transformRepoData(entry, owner, name, repoData)
  },
  async loadAll(explorations) {
    // Parse all repos
    const repoInfos = explorations.map((e) => {
      const [owner, name] = e.entry.repo.split('/')
      if (!owner || !name) throw new Error(`Invalid repo format: ${e.entry.repo}. Expected "owner/name"`)
      return { owner, name, entry: e.entry }
    })

    // Batch fetch all repos in single GraphQL request
    const repoMap = await fetchGitHubRepos(repoInfos.map((r) => ({ owner: r.owner, name: r.name })))

    // Transform results
    return repoInfos.map((r) => {
      const repoData = repoMap.get(`${r.owner}/${r.name}`)
      if (!repoData) throw new Error(`No GitHub data returned for repo "${r.entry.repo}"`)
      return transformRepoData(r.entry, r.owner, r.name, repoData)
    })
  },
})

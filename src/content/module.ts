import { Content, Store } from 'continent'
import * as S from 'effect/Schema'

// ============================================================================
// RepoId Schema (string "owner/name" → { owner, name })
// ============================================================================

const RepoId = S.transform(
  S.String.pipe(S.pattern(/^[^/]+\/[^/]+$/)),
  S.Struct({ owner: S.String, name: S.String }),
  {
    strict: true,
    decode: (s) => {
      const [owner, name] = s.split('/')
      return { owner: owner!, name: name! }
    },
    encode: ({ owner, name }) => `${owner}/${name}`,
  },
)

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

// ============================================================================
// Module Content Definition
// ============================================================================

const Module = Content('module', {
  store: Store.js({
    path: 'content/module.ts',
    schema: S.Struct({
      repo: RepoId,
      featured: S.optional(S.Boolean),
    }),
  }),
  schema: {
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
  },
  uniqueKeys: ['repo'],
  async map(source) {
    const repoString = `${source.repo.owner}/${source.repo.name}`
    const repoData = await fetchGitHubRepo(source.repo.owner, source.repo.name)
    return {
      repo: repoString,
      owner: source.repo.owner,
      name: source.repo.name,
      featured: source.featured ?? false,
      description: repoData.description,
      stargazerCount: repoData.stargazerCount,
      forkCount: repoData.forkCount,
      primaryLanguage: repoData.primaryLanguage,
      pushedAt: repoData.pushedAt,
      url: repoData.url,
      topics: repoData.repositoryTopics.nodes.map((n) => n.topic.name),
      latestRelease: repoData.latestRelease,
      defaultBranchRef: repoData.defaultBranchRef,
    }
  },
})
export default Module
export type Module = typeof Module.Type

import * as S from 'effect/Schema'

/**
 * GitHub Repository Schema
 *
 * Type-safe schema for GitHub repository data fetched from GraphQL API.
 * This data is cached and refreshed periodically by the fetch-repos script.
 */

const PrimaryLanguage = S.Struct({
  name: S.String,
  color: S.String,
})

const RepositoryTopic = S.Struct({
  topic: S.Struct({
    name: S.String,
  }),
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

export class GitHubRepo extends S.Class<GitHubRepo>('GitHubRepo')({
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
}) {}

/**
 * GitHub Data Schema
 *
 * Container for cached GitHub repository data with timestamp.
 */
export class GitHubData extends S.Class<GitHubData>('GitHubData')({
  fetchedAt: S.String,
  repos: S.Array(GitHubRepo),
}) {}

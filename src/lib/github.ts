import cachedData from '../../data/repos.json'

export interface GitHubRepo {
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

export interface GitHubData {
  fetchedAt: string
  repos: GitHubRepo[]
}

/**
 * Get repository data from cached JSON file.
 *
 * The data is fetched and cached by running: pnpm run fetch-repos
 * This avoids needing GitHub API access during builds (e.g., in CI).
 */
export const getRepoData = (): GitHubRepo[] => {
  return (cachedData as GitHubData).repos
}

/**
 * Get the timestamp when repository data was last fetched.
 */
export const getRepoDataFetchedAt = (): string => {
  return (cachedData as GitHubData).fetchedAt
}

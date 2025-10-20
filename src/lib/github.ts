import cachedRepos from '../../data/repos.json'

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
}

/**
 * Get repository data from cached JSON file.
 *
 * The data is fetched and cached by running: pnpm run fetch-repos
 * This avoids needing GitHub API access during builds (e.g., in CI).
 */
export const getRepoData = (): GitHubRepo[] => {
  return cachedRepos as GitHubRepo[]
}

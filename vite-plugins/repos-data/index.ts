import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { fetchAndWriteRepos } from './fetch.js'

export function reposDataPlugin(): Plugin {
  const reposPath = path.resolve(process.cwd(), 'app/data/repos.ts')

  return {
    name: 'vite-plugin-repos-data',

    async buildStart() {
      // Check if repos.ts exists, if not fetch it
      if (!fs.existsSync(reposPath)) {
        console.log('\n📦 repos.ts not found, fetching from GitHub API...\n')

        try {
          await fetchAndWriteRepos()
          console.log('\n✅ Successfully generated repos.ts\n')
        } catch (error) {
          console.error('\n❌ Failed to fetch repos data:', error)
          console.error(
            '\nMake sure GITHUB_TOKEN is set: gh auth token | xargs -I {} sh -c "GITHUB_TOKEN={} pnpm dev"'
          )
          throw error
        }
      }
    },
  }
}

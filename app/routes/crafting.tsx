import { F, L } from '../components/__'
import { fetchedAt, repos } from '../data/repos'
import { createPageMeta } from '../lib/metaHelpers'
import type { Route } from './+types/crafting'

export const meta: Route.MetaFunction = () =>
  createPageMeta('Crafting', 'Open source projects by Jason Kuhrt')

export default function Crafting() {
  return (
    <L.PageSection width="standard">
      <L.Grid autoFit minColumnWidth='320px' gap='6'>
        <F.GitHubProfileCard />
        {repos.map((repo) => <F.RepoCard key={repo.name} repo={repo} />)}
      </L.Grid>
      <L.Flex.Row justify='end' marginTop='6'>
        <F.RepoRefreshTimer fetchedAt={fetchedAt} />
      </L.Flex.Row>
    </L.PageSection>
  )
}

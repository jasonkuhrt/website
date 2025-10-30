import { css } from '../../styled-system/css'
import { L, F } from '../components/__'
import { repos, fetchedAt } from '../data/repos'
import type { Route } from './+types/crafting'

const refreshTimer = css({
  marginTop: '6',
  display: 'flex',
  justifyContent: 'flex-end',
})

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Crafting – Jason Kuhrt' },
    {
      name: 'description',
      content: 'Open source projects by Jason Kuhrt',
    },
  ]
}

export default function Crafting() {

  return (
    <L.Section spacing='xl'>
      <L.Container variant='standard'>
        <L.Grid autoFit minColumnWidth='320px' gap='6'>
          <F.GitHubProfileCard />
          {repos.map((repo) => <F.RepoCard key={repo.name} repo={repo} />)}
        </L.Grid>
        <div className={refreshTimer}>
          <F.RepoRefreshTimer fetchedAt={fetchedAt} />
        </div>
      </L.Container>
    </L.Section>
  )
}

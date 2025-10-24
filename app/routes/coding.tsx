import { Container } from '../components/Container'
import { Section } from '../components/Section'
import { Grid } from '../components/Grid'
import { GitHubProfileCard } from '../components/GitHubProfileCard'
import { RepoCard } from '../components/RepoCard'
import { RepoRefreshTimer } from '../components/RepoRefreshTimer'
import { getRepoData, getRepoDataFetchedAt } from '../lib/github'
import type { Route } from './+types/coding'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Code – Jason Kuhrt' },
    {
      name: 'description',
      content: 'Open source projects by Jason Kuhrt',
    },
  ]
}

export default function Coding() {
  const repos = getRepoData()
  const fetchedAt = getRepoDataFetchedAt()

  return (
    <Section spacing="xl">
      <Container variant="standard">
        <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
          <GitHubProfileCard />
          {repos.map((repo) => <RepoCard key={repo.name} repo={repo} />)}
        </Grid>
        <div className="mt-6 flex justify-end">
          <RepoRefreshTimer fetchedAt={fetchedAt} />
        </div>
      </Container>
    </Section>
  )
}

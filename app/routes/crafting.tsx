import { Container } from '../components/Container'
import { GitHubProfileCard } from '../components/GitHubProfileCard'
import { Grid } from '../components/Grid'
import { RepoCard } from '../components/RepoCard'
import { RepoRefreshTimer } from '../components/RepoRefreshTimer'
import { Section } from '../components/Section'
import { getRepoData, getRepoDataFetchedAt } from '../lib/github'
import type { Route } from './+types/crafting'
import styles from './crafting.module.css'

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
  const repos = getRepoData()
  const fetchedAt = getRepoDataFetchedAt()

  return (
    <Section spacing='xl'>
      <Container variant='standard'>
        <Grid minWidth='320px' gap='lg'>
          <GitHubProfileCard />
          {repos.map((repo) => <RepoCard key={repo.name} repo={repo} />)}
        </Grid>
        <div className={styles.refreshTimer}>
          <RepoRefreshTimer fetchedAt={fetchedAt} />
        </div>
      </Container>
    </Section>
  )
}

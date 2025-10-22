<script lang="ts">
  import Section from '$lib/components/Section.svelte'
  import Container from '$lib/components/Container.svelte'
  import Grid from '$lib/components/Grid.svelte'
  import RepoCard from '$lib/components/RepoCard.svelte'
  import GitHubProfileCard from '$lib/components/GitHubProfileCard.svelte'
  import RepoRefreshTimer from '$lib/components/RepoRefreshTimer.svelte'
  import { getRepoData, getRepoDataFetchedAt } from '$lib/github'

  const repos = getRepoData()
  const fetchedAt = getRepoDataFetchedAt()
</script>

<svelte:head>
  <title>Code – Kuhrt</title>
  <meta name="description" content="Open source projects by Jason Kuhrt" />
</svelte:head>

<Section spacing="xl">
  <Container variant="standard">
    <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
      <GitHubProfileCard />
      {#each repos as repo (repo.name)}
        <RepoCard {repo} />
      {/each}
    </Grid>
    <div class="mt-6 flex justify-end">
      <RepoRefreshTimer {fetchedAt} />
    </div>
  </Container>
</Section>

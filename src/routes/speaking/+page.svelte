<script lang="ts">
  import { Github, Link, Play, Twitter } from 'lucide-svelte'
  import Section from '$lib/components/Section.svelte'
  import Container from '$lib/components/Container.svelte'
  import { talks } from '../../consts'
</script>

<svelte:head>
  <title>Speaking – Kuhrt</title>
  <meta name="description" content="Talks and presentations by Jason Kuhrt" />
</svelte:head>

<Section spacing="xl">
  <Container variant="content">
    <div class="space-y-4">
      {#each talks as talk}
        <article class="border-b border-gray-200 dark:border-gray-800 pb-8 last:border-b-0 last:pb-0">
          <div class="flex flex-col sm:flex-row sm:items-baseline sm:gap-6 mb-2">
            <time
              class="text-sm text-gray-500 dark:text-gray-400 font-mono flex-shrink-0 mb-1 sm:mb-0 sm:w-32"
            >
              {talk.date}
            </time>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {talk.title}
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:ml-38">@ {talk.venue}</div>
          <div class="flex gap-3 sm:ml-38">
            {#if talk.links.repo}
              <a
                class="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                href={talk.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                title="Repository"
              >
                <Github class="w-4 h-4" />
              </a>
            {/if}
            {#if talk.links.info}
              <a
                class="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                href={talk.links.info}
                target="_blank"
                rel="noopener noreferrer"
                title="Event Info"
              >
                <Link class="w-4 h-4" />
              </a>
            {/if}
            {#if talk.links.recording}
              <a
                class="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                href={talk.links.recording}
                target="_blank"
                rel="noopener noreferrer"
                title="Recording"
              >
                <Play class="w-4 h-4" />
              </a>
            {/if}
            {#if talk.links.twitter}
              <a
                class="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                href={talk.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
              >
                <Twitter class="w-4 h-4" />
              </a>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </Container>
</Section>

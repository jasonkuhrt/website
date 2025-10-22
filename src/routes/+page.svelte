<script lang="ts">
  import { MapPin } from 'lucide-svelte'
  import { socialLinks } from '../consts'
  import Section from '$lib/components/Section.svelte'
  import Container from '$lib/components/Container.svelte'
  import { iconComponents } from '$lib/utils/icons'
</script>

<svelte:head>
  <title>Kuhrt</title>
  <meta name="description" content="Personal website of Jason Kuhrt" />
</svelte:head>

<Section spacing="xl">
  <Container variant="content" class="flex flex-col items-center justify-center min-h-[60vh]">
    <!-- Avatar -->
    <div class="rounded-full overflow-hidden w-32 h-32 mb-8 ring-1 ring-gray-200 dark:ring-gray-800">
      <img
        src="/images/avatar2@1x.jpg"
        alt="Profile picture of Jason Kuhrt"
        width="128"
        height="128"
        class="object-cover"
      />
    </div>

    <!-- Name -->
    <h1 class="text-5xl font-bold tracking-tight mb-4">Jason Kuhrt</h1>

    <!-- Bio -->
    <p class="text-lg text-center max-w-md mb-2">Working in open source, open to opportunities.</p>

    <!-- Location -->
    <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-8">
      <MapPin class="w-4 h-4" />
      <span>Montreal, Quebec, Canada</span>
    </div>

    <!-- Social Links -->
    <div class="flex gap-4">
      {#each socialLinks as socialLink}
        <a
          rel="me"
          href={socialLink.href}
          title={socialLink.title}
          class="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          target="_blank"
        >
          {#if iconComponents[socialLink.icon]}
            <svelte:component this={iconComponents[socialLink.icon]} class="w-5 h-5" />
          {/if}
        </a>
      {/each}
    </div>
  </Container>
</Section>

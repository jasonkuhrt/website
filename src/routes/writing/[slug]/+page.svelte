<script lang="ts">
  import Section from '$lib/components/Section.svelte'
  import { format } from 'date-fns'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  const Content = $derived(data.content)
</script>

<svelte:head>
  <title>{data.metadata.title} – Kuhrt</title>
  <meta name="description" content={data.metadata.title} />
</svelte:head>

<Section spacing="xl">
  <div class="container">
    <article class="max-w-3xl mx-auto">
      <header class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
        <h1 class="text-4xl font-bold mb-4">{data.metadata.title}</h1>
        <time datetime={data.metadata.date} class="text-sm text-gray-500 dark:text-gray-400 font-mono">
          {format(new Date(data.metadata.date), 'MMMM dd, yyyy')}
        </time>
      </header>

      <div class="prose prose-lg dark:prose-invert max-w-none">
        <Content />
      </div>
    </article>
  </div>
</Section>

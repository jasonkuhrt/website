<script lang="ts">
  import Section from '$lib/components/Section.svelte'
  import { format } from 'date-fns'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>Writing – Kuhrt</title>
  <meta name="description" content="Writing by Jason Kuhrt" />
</svelte:head>

<Section spacing="xl">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <div class="space-y-8">
        {#each data.posts as post}
          <article class="group">
            <a
              href={`/writing/${post.slug}`}
              class="block border-b border-gray-200 dark:border-gray-800 pb-8 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div class="flex flex-col sm:flex-row sm:items-baseline sm:gap-6">
                <time
                  datetime={post.date.toISOString()}
                  class="text-sm text-gray-500 dark:text-gray-400 font-mono flex-shrink-0 mb-2 sm:mb-0 sm:w-32"
                >
                  {format(post.date, 'LLL dd yyyy')}
                </time>
                <h2
                  class="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </h2>
              </div>
            </a>
          </article>
        {/each}
      </div>
    </div>
  </div>
</Section>

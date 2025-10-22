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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
      <!-- Essays Column -->
      <div>
        <h2 class="text-2xl font-bold mb-6">Essays</h2>
        <div class="space-y-6">
          {#each data.essays as post}
            <article class="group">
              <a
                href={`/writing/${post.slug}`}
                class="block border-b border-gray-200 dark:border-gray-800 pb-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <time
                  datetime={post.date.toISOString()}
                  class="text-xs text-gray-500 dark:text-gray-400 font-mono block mb-2"
                >
                  {format(post.date, 'LLL dd yyyy')}
                </time>
                <h3
                  class="text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </h3>
              </a>
            </article>
          {/each}
        </div>
      </div>

      <!-- Logs Column -->
      <div>
        <h2 class="text-2xl font-bold mb-6">Logs</h2>
        <div class="space-y-6">
          {#each data.logs as post}
            <article class="group">
              <a
                href={`/writing/${post.slug}`}
                class="block border-b border-gray-200 dark:border-gray-800 pb-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <time
                  datetime={post.date.toISOString()}
                  class="text-xs text-gray-500 dark:text-gray-400 font-mono block mb-2"
                >
                  {format(post.date, 'LLL dd yyyy')}
                </time>
                <h3
                  class="text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </h3>
              </a>
            </article>
          {/each}
        </div>
      </div>

      <!-- TIL Column -->
      <div>
        <h2 class="text-2xl font-bold mb-6">Today I Learned</h2>
        <div class="space-y-6">
          {#each data.til as post}
            <article class="group">
              <a
                href={`/writing/${post.slug}`}
                class="block border-b border-gray-200 dark:border-gray-800 pb-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <time
                  datetime={post.date.toISOString()}
                  class="text-xs text-gray-500 dark:text-gray-400 font-mono block mb-2"
                >
                  {format(post.date, 'LLL dd yyyy')}
                </time>
                <h3
                  class="text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </h3>
              </a>
            </article>
          {/each}
        </div>
      </div>
    </div>
  </div>
</Section>

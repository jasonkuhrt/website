<script lang="ts">
  import { Star, GitFork } from 'lucide-svelte'
  import type { GitHubRepo } from '$lib/github'
  import { format } from 'date-fns'

  interface Props {
    repo: GitHubRepo
  }

  let { repo }: Props = $props()

  // Format the last updated date (relative)
  const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'today'
    if (diffInDays === 1) return 'yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  // Format abbreviated date
  const formatAbbreviatedDate = (dateString: string): string => {
    return format(new Date(dateString), 'MMM d, yyyy')
  }

  const relativeDate = formatRelativeDate(repo.pushedAt)
  const abbreviatedDate = formatAbbreviatedDate(repo.pushedAt)

  let showRelative = $state(true)
</script>

<div
  class="flex flex-col h-full group border border-gray-200 dark:border-gray-800 rounded p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
>
  <a href={repo.url} target="_blank" rel="noopener noreferrer" class="flex flex-col flex-grow">
    <!-- Header with name and stats -->
    <div class="flex items-center justify-between mb-2">
      <h3
        class="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
      >
        {repo.name}
      </h3>
      <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">
        <div class="flex items-center gap-1" title="Stars">
          <Star class="w-4 h-4" />
          <span>{repo.stargazerCount}</span>
        </div>
        <div class="flex items-center gap-1" title="Forks">
          <GitFork class="w-4 h-4" />
          <span>{repo.forkCount}</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">
      {repo.description || 'No description available'}
    </p>

    <!-- Topics -->
    {#if repo.repositoryTopics.nodes.length > 0}
      <div class="flex flex-wrap gap-1.5 mb-3">
        {#each repo.repositoryTopics.nodes as { topic }}
          <a
            href="https://github.com/topics/{topic.name}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            onclick={(e) => e.stopPropagation()}
          >
            {topic.name}
          </a>
        {/each}
      </div>
    {/if}

    <!-- Compact data list -->
    <dl class="space-y-1 text-xs text-gray-500 dark:text-gray-400">
      {#if repo.primaryLanguage}
        <div class="flex items-center">
          <dt class="opacity-60 flex-shrink-0">Language</dt>
          <div
            class="flex-grow mx-2 border-b border-dotted border-gray-300 dark:border-gray-700 opacity-30"
          ></div>
          <dd class="flex-shrink-0 truncate text-right">
            <a
              href="https://github.com/{repo.url
                .split('github.com/')[1]
                .split('/')[0]}?tab=repositories&language={repo.primaryLanguage.name.toLowerCase()}"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onclick={(e) => e.stopPropagation()}
            >
              {repo.primaryLanguage.name}
            </a>
          </dd>
        </div>
      {/if}
      {#if repo.latestRelease}
        <div class="flex items-center">
          <dt class="opacity-60 flex-shrink-0">Latest release</dt>
          <div
            class="flex-grow mx-2 border-b border-dotted border-gray-300 dark:border-gray-700 opacity-30"
          ></div>
          <dd class="flex-shrink-0 truncate text-right">
            <a
              href={repo.latestRelease.url}
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onclick={(e) => e.stopPropagation()}
            >
              {repo.latestRelease.tagName}
            </a>
          </dd>
        </div>
      {/if}
      {#if repo.defaultBranchRef}
        <div class="flex items-center">
          <dt class="opacity-60 flex-shrink-0">Last commit</dt>
          <div
            class="flex-grow mx-2 border-b border-dotted border-gray-300 dark:border-gray-700 opacity-30"
          ></div>
          <dd class="flex-shrink-0 text-right">
            <a
              href={repo.defaultBranchRef.target.commitUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onclick={(e) => {
                e.stopPropagation()
                showRelative = !showRelative
              }}
            >
              {showRelative ? relativeDate : abbreviatedDate}
            </a>
          </dd>
        </div>
      {/if}
    </dl>
  </a>
</div>

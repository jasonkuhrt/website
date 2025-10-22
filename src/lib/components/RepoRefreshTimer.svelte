<script lang="ts">
  import { onMount } from 'svelte'

  let { fetchedAt }: { fetchedAt: string } = $props()

  let countdown = $state('calculating...')

  function updateCountdown() {
    const fetchedAtDate = new Date(fetchedAt)
    const nextRefresh = new Date(fetchedAtDate.getTime() + 24 * 60 * 60 * 1000) // 24 hours later
    const now = new Date()
    const diff = nextRefresh.getTime() - now.getTime()

    if (diff <= 0) {
      countdown = 'refreshing soon...'
      return
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    countdown = `${hours}h ${minutes}m ${seconds}s`
  }

  onMount(() => {
    // Update immediately
    updateCountdown()

    // Update every second
    const interval = setInterval(updateCountdown, 1000)

    // Clean up interval on unmount (fixes memory leak!)
    return () => {
      clearInterval(interval)
    }
  })
</script>

<div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
  <span class="opacity-60">Data refreshes in:</span>
  <span class="font-mono">{countdown}</span>
</div>

<script lang="ts">
  import '@fontsource/space-mono/400.css'
  import '@fontsource/space-mono/700.css'
  import '../styles/global.css'
  import Header from '$lib/components/Header.svelte'
  import { onNavigate } from '$app/navigation'

  let { children } = $props()

  onNavigate((navigation) => {
    if (!document.startViewTransition) return

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

<svelte:head>
  <meta name="generator" content="SvelteKit" />
</svelte:head>

<Header />
<main class="pt-20" style="view-transition-name: main-content">
  {@render children()}
</main>

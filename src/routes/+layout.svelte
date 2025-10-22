<script lang="ts">
  import '@fontsource/space-mono/400.css'
  import '@fontsource/space-mono/700.css'
  import '../styles/global.css'
  import Header from '$lib/components/Header.svelte'
  import SettingsButton from '$lib/components/settings/SettingsButton.svelte'
  import { onNavigate } from '$app/navigation'
  import { settings } from '$lib/stores/settings.svelte'

  // Initialize settings store effects during component initialization
  settings.initializeEffects()

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

<!-- Settings button pinned to bottom left -->
<div class="fixed bottom-6 left-6 z-40">
  <SettingsButton />
</div>

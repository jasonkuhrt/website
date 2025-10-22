<script lang="ts">
  import '@fontsource/space-mono/400.css'
  import '@fontsource/space-mono/700.css'
  import '../styles/global.css'
  import Header from '$lib/components/Header.svelte'

  let { children } = $props()
</script>

<svelte:head>
  <meta name="generator" content="SvelteKit" />
</svelte:head>

<Header />
<main class="pt-20">
  {@render children()}
</main>

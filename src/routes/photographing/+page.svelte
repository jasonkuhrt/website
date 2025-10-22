<script lang="ts">
  import PhotoGrid from '$lib/components/PhotoGrid.svelte'
  import photoData from '$lib/data/photographing/photos.json'
  import type { PhotoCollection } from '$lib/data/photographing/types'

  const data = photoData as PhotoCollection
  const { photos } = data
</script>

<svelte:head>
  <title>Photographing – Kuhrt</title>
  <meta name="description" content="Photography by Jason Kuhrt" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  {#if photos.length > 0}
    <PhotoGrid {photos} />
  {/if}
</div>

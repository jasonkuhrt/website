<script lang="ts">
  import type { Photo } from '$data/photographing/types'
  import { Images, Play } from 'lucide-svelte'

  let { photos }: { photos: Photo[] } = $props()

  let expandedId = $state<string | null>(null)
  let dimOthers = $state(false)
  let hoveredSeriesId = $state<string | null>(null)

  function toggleSeries(photoId: string, event: MouseEvent) {
    // Don't toggle if clicking on video or its controls
    const target = event.target as HTMLElement
    if (target && (target.tagName === 'VIDEO' || target.closest('video'))) {
      return
    }

    event.preventDefault()

    if (expandedId === photoId) {
      // Collapse
      expandedId = null
      dimOthers = false
      hoveredSeriesId = null
    } else {
      // Expand
      expandedId = photoId
      dimOthers = true
    }
  }

  function handleSeriesIconEnter(photoId: string) {
    if (expandedId === photoId) {
      hoveredSeriesId = photoId
    }
  }

  function handleSeriesIconLeave() {
    hoveredSeriesId = null
  }

  function shouldDim(photo: Photo): boolean {
    return dimOthers && hoveredSeriesId !== null && expandedId !== photo.id
  }

  function getExpandedMedia(photo: Photo) {
    return photo.media.slice(1) // Skip first media item (already shown)
  }
</script>

<div class="photo-grid">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px">
    {#each photos as photo (photo.id)}
      <!-- Main photo cell -->
      <div class="photo-item" class:opacity-10={shouldDim(photo)} style="transition: opacity 0.2s">
        {#if photo.type === 'series'}
          <button
            type="button"
            class="series-toggle block w-full text-left"
            onclick={(e) => toggleSeries(photo.id, e)}
          >
            <!-- Photo Cell Content -->
            <div class="photo-cell group relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
              {#if photo.media[0].type === 'image'}
                <img
                  src={photo.media[0].path}
                  alt={photo.caption || 'Photo'}
                  class="block h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              {:else}
                <video src={photo.media[0].path} class="block h-full w-full object-cover" controls muted></video>
              {/if}

              <!-- Series indicator -->
              {#if photo.media.length > 1}
                <div
                  class="series-icon absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 pointer-events-none"
                  onmouseenter={() => handleSeriesIconEnter(photo.id)}
                  onmouseleave={handleSeriesIconLeave}
                  aria-hidden="true"
                >
                  <Images class="w-4 h-4" />
                </div>
              {/if}

              <!-- Video indicator -->
              {#if photo.media[0].type === 'video'}
                <div
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-4 pointer-events-none"
                >
                  <Play class="w-8 h-8 fill-current" />
                </div>
              {/if}
            </div>
          </button>
        {:else}
          <!-- Non-series photo (single or video) -->
          <div class="photo-cell group relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
            {#if photo.media[0].type === 'image'}
              <img
                src={photo.media[0].path}
                alt={photo.caption || 'Photo'}
                class="block h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            {:else}
              <video src={photo.media[0].path} class="block h-full w-full object-cover" controls muted></video>
            {/if}

            <!-- Video indicator -->
            {#if photo.type === 'video'}
              <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-4 pointer-events-none"
              >
                <Play class="w-8 h-8 fill-current" />
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Expanded media items (shown after main photo) -->
      {#if expandedId === photo.id}
        {#each getExpandedMedia(photo) as mediaItem, index (index)}
          <div class="photo-item aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
            {#if mediaItem.type === 'image'}
              <img
                src={mediaItem.path}
                alt={`${photo.caption || 'Photo'} - ${index + 2}`}
                class="block h-full w-full object-cover"
              />
            {:else}
              <video src={mediaItem.path} class="block h-full w-full object-cover" controls muted></video>
            {/if}
          </div>
        {/each}

        <!-- Caption cell -->
        {#if photo.caption}
          <div class="photo-item bg-gray-50 dark:bg-gray-900 p-4 flex flex-col justify-center">
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">{photo.caption}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {new Date(photo.date).toLocaleDateString()}
            </p>
          </div>
        {/if}
      {/if}
    {/each}
  </div>
</div>

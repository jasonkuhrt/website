<script lang="ts">
  // Photos organized by category
  // Naming convention: <num>[-<char>].<ext>
  // Photos with same <num> are in same group (only one per group should be shown)
  const professionalPhotos = ['1.jpeg', '2-a.jpg', '2-b.jpg', '4.jpg', '5.jpeg']
  const hikingPhotos = ['1.jpeg', '2.jpeg', '4-a.jpeg', '4-b.jpeg', '6.jpeg', '8.jpeg', '9.jpeg']

  // Single fixed layout: 4 photos in a 4x2 grid
  // [colStart, colEnd, rowStart, rowEnd]
  const gridPositions = [
    [1, 3, 1, 3], // large: cols 1-2, rows 1-2
    [3, 5, 1, 2], // wide: cols 3-4, row 1
    [3, 4, 2, 3], // square: col 3, row 2
    [4, 5, 2, 3], // square: col 4, row 2
  ]

  type PhotoItem = {
    path: string
    category: 'professional' | 'hiking'
    group: string
    gridColumn: string
    gridRow: string
  }

  // Extract group number from filename (e.g., "2-a.jpg" -> "2", "4.jpeg" -> "4")
  const getGroupNum = (filename: string) => filename.split(/[-\.]/)[0]

  // Combine all photos
  const allPhotos = [
    ...professionalPhotos.map((p) => ({
      path: `web-res/professional/${p}`,
      category: 'professional' as const,
      group: getGroupNum(p),
    })),
    ...hikingPhotos.map((p) => ({
      path: `web-res/hiking/${p}`,
      category: 'hiking' as const,
      group: getGroupNum(p),
    })),
  ]

  // Shuffle helper
  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // Group photos by group number
  function groupByGroupNum(photos: typeof allPhotos) {
    const groups: Record<string, typeof allPhotos> = {}
    photos.forEach((photo) => {
      if (!groups[photo.group]) groups[photo.group] = []
      groups[photo.group].push(photo)
    })
    return groups
  }

  // Select N photos from a category, one per group
  function selectFromCategory(photos: typeof allPhotos, count: number) {
    const grouped = groupByGroupNum(photos)
    const groupKeys = Object.keys(grouped)
    const selectedGroups = shuffle(groupKeys).slice(0, count)

    // From each selected group, pick one random photo
    return selectedGroups.map((groupKey) => {
      const groupPhotos = grouped[groupKey]
      return groupPhotos[Math.floor(Math.random() * groupPhotos.length)]
    })
  }

  // Randomize photos function
  function getRandomizedPhotos(): PhotoItem[] {
    const professional = allPhotos.filter((p) => p.category === 'professional')
    const hiking = allPhotos.filter((p) => p.category === 'hiking')

    // Pick 4 photos with even split (2 from each category)
    // Ensure only one photo per group number
    const selectedPro = selectFromCategory(professional, 2)
    const selectedHike = selectFromCategory(hiking, 2)
    const selected = shuffle([...selectedPro, ...selectedHike])

    // Apply grid positioning
    return selected.map((photo, i) => {
      const [colStart, colEnd, rowStart, rowEnd] = gridPositions[i]
      return {
        ...photo,
        gridColumn: `${colStart} / ${colEnd}`,
        gridRow: `${rowStart} / ${rowEnd}`,
      }
    })
  }

  // Initialize with first 4 photos in a deterministic order for SSR
  // This prevents hydration mismatches
  const getInitialPhotos = (): PhotoItem[] => {
    const professional = allPhotos.filter((p) => p.category === 'professional').slice(0, 2)
    const hiking = allPhotos.filter((p) => p.category === 'hiking').slice(0, 2)
    const selected = [...professional, ...hiking]

    return selected.map((photo, i) => {
      const [colStart, colEnd, rowStart, rowEnd] = gridPositions[i]
      return {
        ...photo,
        gridColumn: `${colStart} / ${colEnd}`,
        gridRow: `${rowStart} / ${rowEnd}`,
      }
    })
  }

  // Reactive state for displayed photos
  let displayedPhotos = $state(getInitialPhotos())
  let mounted = $state(false)

  // Randomize photos only on the client after mounting
  $effect(() => {
    if (!mounted) {
      mounted = true
      displayedPhotos = getRandomizedPhotos()
    }
  })

  // Re-randomize on click
  function handleClick() {
    displayedPhotos = getRandomizedPhotos()
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }
</script>

<div
  class="photo-gallery container-wide"
  onclick={handleClick}
  onkeydown={handleKeyDown}
  role="button"
  tabindex="0"
>
  {#each displayedPhotos as photo (photo.path)}
    <div class="photo-item" style="grid-column: {photo.gridColumn}; grid-row: {photo.gridRow}">
      <img src={`/bio/${photo.path}`} alt="" loading="lazy" />
    </div>
  {/each}
</div>

<style>
  .photo-gallery {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 230px);
    gap: 1px;
    cursor: pointer;
  }

  .photo-gallery :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.3s ease;
  }

  .photo-gallery:hover :global(img) {
    filter: grayscale(0%);
  }

  .photo-item {
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .photo-gallery {
      grid-template-rows: repeat(2, 150px);
    }
  }
</style>

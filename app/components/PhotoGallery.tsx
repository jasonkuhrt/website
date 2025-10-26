import { useEffect, useState } from 'react'

// Photos organized by category
// Naming convention: <num>[-<char>].<ext>
// Photos with same <num> are in same group (only one per group should be shown)

// Automatically discover photos from filesystem using Vite's glob import
const professionalPhotoModules = import.meta.glob('/public/bio/web-res/professional/*.(jpg|jpeg|png)', {
  eager: true,
  query: '?url',
  import: 'default',
})
const hikingPhotoModules = import.meta.glob('/public/bio/web-res/hiking/*.(jpg|jpeg|png)', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Extract filenames from the glob results
const professionalPhotos = Object.keys(professionalPhotoModules).map((path) =>
  path.replace('/public/bio/web-res/professional/', '')
)
const hikingPhotos = Object.keys(hikingPhotoModules).map((path) => path.replace('/public/bio/web-res/hiking/', ''))

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

export const PhotoGallery: React.FC = () => {
  const [displayedPhotos, setDisplayedPhotos] = useState<PhotoItem[]>(getInitialPhotos())
  const [mounted, setMounted] = useState(false)

  // Randomize photos only on the client after mounting
  useEffect(() => {
    if (!mounted) {
      setMounted(true)
      setDisplayedPhotos(getRandomizedPhotos())
    }
  }, [mounted])

  // Re-randomize on click
  const handleClick = () => {
    setDisplayedPhotos(getRandomizedPhotos())
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      className='grid grid-cols-4 grid-rows-[repeat(2,230px)] gap-[1px] md:grid-rows-[repeat(2,150px)] cursor-pointer w-full max-w-[1440px] mx-auto'
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type='button'
      aria-label='Shuffle photos'
    >
      {displayedPhotos.map((photo) => (
        <div
          key={photo.path}
          className='overflow-hidden'
          style={{ gridColumn: photo.gridColumn, gridRow: photo.gridRow }}
        >
          <img
            src={`/bio/${photo.path}`}
            alt='Photo from Jason Kuhrt'
            loading='lazy'
            className='w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300'
          />
        </div>
      ))}
    </button>
  )
}

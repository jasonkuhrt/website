export interface Photo {
  id: string
  type: 'single' | 'series' | 'video'
  caption: string
  date: string // ISO 8601 format
  media: MediaItem[]
}

export interface MediaItem {
  type: 'image' | 'video'
  path: string // relative path: /photographing/[photo-id]/1.jpg
}

export interface PhotoCollection {
  photos: Photo[]
  lastUpdated: string // ISO 8601 timestamp
  totalCount: number
}

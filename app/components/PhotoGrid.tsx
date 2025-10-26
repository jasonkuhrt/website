import { Images, Play } from 'lucide-react'
import { useState } from 'react'
import type { MediaItem, Photo } from '../../public/data/capturing/types'

interface Props {
  photos: Photo[]
}

export const PhotoGrid: React.FC<Props> = ({ photos }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dimOthers, setDimOthers] = useState(false)
  const [hoveredSeriesId, setHoveredSeriesId] = useState<string | null>(null)

  const toggleSeries = (photoId: string, event: React.MouseEvent) => {
    // Don't toggle if clicking on video or its controls
    const target = event.target as HTMLElement
    if (target && (target.tagName === 'VIDEO' || target.closest('video'))) return

    event.preventDefault()

    if (expandedId === photoId) {
      // Collapse
      setExpandedId(null)
      setDimOthers(false)
      setHoveredSeriesId(null)
    } else {
      // Expand
      setExpandedId(photoId)
      setDimOthers(true)
    }
  }

  const handleSeriesIconEnter = (photoId: string) => {
    if (expandedId === photoId) setHoveredSeriesId(photoId)
  }

  const handleSeriesIconLeave = () => {
    setHoveredSeriesId(null)
  }

  const shouldDim = (photo: Photo): boolean => {
    return dimOthers && hoveredSeriesId !== null && expandedId !== photo.id
  }

  const getExpandedMedia = (photo: Photo) => {
    return photo.media.slice(1) // Skip first media item (already shown)
  }

  return (
    <div className='photo-grid'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px'>
        {photos.map((photo) => (
          <>
            {/* Main photo cell */}
            <div
              key={photo.id}
              className='photo-item'
              style={{ opacity: shouldDim(photo) ? 0.1 : 1, transition: 'opacity 0.2s' }}
            >
              {photo.type === 'series' ?
                (
                  <button
                    type='button'
                    className='series-toggle block w-full text-left'
                    onClick={(e) => toggleSeries(photo.id, e)}
                  >
                    {/* Photo Cell Content */}
                    <div className='photo-cell group relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800'>
                      {photo.media[0].type === 'image' ?
                        (
                          <img
                            src={photo.media[0].path}
                            alt={photo.caption || 'Photo'}
                            className='block h-full w-full object-cover'
                            loading='lazy'
                            decoding='async'
                          />
                        ) :
                        (
                          <video
                            src={photo.media[0].path}
                            className='block h-full w-full object-cover'
                            controls
                            muted
                          />
                        )}

                      {/* Series indicator */}
                      {photo.media.length > 1 && (
                        <div
                          className='series-icon absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 pointer-events-none'
                          onMouseEnter={() => handleSeriesIconEnter(photo.id)}
                          onMouseLeave={handleSeriesIconLeave}
                          aria-hidden='true'
                        >
                          <Images className='w-4 h-4' />
                        </div>
                      )}

                      {/* Video indicator */}
                      {photo.media[0].type === 'video' && (
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-4 pointer-events-none'>
                          <Play className='w-8 h-8 fill-current' />
                        </div>
                      )}
                    </div>
                  </button>
                ) :
                (
                  /* Non-series photo (single or video) */
                  <div className='photo-cell group relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800'>
                    {photo.media[0].type === 'image' ?
                      (
                        <img
                          src={photo.media[0].path}
                          alt={photo.caption || 'Photo'}
                          className='block h-full w-full object-cover'
                          loading='lazy'
                          decoding='async'
                        />
                      ) :
                      (
                        <video
                          src={photo.media[0].path}
                          className='block h-full w-full object-cover'
                          controls
                          muted
                        />
                      )}

                    {/* Video indicator */}
                    {photo.type === 'video' && (
                      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-4 pointer-events-none'>
                        <Play className='w-8 h-8 fill-current' />
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Expanded media items (shown after main photo) */}
            {expandedId === photo.id && (
              <>
                {getExpandedMedia(photo).map((mediaItem: MediaItem, index: number) => (
                  <div
                    key={`${photo.id}-${index}`}
                    className='photo-item aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800'
                  >
                    {mediaItem.type === 'image' ?
                      (
                        <img
                          src={mediaItem.path}
                          alt={`${photo.caption || 'Photo'} - ${index + 2}`}
                          className='block h-full w-full object-cover'
                        />
                      ) :
                      (
                        <video
                          src={mediaItem.path}
                          className='block h-full w-full object-cover'
                          controls
                          muted
                        />
                      )}
                  </div>
                ))}

                {/* Caption cell */}
                {photo.caption && (
                  <div className='photo-item bg-gray-50 dark:bg-gray-900 p-4 flex flex-col justify-center'>
                    <p className='text-sm text-gray-700 dark:text-gray-300 mb-2'>{photo.caption}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {new Date(photo.date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        ))}
      </div>
    </div>
  )
}

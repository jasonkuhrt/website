import { Images, Play } from 'lucide-react'
import { useState } from 'react'
import { css } from '../../../styled-system/css'
import type { MediaItem, Photo } from '../../data/schemas/photos.js'

const photoGrid = css({})

const grid = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1px', // Intentional hairline separation
  sm: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  md: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  lg: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
})

const photoItem = css({
  transition: 'opacity {durations.base}',
})

const seriesToggle = css({
  display: 'block',
  width: '100%',
  textAlign: 'left',
})

const photoCell = css({
  position: 'relative',
  aspectRatio: '1',
  overflow: 'hidden',
  backgroundColor: 'bg.surface',
})

const media = css({
  display: 'block',
  height: '100%',
  width: '100%',
  objectFit: 'cover',
})

const seriesIcon = css({
  position: 'absolute',
  top: '2',
  right: '2',
  backgroundColor: 'overlay.contrast',
  color: 'white',
  borderRadius: 'radii.full',
  padding: '2',
  pointerEvents: 'none',
})

const seriesIconImage = css({
  width: '1rem',
  height: '1rem',
})

const videoIndicator = css({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'overlay.contrast',
  color: 'white',
  borderRadius: 'radii.full',
  padding: '4',
  pointerEvents: 'none',
})

const playIcon = css({
  width: '2rem',
  height: '2rem',
  fill: 'currentColor',
})

const captionCell = css({
  backgroundColor: 'bg.primary',
  padding: '4',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})

const caption = css({
  fontSize: 'sm',
  color: 'text.primary',
  marginBottom: '2',
})

const date = css({
  fontSize: 'xs',
  color: 'text.tertiary',
})

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
    <div className={photoGrid}>
      <div className={grid}>
        {photos.map((photo) => (
          <>
            {/* Main photo cell */}
            <div
              key={photo.id}
              className={photoItem}
              style={{ opacity: shouldDim(photo) ? 0.1 : 1 }}
            >
              {photo.type === 'series' ?
                (
                  <button
                    type='button'
                    className={seriesToggle}
                    onClick={(e) => toggleSeries(photo.id, e)}
                  >
                    {/* Photo Cell Content */}
                    <div className={photoCell}>
                      {photo.media[0].type === 'image' ?
                        (
                          <img
                            src={photo.media[0].path}
                            alt={photo.caption || 'Photo'}
                            className={media}
                            loading='lazy'
                            decoding='async'
                          />
                        ) :
                        (
                          <video
                            src={photo.media[0].path}
                            className={media}
                            controls
                            muted
                          />
                        )}

                      {/* Series indicator */}
                      {photo.media.length > 1 && (
                        <div
                          className={seriesIcon}
                          onMouseEnter={() => handleSeriesIconEnter(photo.id)}
                          onMouseLeave={handleSeriesIconLeave}
                          aria-hidden='true'
                        >
                          <Images className={seriesIconImage} />
                        </div>
                      )}

                      {/* Video indicator */}
                      {photo.media[0].type === 'video' && (
                        <div className={videoIndicator}>
                          <Play className={playIcon} />
                        </div>
                      )}
                    </div>
                  </button>
                ) :
                (
                  /* Non-series photo (single or video) */
                  <div className={photoCell}>
                    {photo.media[0].type === 'image' ?
                      (
                        <img
                          src={photo.media[0].path}
                          alt={photo.caption || 'Photo'}
                          className={media}
                          loading='lazy'
                          decoding='async'
                        />
                      ) :
                      (
                        <video
                          src={photo.media[0].path}
                          className={media}
                          controls
                          muted
                        />
                      )}

                    {/* Video indicator */}
                    {photo.type === 'video' && (
                      <div className={videoIndicator}>
                        <Play className={playIcon} />
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
                    className={photoItem}
                    style={{ aspectRatio: '1' }}
                  >
                    {mediaItem.type === 'image' ?
                      (
                        <img
                          src={mediaItem.path}
                          alt={`${photo.caption || 'Photo'} - ${index + 2}`}
                          className={media}
                        />
                      ) :
                      (
                        <video
                          src={mediaItem.path}
                          className={media}
                          controls
                          muted
                        />
                      )}
                  </div>
                ))}

                {/* Caption cell */}
                {photo.caption && (
                  <div className={`${photoItem} ${captionCell}`}>
                    <p className={caption}>{photo.caption}</p>
                    <p className={date}>
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

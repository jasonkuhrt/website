import { css } from '#styled-system/css'
import type { MediaItem, PhotoMeta as Photo } from '../../../src/content/capturing.js'
import { Images } from 'lucide-react'
import { useState } from 'react'
import { L, Text, UI } from '../__'

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
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: '[1fr]',
        gap: '[1px]',
        sm: {
          gridTemplateColumns: '[repeat(2, 1fr)]',
        },
        md: {
          gridTemplateColumns: '[repeat(3, 1fr)]',
        },
        lg: {
          gridTemplateColumns: '[repeat(4, 1fr)]',
        },
      })}
    >
      {photos.map((photo) => (
        <>
          {/* Main photo cell */}
          <div
            key={photo.id}
            className={UI.transitions.opacityTransition}
            style={{ opacity: shouldDim(photo) ? 0.1 : 1 }}
          >
            {photo.type === 'series' ?
              (
                <button
                  type='button'
                  className={css({ display: 'block', width: 'full', textAlign: 'left' })}
                  onClick={(e) => toggleSeries(photo.id, e)}
                >
                  {/* Photo Cell Content */}
                  <UI.MediaCell
                    src={photo.media[0].path}
                    alt={photo.caption || 'Photo'}
                    type={photo.media[0].type}
                    overlay={
                      <>
                        {/* Series indicator */}
                        {photo.media.length > 1 && (
                          <div
                            onMouseEnter={() => handleSeriesIconEnter(photo.id)}
                            onMouseLeave={handleSeriesIconLeave}
                            aria-hidden='true'
                          >
                            <UI.BadgeOverlay icon={<Images />} />
                          </div>
                        )}
                        {/* Video indicator */}
                        {photo.media[0].type === 'video' && <UI.VideoIndicator />}
                      </>
                    }
                  />
                </button>
              ) :
              (
                /* Non-series photo (single or video) */
                <UI.MediaCell
                  src={photo.media[0].path}
                  alt={photo.caption || 'Photo'}
                  type={photo.media[0].type}
                  overlay={photo.type === 'video' && <UI.VideoIndicator />}
                />
              )}
          </div>

          {/* Expanded media items (shown after main photo) */}
          {expandedId === photo.id && (
            <>
              {getExpandedMedia(photo).map((mediaItem: MediaItem, index: number) => (
                <div
                  key={`${photo.id}-${index}`}
                  className={UI.transitions.opacityTransition}
                  style={{ aspectRatio: '1' }}
                >
                  <UI.MediaCell
                    src={mediaItem.path}
                    alt={`${photo.caption || 'Photo'} - ${index + 2}`}
                    type={mediaItem.type}
                  />
                </div>
              ))}

              {/* Caption cell */}
              {photo.caption && (
                <L.Flex.Col
                  className={UI.transitions.opacityTransition}
                  justify='center'
                  backgroundColor='bg.primary'
                  padding='4'
                >
                  <Text.P fontSize='2' color='text.primary' marginBottom='2'>{photo.caption}</Text.P>
                  <Text.Text fontSize='2' color='text.tertiary'>
                    {new Date(photo.date).toLocaleDateString()}
                  </Text.Text>
                </L.Flex.Col>
              )}
            </>
          )}
        </>
      ))}
    </div>
  )
}

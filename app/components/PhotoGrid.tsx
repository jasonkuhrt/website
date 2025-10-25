import { Images, Play } from 'lucide-react'
import { useState } from 'react'
import type { MediaItem, Photo } from '../../public/data/capturing/types'
import styles from './PhotoGrid.module.css'

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
    <div className={styles.photoGrid}>
      <div className={styles.grid}>
        {photos.map((photo) => (
          <>
            {/* Main photo cell */}
            <div
              key={photo.id}
              className={styles.photoItem}
              style={{ opacity: shouldDim(photo) ? 0.1 : 1 }}
            >
              {photo.type === 'series' ?
                (
                  <button
                    type='button'
                    className={styles.seriesToggle}
                    onClick={(e) => toggleSeries(photo.id, e)}
                  >
                    {/* Photo Cell Content */}
                    <div className={styles.photoCell}>
                      {photo.media[0].type === 'image' ?
                        (
                          <img
                            src={photo.media[0].path}
                            alt={photo.caption || 'Photo'}
                            className={styles.media}
                            loading='lazy'
                            decoding='async'
                          />
                        ) :
                        (
                          <video
                            src={photo.media[0].path}
                            className={styles.media}
                            controls
                            muted
                          />
                        )}

                      {/* Series indicator */}
                      {photo.media.length > 1 && (
                        <div
                          className={styles.seriesIcon}
                          onMouseEnter={() => handleSeriesIconEnter(photo.id)}
                          onMouseLeave={handleSeriesIconLeave}
                          aria-hidden='true'
                        >
                          <Images className={styles.seriesIconImage} />
                        </div>
                      )}

                      {/* Video indicator */}
                      {photo.media[0].type === 'video' && (
                        <div className={styles.videoIndicator}>
                          <Play className={styles.playIcon} />
                        </div>
                      )}
                    </div>
                  </button>
                ) :
                (
                  /* Non-series photo (single or video) */
                  <div className={styles.photoCell}>
                    {photo.media[0].type === 'image' ?
                      (
                        <img
                          src={photo.media[0].path}
                          alt={photo.caption || 'Photo'}
                          className={styles.media}
                          loading='lazy'
                          decoding='async'
                        />
                      ) :
                      (
                        <video
                          src={photo.media[0].path}
                          className={styles.media}
                          controls
                          muted
                        />
                      )}

                    {/* Video indicator */}
                    {photo.type === 'video' && (
                      <div className={styles.videoIndicator}>
                        <Play className={styles.playIcon} />
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
                    className={styles.photoItem}
                    style={{ aspectRatio: '1' }}
                  >
                    {mediaItem.type === 'image' ?
                      (
                        <img
                          src={mediaItem.path}
                          alt={`${photo.caption || 'Photo'} - ${index + 2}`}
                          className={styles.media}
                        />
                      ) :
                      (
                        <video
                          src={mediaItem.path}
                          className={styles.media}
                          controls
                          muted
                        />
                      )}
                  </div>
                ))}

                {/* Caption cell */}
                {photo.caption && (
                  <div className={`${styles.photoItem} ${styles.captionCell}`}>
                    <p className={styles.caption}>{photo.caption}</p>
                    <p className={styles.date}>
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

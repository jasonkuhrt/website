import { Capturing, type PhotoMeta } from '#~/content/capturing.js'
import { Meta } from '#~/components/meta.js'

const CapturingPage = async () => {
  const photos = await Capturing.list()

  // Sort by date descending (newest first)
  const sorted = [...photos].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <Meta title="Capturing" />

      <main>
        <h1>Capturing</h1>
        <p>
          Moments captured through the lens.
        </p>

        <div>
          {sorted.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      </main>
    </>
  )
}

const PhotoCard: React.FC<{ photo: PhotoMeta }> = ({ photo }) => {
  const firstMedia = photo.media[0]
  if (!firstMedia) return null

  return (
    <div>
      {firstMedia.type === 'image' ? (
        <img
          src={firstMedia.path}
          alt={photo.caption || `Photo from ${photo.date}`}
        />
      ) : (
        <video
          src={firstMedia.path}
          controls
        />
      )}
      <div>
        <p>
          {photo.date}
          {photo.media.length > 1 && ` • ${photo.media.length} items`}
        </p>
        {photo.caption && (
          <p>{photo.caption}</p>
        )}
      </div>
    </div>
  )
}

export default CapturingPage

export const getConfig = async () => {
  return { render: 'static' } as const
}

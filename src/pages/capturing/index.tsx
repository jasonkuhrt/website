import { Meta } from '#~/components/meta.js'
import { Frame } from '#~/content/frame.js'
import { page, config } from '#~/runtime.js'

export default page(function* () {
  const frames = yield* Frame.list()

  // Sort by date descending (newest first)
  const sorted = [...frames].sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  return (
    <>
      <Meta title='Capturing' />

      <main>
        <h1>Capturing</h1>
        <p>
          Moments captured through the lens.
        </p>

        <div>
          {sorted.map((photo) => <PhotoCard key={photo.slug} photo={photo} />)}
        </div>
      </main>
    </>
  )
})

const PhotoCard: React.FC<{ photo: Frame }> = ({ photo }) => {
  const { data } = photo
  const firstMedia = data._tag === 'series' ? data.media[0] : data.media
  if (!firstMedia) return null

  const dateStr = data.date.toLocaleDateString()
  const mediaCount = data._tag === 'series' ? data.media.length : 1

  return (
    <div>
      {firstMedia.type === 'image' ?
        (
          <img
            src={firstMedia.path}
            alt={data.caption || `Photo from ${dateStr}`}
          />
        ) :
        (
          <video
            src={firstMedia.path}
            controls
          />
        )}
      <div>
        <p>
          {dateStr}
          {mediaCount > 1 && ` • ${mediaCount} items`}
        </p>
        {data.caption && <p>{data.caption}</p>}
      </div>
    </div>
  )
}

export const getConfig = config(function* () {
  return { render: 'static' } as const
})

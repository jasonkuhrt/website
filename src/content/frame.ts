import { Content, Store } from 'continent'
import * as S from 'effect/Schema'

const MediaItem = S.Struct({
  type: S.Union(S.Literal('image'), S.Literal('video')),
  path: S.String,
})

export class FrameSingle extends S.TaggedClass<FrameSingle>()('single', {
  date: S.Date,
  media: MediaItem,
  caption: S.optional(S.String),
}) {}

export class FrameSeries extends S.TaggedClass<FrameSeries>()('series', {
  date: S.Date,
  media: S.Array(MediaItem),
  caption: S.optional(S.String),
}) {}

/**
 * Frame content definition.
 *
 * Discovers photo/video directories in content/frame/.
 * Each directory contains:
 * - One or more media files (jpg, jpeg, png, mp4, mov)
 *
 * Directory format: {date}_{time} e.g. "2024-09-16_01-00-48-000"
 */
export const Frame = Content('frame', {
  store: Store.mediaDir({
    glob: 'content/frame/*',
  }),
  schema: {
    slug: S.String,
    data: S.Union(FrameSingle, FrameSeries),
  },
  uniqueKeys: ['slug'],
  async map(source) {
    const slug = source.stem
    // Parse date from directory name (format: YYYY-MM-DD_HH-MM)
    const date = new Date(slug.split('_')[0]!)

    // Build media items from source
    const mediaItems = source.mediaFiles.map((file) => ({
      type: file.type,
      // Use public URL path (content/frame/slug/filename -> /frame/slug/filename)
      path: `/${file.path.replace(/^content\//, '')}`,
    }))

    // Create FrameSingle or FrameSeries based on media count
    const data = mediaItems.length === 1 ?
      new FrameSingle({ date, media: mediaItems[0]! }) :
      new FrameSeries({ date, media: mediaItems })

    return { slug, data }
  },
})
export type Frame = typeof Frame.Type
export type FrameData = Frame['data']
export type MediaItem = S.Schema.Type<typeof MediaItem>

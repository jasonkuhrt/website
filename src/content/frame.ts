import * as S from 'effect/Schema'
import { basename } from 'node:path'
import { Content, Store } from 'continent'

const inferMediaType = (path: string): 'image' | 'video' => {
  const ext = path.split('.').pop()?.toLowerCase()
  return ext === 'mp4' || ext === 'mov' ? 'video' : 'image'
}

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
 * Discovers photo/video directories in content/capturing/.
 * Each directory contains:
 * - One or more media files (jpg, jpeg, png, mp4, mov)
 * - Optional meta.ts with caption and other metadata
 *
 * Directory format: {date}_{time} e.g. "2024-09-16_01-00-48-000"
 */
// TODO: Frame needs a different store type - Store.dir provides { stem, path, content }
// but Frame expects directory scanning with media files. Need Store.mediaDir or similar.
export const Frame = Content('frame', {
  store: Store.dir({
    glob: 'content/capturing/*',
  }),
  schema: {
    slug: S.String,
    data: S.Union(FrameSingle, FrameSeries),
  },
  uniqueKeys: ['slug'],
  async map(source) {
    // STUB: Frame store type not yet implemented
    // Frame needs directory scanning that returns { slug, mediaFiles, meta }
    // For now, use stem as slug and create empty frame
    const slug = source.stem
    const date = new Date(slug.split('_')[0]!)

    const data = new FrameSingle({
      date,
      media: { type: 'image', path: `/frame/${slug}/placeholder.jpg` },
    })

    return { slug, data }
  },
})
export type Frame = typeof Frame.Type
export type FrameData = Frame['data']
export type MediaItem = S.Schema.Type<typeof MediaItem>

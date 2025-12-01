import { basename } from 'node:path'
import { Continent, Explorers } from 'continent'
import * as S from 'effect/Schema'

/**
 * Meta schema for optional metadata file.
 */
const MetaSchema = S.Struct({
  caption: S.optional(S.String),
})

/**
 * Capturing content definition.
 *
 * Discovers photo directories in content/capturing/.
 * Each directory contains:
 * - One or more media files (jpg, jpeg, png, mp4, mov)
 * - Optional meta.ts with caption and other metadata
 *
 * Directory format: {date}_{time} e.g. "2024-09-16_01-00-48-000"
 */
export const Capturing = Continent.define({
  name: 'capturing',
  root: 'content',
  input: MetaSchema,
  explorer: Explorers.Dir.create({
    root: 'capturing',
    entry: [
      { name: 'media', glob: '*.{jpg,jpeg,png,mp4,mov}' },
      { name: 'meta', glob: 'meta.ts', read: true, optional: true },
    ],
  }),
  async loadOne(exploration, ctx) {
    // Build media array from matches
    const media = exploration.matches.media.map(m => ({
      type: inferMediaType(m.path),
      path: `/capturing/${exploration.id}/${basename(m.path)}`,
    }))

    // Parse optional metadata
    let meta: S.Schema.Type<typeof MetaSchema> = {}
    if (exploration.matches.meta) {
      // Dynamic import the meta.ts module
      const metaModule = await import(exploration.matches.meta.path)
      meta = S.decodeUnknownSync(ctx.inputSchema)(metaModule.default)
    }

    // Extract date from directory name (e.g., "2024-09-16" from "2024-09-16_01-00-48-000")
    const date = exploration.id.split('_')[0]!

    return {
      id: exploration.id,
      date,
      type: media.length > 1 ? 'series' as const : 'single' as const,
      caption: meta.caption,
      media,
    }
  },
})

/**
 * Infer media type from file extension.
 */
const inferMediaType = (path: string): 'image' | 'video' => {
  const ext = path.split('.').pop()?.toLowerCase()
  return ext === 'mp4' || ext === 'mov' ? 'video' : 'image'
}

// Type exports for consumers (PhotoGrid, etc.)
export type PhotoMeta = Continent.EntryType<typeof Capturing>
export type MediaItem = PhotoMeta['media'][number]

/**
 * Get all photos.
 */
export const get = () => Capturing.list()

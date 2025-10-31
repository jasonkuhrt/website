import * as S from 'effect/Schema'

/**
 * Photo Schema
 *
 * Type-safe schema for photo gallery data.
 */

export const MediaType = S.Literal('image', 'video')
export type MediaType = typeof MediaType.Type

export const PhotoType = S.Literal('single', 'series', 'video')
export type PhotoType = typeof PhotoType.Type

export class MediaItem extends S.Class<MediaItem>('MediaItem')({
  type: MediaType,
  path: S.String, // relative path: /photographing/[photo-id]/1.jpg
}) {}

export class Photo extends S.Class<Photo>('Photo')({
  id: S.String,
  type: PhotoType,
  caption: S.String,
  date: S.String, // ISO 8601 format
  media: S.Array(MediaItem),
}) {}

export class PhotoCollection extends S.Class<PhotoCollection>('PhotoCollection')({
  photos: S.Array(Photo),
  lastUpdated: S.optional(S.String), // ISO 8601 timestamp
  totalCount: S.optional(S.Number),
}) {}

import * as S from 'effect/Schema'

/**
 * Site Metadata Schema
 *
 * Core site configuration and metadata.
 */

export class SiteMetadata extends S.Class<SiteMetadata>('SiteMetadata')({
  title: S.String,
  description: S.String,
}) {}

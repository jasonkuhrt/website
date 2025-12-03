import * as S from 'effect/Schema'
import { Content, Store } from 'continent'

// ============================================================================
// SocialLink Schema
// ============================================================================

export class SocialLink extends S.Class<SocialLink>('SocialLink')({
  href: S.String,
  title: S.String,
  icon: S.String,
}) {}

// ============================================================================
// Profile Singleton
// ============================================================================

export const Profile = Content('profile', {
  store: Store.js({
    path: 'content/profile/manifest.ts',
    schema: S.Struct({
      name: S.Struct({
        first: S.String,
        last: S.String,
      }),
      birthDate: S.String,
      headline: S.String,
      tagline: S.String,
      summary: S.String,
      location: S.String,
      industry: S.String,
    }),
    cardinality: '1',
  }),
})
export type Profile = typeof Profile.Type

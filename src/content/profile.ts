import { Content, Store } from 'continent'
import * as S from 'effect/Schema'

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

const Profile = Content('profile', {
  store: Store.js({
    path: 'content/profile.ts',
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
export default Profile
export type Profile = typeof Profile.Type

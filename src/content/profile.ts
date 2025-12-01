import * as S from 'effect/Schema'

// ============================================================================
// Profile Schema
// ============================================================================

export class Profile extends S.Class<Profile>('Profile')({
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
}) {}

// ============================================================================
// SocialLink Schema
// ============================================================================

export class SocialLink extends S.Class<SocialLink>('SocialLink')({
  href: S.String,
  title: S.String,
  icon: S.String,
}) {}

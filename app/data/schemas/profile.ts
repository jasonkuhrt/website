import * as S from 'effect/Schema'

/**
 * Profile Schema
 *
 * Personal profile information.
 */

export class Profile extends S.Class<Profile>('Profile')({
  name: S.Struct({
    first: S.String,
    last: S.String,
  }),
  birthDate: S.optional(S.String),
  headline: S.String,
  summary: S.String,
  location: S.String,
  industry: S.optional(S.String),
}) {}

/**
 * Social Link Schema
 *
 * External social media and contact links.
 */

export class SocialLink extends S.Class<SocialLink>('SocialLink')({
  href: S.String,
  title: S.String,
  icon: S.String,
}) {}

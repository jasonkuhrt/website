import { Str } from '@wollybeard/kit'
import { Content, Store } from 'continent'
import { Order } from 'effect'
import * as S from 'effect/Schema'

// ============================================================================
// DateString
// ============================================================================

export class DateString extends S.DateFromString {
  static make = (str: string) => S.decodeUnknownSync(DateString)(str)

  static format(date: Date | undefined): string {
    if (!date) return 'Present'
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear()
    return `${month} ${year}`
  }
}

// ============================================================================
// BaseExperience
// ============================================================================

export class BaseExperience extends S.Class<BaseExperience>('BaseExperience')({
  date: DateString,
}) {
  get id(): string {
    const tag = '_tag' in this && Str.Type.is(this._tag) ? this._tag.toLowerCase() : 'TAGLESS'
    return `${tag}-${this.date.getTime()}`
  }

  formatDateRange(): string {
    const start = DateString.format(this.date)
    if ('endDate' in this && (this as any).endDate !== undefined) {
      const end = DateString.format((this as any).endDate)
      return `${start} - ${end}`
    }
    return start
  }

  static readonly Order: Order.Order<BaseExperience> = Order.mapInput(
    Order.reverse(Order.Date),
    (exp: BaseExperience) => exp.date,
  )
}

// ============================================================================
// Experience Types
// ============================================================================

export class ExperienceWork extends BaseExperience.extend<ExperienceWork>('ExperienceWork')({
  _tag: S.tag('work'),
  title: S.String,
  company: S.String,
  location: S.String,
  endDate: S.optional(DateString),
  overview: S.optional(S.String),
  accomplishments: S.optional(S.Array(S.String)),
  technologies: S.optional(S.Array(S.String)),
  projects: S.optional(S.Array(S.Struct({ name: S.String, description: S.String }))),
}) {}

export class ExperienceEducation extends BaseExperience.extend<ExperienceEducation>('ExperienceEducation')({
  _tag: S.tag('education'),
  institution: S.String,
  degree: S.String,
  endDate: S.optional(DateString),
  description: S.optional(S.String),
}) {}

export class ExperienceAchievement extends BaseExperience.extend<ExperienceAchievement>('ExperienceAchievement')({
  _tag: S.tag('achievement'),
  title: S.String,
  issuer: S.String,
  description: S.optional(S.String),
}) {}

export class ExperienceSpeaking extends BaseExperience.extend<ExperienceSpeaking>('ExperienceSpeaking')({
  _tag: S.tag('speaking'),
  title: S.String,
  venue: S.String,
  description: S.optional(S.String),
  links: S.optional(S.Struct({
    info: S.optional(S.String),
    repo: S.optional(S.String),
    recording: S.optional(S.String),
    twitter: S.optional(S.String),
  })),
}) {}

export class ExperiencePersonal extends BaseExperience.extend<ExperiencePersonal>('ExperiencePersonal')({
  _tag: S.tag('personal'),
  title: S.String,
  icon: S.String,
  description: S.optional(S.String),
  url: S.optional(S.String),
}) {}

const ExperienceData = S.Union(
  ExperienceWork,
  ExperienceEducation,
  ExperienceAchievement,
  ExperienceSpeaking,
  ExperiencePersonal,
)
type ExperienceData = S.Schema.Type<typeof ExperienceData>

const Experience = Content('experience', {
  store: Store.js({
    path: 'content/experience.ts',
    schema: ExperienceData,
  }),
})
export default Experience
export type Experience = typeof Experience.Type

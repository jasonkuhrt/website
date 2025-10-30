import { Profile, SocialLink } from './schemas/profile.js'

/**
 * Personal Profile
 *
 * Jason Kuhrt's profile information.
 */
export const profile = Profile.make({
  name: {
    first: 'Jason',
    last: 'Kuhrt',
  },
  birthDate: 'Jan 13, 1987',
  headline: '',
  summary: 'I am developer passionate about system design, developer experience, static typing and functional programming. Educated in design theory, practice, and social responsibility I fell into programming through the portal of open source, Node.js, and GitHub. Over a decade later I have found myself in love with TypeScript and at Prisma leading development on the Prisma Data Platform Control Plane. In my personal life I work on various personal and open source projects but closest to my heart are the backpacking trips I take my two boys on across our beautiful rugged Canadian wilderness! 🏔 🇨🇦',
  location: 'Montreal, Quebec, Canada',
  industry: 'Research Services',
})

/**
 * Social Links
 *
 * External social media and contact links.
 */
export const socialLinks = [
  SocialLink.make({
    href: 'https://github.com/jasonkuhrt',
    title: 'github.com/jasonkuhrt',
    icon: 'github',
  }),
  SocialLink.make({
    href: 'https://bsky.app/profile/kuhrt.me',
    title: 'Bluesky',
    icon: 'bluesky',
  }),
  SocialLink.make({
    href: 'mailto:jasonkuhrt@me.com',
    title: 'jasonkuhrt@me.com',
    icon: 'mail',
  }),
]

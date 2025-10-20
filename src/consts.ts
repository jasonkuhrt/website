// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const siteTitle = 'KUHRT'

export const siteDescription = 'Personal website of Jason Kuhrt'

interface SocialLink {
  href: string
  title: string
  icon: string
  iconSet: 'fa6-brands' | 'carbon'
}

export const socialLinks: SocialLink[] = [
  {
    href: 'https://github.com/jasonkuhrt',
    title: 'github.com/jasonkuhrt',
    icon: 'logo-github',
    iconSet: 'carbon',
  },
  {
    href: 'https://bsky.app/profile/kuhrt.me',
    title: 'Bluesky',
    icon: 'bluesky',
    iconSet: 'fa6-brands',
  },
  {
    href: 'mailto:jasonkuhrt@me.com',
    title: 'jasonkuhrt@me.com',
    icon: 'email',
    iconSet: 'carbon',
  },
]

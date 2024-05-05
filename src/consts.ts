// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const siteTitle = 'Kuhrt'

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
    href: 'https://mastodon.social/@jasonkuhrt',
    title: 'Mastodon',
    icon: 'logo-mastodon',
    iconSet: 'carbon',
  },
  {
    href: 'https://twitter.com/jasonkuhrt',
    title: 'twitter.com/jasonkuhrt',
    icon: 'logo-twitter',
    iconSet: 'carbon',
  },
  {
    href: 'https://instagram.com/jasonkuhrt',
    title: 'instagram.com/jasonkuhrt',
    icon: 'logo-instagram',
    iconSet: 'carbon',
  },
  {
    href: 'mailto:jasonkuhrt@me.com',
    title: 'jasonkuhrt@me.com',
    icon: 'email',
    iconSet: 'carbon',
  },
]

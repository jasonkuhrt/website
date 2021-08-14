import { GitHub, Icon, Instagram, Mail, Twitter } from 'react-feather'

type SocialLink = {
  href: string
  title: string
  icon: Icon
}

export const socialLinks: SocialLink[] = [
  {
    href: 'https://github.com/jasonkuhrt',
    title: 'github.com/jasonkuhrt',
    icon: GitHub,
  },
  {
    href: 'https://twitter.com/jasonkuhrt',
    title: 'twitter.com/jasonkuhrt',
    icon: Twitter,
  },
  {
    href: 'https://instagram.com/jasonkuhrt',
    title: 'instagram.com/jasonkuhrt',
    icon: Instagram,
  },
  {
    href: 'mailto:jasonkuhrt@me.com',
    title: 'jasonkuhrt@me.com',
    icon: Mail,
  },
]

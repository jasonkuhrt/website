import {
  faMastodon,
  faGithub,
  faInstagram,
  faTwitter,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

type SocialLink = {
  href: string
  title: string
  icon: IconDefinition
}

export const socialLinks: SocialLink[] = [
  {
    href: 'https://github.com/jasonkuhrt',
    title: 'github.com/jasonkuhrt',
    icon: faGithub,
  },
  {
    href: 'https://mastodon.social/@jasonkuhrt',
    title: 'Mastodon',
    icon: faMastodon,
  },
  {
    href: 'https://twitter.com/jasonkuhrt',
    title: 'twitter.com/jasonkuhrt',
    icon: faTwitter,
  },
  {
    href: 'https://instagram.com/jasonkuhrt',
    title: 'instagram.com/jasonkuhrt',
    icon: faInstagram,
  },
  {
    href: 'mailto:jasonkuhrt@me.com',
    title: 'jasonkuhrt@me.com',
    icon: faEnvelope,
  },
]

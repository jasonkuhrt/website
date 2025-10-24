import { MapPin, Github, Mail } from 'lucide-react'
import { Section } from '../components/Section'
import { Container } from '../components/Container'
import type { Route } from './+types/home'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Jason Kuhrt' },
    { name: 'description', content: 'Personal website of Jason Kuhrt' },
  ]
}

const socialLinks = [
  {
    href: 'https://github.com/jasonkuhrt',
    title: 'github.com/jasonkuhrt',
    Icon: Github,
  },
  {
    href: 'mailto:jasonkuhrt@me.com',
    title: 'jasonkuhrt@me.com',
    Icon: Mail,
  },
]

export default function Home() {
  return (
    <Section spacing="xl">
      <Container variant="content" className="flex flex-col items-center justify-center min-h-[60vh]">
        {/* Avatar */}
        <div className="rounded-full overflow-hidden w-32 h-32 mb-8 ring-1 ring-gray-200 dark:ring-gray-800">
          <img
            src="/images/avatar2@1x.jpg"
            alt="Jason Kuhrt"
            width="128"
            height="128"
            className="object-cover"
          />
        </div>

        {/* Name */}
        <h1 className="text-5xl font-bold tracking-tight mb-4">Jason Kuhrt</h1>

        {/* Bio */}
        <p className="text-lg text-center max-w-md mb-2">
          Working in open source, open to opportunities.
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-8">
          <MapPin className="w-4 h-4" />
          <span>Montreal, Quebec, Canada</span>
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          {socialLinks.map((socialLink) => (
            <a
              key={socialLink.href}
              rel="me"
              href={socialLink.href}
              title={socialLink.title}
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              target="_blank"
            >
              <socialLink.Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </Container>
    </Section>
  )
}

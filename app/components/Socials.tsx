import { Cloud, Github, Mail } from 'lucide-react'
import { Bluesky } from './icons/Bluesky'
import { socialLinks } from '../consts'

// Icon component map
const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  bluesky: Bluesky,
  mail: Mail,
  cloud: Cloud,
}

export interface SocialsProps {
  className?: string
}

export function Socials({ className }: SocialsProps) {
  return (
    <div className={className || 'flex gap-4'}>
      {socialLinks.map((socialLink) => {
        const IconComponent = iconComponents[socialLink.icon]
        return (
          <a
            key={socialLink.href}
            rel='me'
            href={socialLink.href}
            title={socialLink.title}
            className='flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200'
            target='_blank'
          >
            {IconComponent && <IconComponent className='w-5 h-5' />}
          </a>
        )
      })}
    </div>
  )
}

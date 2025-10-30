import { Cloud, Github, Mail } from 'lucide-react'
import { css } from '../../../styled-system/css'
import { socialLinks } from '../../data/profile.js'
import { Bluesky } from '../icons/Bluesky'
import { L } from '../__'

const link = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: 'radii.full',
  color: 'text.tertiary',
  transition: 'all {durations.base}',
  _hover: {
    color: 'text.primary',
    backgroundColor: 'bg.surface',
  },
})

const icon = css({
  width: '1.25rem',
  height: '1.25rem',
})

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
    <L.Cluster gap={4} className={className}>
      {socialLinks.map((socialLink) => {
        const IconComponent = iconComponents[socialLink.icon]
        return (
          <a
            key={socialLink.href}
            rel='me'
            href={socialLink.href}
            title={socialLink.title}
            className={link}
            target='_blank'
          >
            {IconComponent && <IconComponent className={icon} />}
          </a>
        )
      })}
    </L.Cluster>
  )
}

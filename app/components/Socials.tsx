import { Cloud, Github, Mail } from 'lucide-react'
import { socialLinks } from '../consts'
import { Bluesky } from './icons/Bluesky'
import styles from './Socials.module.css'

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
    <div className={className || styles.container}>
      {socialLinks.map((socialLink) => {
        const IconComponent = iconComponents[socialLink.icon]
        return (
          <a
            key={socialLink.href}
            rel='me'
            href={socialLink.href}
            title={socialLink.title}
            className={styles.link}
            target='_blank'
          >
            {IconComponent && <IconComponent className={styles.icon} />}
          </a>
        )
      })}
    </div>
  )
}

import { Cloud, Github, Mail } from 'lucide-react'
import { socialLinks } from '../../data/profile.js'
import { L, UI } from '../__'
import { Bluesky } from '../icons/Bluesky'

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
    <L.Cluster gap='4' className={className}>
      {socialLinks.map((socialLink) => {
        const IconComponent = iconComponents[socialLink.icon]
        return IconComponent ?
          (
            <UI.SocialButton
              key={socialLink.href}
              icon={<IconComponent />}
              href={socialLink.href}
              title={socialLink.title}
              size='lg'
            />
          ) :
          null
      })}
    </L.Cluster>
  )
}

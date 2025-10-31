import {
  Award,
  Baby,
  Brain,
  Briefcase,
  Cloud,
  Code,
  GitFork,
  Github,
  GraduationCap,
  Heart,
  HelpCircle,
  Home,
  Images,
  Link,
  List,
  Mail,
  MapPin,
  Monitor,
  Moon,
  Mountain,
  Play,
  Presentation,
  Ruler,
  Settings,
  Star,
  Sun,
  Table,
  Twitter,
  Users,
  Video,
  X,
} from 'lucide-react'
import { css, cx } from '#styled-system/css'
import type { ScaleToken } from '#styled-system/tokens'
import { Flex } from '#styled-system/jsx'

/**
 * Icon registry - all Lucide icons used in the application
 * Expand this as needed when adding new icons
 */
const ICONS = {
  Award,
  Baby,
  Brain,
  Briefcase,
  Cloud,
  Code,
  GitFork,
  Github,
  GraduationCap,
  Heart,
  HelpCircle,
  Home,
  Images,
  Link,
  List,
  Mail,
  MapPin,
  Monitor,
  Moon,
  Mountain,
  Play,
  Presentation,
  Ruler,
  Settings,
  Star,
  Sun,
  Table,
  Twitter,
  Users,
  Video,
  X,
} as const

type IconName = keyof typeof ICONS

interface Props {
  /**
   * Icon name from registry (optional)
   * Type-safe - autocomplete shows all available icons
   */
  icon?: IconName
  /**
   * Text content (optional)
   */
  children?: React.ReactNode
  /**
   * Icon/badge scale using grid scale token
   * @default '4'
   * @example <Badge icon='Star' scale='3'>1.2k</Badge> // 18px icon
   */
  scale?: ScaleToken
  /**
   * Gap between icon and text
   * @default '1'
   */
  gap?: ScaleToken
  /**
   * Additional className
   */
  className?: string
}

/**
 * Badge component - unified icon + optional text component
 *
 * Supports three usage modes:
 * - Icon only: `<Badge icon='Star' scale='4' />`
 * - Text only: `<Badge>Label</Badge>`
 * - Icon + Text: `<Badge icon='MapPin' scale='6'>Montreal</Badge>`
 *
 * Replaces: UI.Icon, IconText, LocationBadge
 */
export const Badge: React.FC<Props> = ({
  icon,
  children,
  scale = '4',
  gap = '1',
  className,
}) => {
  const IconComponent = icon ? ICONS[icon] : null

  // Icon only
  if (IconComponent && !children) {
    return (
      <div className={cx(css({ width: scale, height: scale }), className)}>
        <IconComponent />
      </div>
    )
  }

  // Text only
  if (!IconComponent && children) {
    return <span className={className}>{children}</span>
  }

  // Icon + Text
  if (IconComponent && children) {
    return (
      <Flex align='center' gap={gap} className={className}>
        <div className={css({ width: scale, height: scale })}>
          <IconComponent />
        </div>
        {children}
      </Flex>
    )
  }

  return null
}

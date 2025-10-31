import { cx, css } from '#styled-system/css'
import { L, UI } from '../__'

const linkBase = css({
  borderRadius: 'full',
  color: 'text.tertiary',
  transitionProperty: '[all]',
  transitionDuration: 'base',
  _hover: {
    color: 'text.primary',
    backgroundColor: 'bg.surface',
  },
})

const linkSizeSm = css({
  width: 'icon.md',
  height: 'icon.md',
})

const linkSizeMd = css({
  width: 'icon.lg',
  height: 'icon.lg',
})

const linkSizeLg = css({
  width: 'icon.xl',
  height: 'icon.xl',
})

const LINK_SIZE_CLASSES = {
  sm: linkSizeSm,
  md: linkSizeMd,
  lg: linkSizeLg,
} as const

const iconSizeSm = css({
  width: 'icon.xs',
  height: 'icon.xs',
})

const iconSizeMd = css({
  width: 'icon.sm',
  height: 'icon.sm',
})

const iconSizeLg = css({
  width: 'icon.md',
  height: 'icon.md',
})

const ICON_SIZE_CLASSES = {
  sm: iconSizeSm,
  md: iconSizeMd,
  lg: iconSizeLg,
} as const

interface Props {
  /**
   * Icon element to display
   */
  icon: React.ReactNode
  /**
   * Link URL
   */
  href: string
  /**
   * Accessible title/label
   */
  title: string
  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Circular social media link button with icon.
 * Includes hover effect and consistent sizing.
 */
export const SocialButton: React.FC<Props> = ({ icon, href, title, size = 'md' }) => {
  const linkClass = LINK_SIZE_CLASSES[size]
  const iconClass = ICON_SIZE_CLASSES[size]

  return (
    <UI.Link.Ext href={href} className={cx(linkBase, linkClass)} title={title}>
      <L.Flex.Row align='center' justify='center' width='[100%]' height='[100%]'>
        <div className={iconClass}>{icon}</div>
      </L.Flex.Row>
    </UI.Link.Ext>
  )
}

import { css } from '#styled-system/css'
import { Box } from '#styled-system/jsx'
import { Text, UI } from '../__'

const linkInline = css({
  display: 'inline-block',
})

interface Props {
  /**
   * The URL to link to. If not provided, shows fallback instead.
   */
  href?: string
  /**
   * Accessible title for the link
   */
  title: string
  /**
   * Icon element to display
   */
  icon: React.ReactNode
  /**
   * Custom fallback to show when href is not provided.
   * Defaults to a dimmed dash "-"
   */
  fallback?: React.ReactNode
  /**
   * Icon size class name (from css())
   */
  iconClassName?: string
}

/**
 * An icon link that shows either a clickable icon (when href is provided) or a fallback (when not).
 * Commonly used for optional external links in tables and lists.
 */
export const IconLink: React.FC<Props> = ({
  href,
  title,
  icon,
  fallback,
  iconClassName,
}) => {
  if (href) {
    return (
      <UI.Link.Ext
        href={href}
        variant='subtle'
        title={title}
        className={linkInline}
      >
        <Box className={iconClassName}>{icon}</Box>
      </UI.Link.Ext>
    )
  }

  if (fallback) return <>{fallback}</>

  return (
    <Text.Text fontSize='2' color='border.default'>
      -
    </Text.Text>
  )
}

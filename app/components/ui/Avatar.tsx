import { css } from '#styled-system/css'
import { token } from '#styled-system/tokens'
import type { ScaleToken } from '#styled-system/tokens'

interface Props {
  /**
   * Image source URL
   */
  src: string
  /**
   * Alt text for accessibility
   */
  alt: string
  /**
   * Avatar scale using grid scale token (maintains 1:1 aspect ratio)
   * @default '4'
   * @example <Avatar scale="4" /> // 24px square
   * @example <Avatar scale="8" /> // 48px square
   */
  scale?: ScaleToken
}

/**
 * Avatar component for displaying user profile images.
 * Supports flexible sizing via scale tokens.
 */
export const Avatar: React.FC<Props> = ({ src, alt, scale = '4' }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={css({
        borderRadius: 'full',
        overflow: 'hidden',
        objectFit: '[cover]',
      })}
      style={{
        width: token(`scale.${scale}`),
        height: token(`scale.${scale}`),
      }}
    />
  )
}

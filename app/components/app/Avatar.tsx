import type { ScaleToken } from '#styled-system/tokens'
import { UI } from '#~/components/__'

interface Props {
  /**
   * Avatar scale using grid scale token (maintains 1:1 aspect ratio)
   * @example <Avatar scale="8" /> // 48px square
   * @example <Avatar scale="12" /> // 72px square
   */
  scale?: ScaleToken
}

/**
 * App Avatar - User's avatar with details pre-filled
 *
 * Wraps UI.Avatar with Jason Kuhrt's image and alt text.
 * For other users/images, use UI.Avatar directly.
 */
export const Avatar: React.FC<Props> = ({ scale }) => {
  return (
    <UI.Avatar
      src='/images/avatar2@1x.jpg'
      alt='Jason Kuhrt'
      scale={scale}
    />
  )
}

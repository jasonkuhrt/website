import { css } from '#styled-system/css'

const badgeBase = css({
  position: 'absolute',
  backgroundColor: 'overlay.contrast',
  color: '[white]',
  borderRadius: 'full',
  padding: '2',
  pointerEvents: '[none]',
})

const positionTopRight = css({
  top: '2',
  right: '2',
})

const positionTopLeft = css({
  top: '2',
  left: '2',
})

const positionBottomRight = css({
  bottom: '2',
  right: '2',
})

const positionBottomLeft = css({
  bottom: '2',
  left: '2',
})

const iconSize = css({
  width: 'icon.xs',
  height: 'icon.xs',
})

interface Props {
  /**
   * Icon element to display
   */
  icon: React.ReactNode
  /**
   * Position in corner
   * @default 'top-right'
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

/**
 * Small icon badge overlay component.
 * Positioned in corners, commonly used for series indicators, counts, etc.
 */
export const BadgeOverlay: React.FC<Props> = ({ icon, position = 'top-right' }) => {
  const positionClass = position === 'top-left' ?
    positionTopLeft :
    position === 'bottom-right' ?
    positionBottomRight :
    position === 'bottom-left' ?
    positionBottomLeft :
    positionTopRight

  return (
    <div className={`${badgeBase} ${positionClass}`}>
      <div className={iconSize}>{icon}</div>
    </div>
  )
}

import { Play } from 'lucide-react'
import { css } from '../../../styled-system/css'

const indicator = css({
  position: 'absolute',
  top: '[50%]',
  left: '[50%]',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'overlay.contrast',
  color: '[white]',
  borderRadius: 'full',
  pointerEvents: '[none]',
})

const indicatorSizeSm = css({
  padding: '2',
})

const indicatorSizeMd = css({
  padding: '4',
})

const indicatorSizeLg = css({
  padding: '6',
})

const iconSizeSm = css({
  width: 'icon.xs',
  height: 'icon.xs',
  fill: '[currentColor]',
})

const iconSizeMd = css({
  width: 'icon.md',
  height: 'icon.md',
  fill: '[currentColor]',
})

const iconSizeLg = css({
  width: 'icon.lg',
  height: 'icon.lg',
  fill: '[currentColor]',
})

interface Props {
  /**
   * Indicator size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Video play indicator overlay.
 * Displays centered play icon over video thumbnails.
 */
export const VideoIndicator: React.FC<Props> = ({ size = 'md' }) => {
  const indicatorClass = size === 'sm' ? indicatorSizeSm : size === 'lg' ? indicatorSizeLg : indicatorSizeMd
  const iconClass = size === 'sm' ? iconSizeSm : size === 'lg' ? iconSizeLg : iconSizeMd

  return (
    <div className={`${indicator} ${indicatorClass}`}>
      <Play className={iconClass} />
    </div>
  )
}

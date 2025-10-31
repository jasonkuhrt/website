import { css } from '../../../styled-system/css'

const cellBase = css({
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'bg.surface',
})

const cellAspect1 = css({
  aspectRatio: '1',
})

const mediaBase = css({
  display: 'block',
  height: 'full',
  width: 'full',
  objectFit: 'cover',
})

const mediaGrayscale = css({
  filter: '[grayscale(100%)]',
  transitionProperty: '[filter]',
  transitionDuration: 'slow',
  _hover: {
    filter: '[grayscale(0%)]',
  },
})

interface Props {
  /**
   * Media source URL
   */
  src: string
  /**
   * Alt text for accessibility
   */
  alt: string
  /**
   * Media type
   * @default 'image'
   */
  type?: 'image' | 'video'
  /**
   * Apply grayscale filter with hover effect
   * @default false
   */
  grayscale?: boolean
  /**
   * Aspect ratio (CSS value)
   * @default '1' (square)
   */
  aspectRatio?: string
  /**
   * Optional overlay content
   */
  overlay?: React.ReactNode
}

/**
 * Media cell component for grid displays.
 * Supports images and videos with optional grayscale and overlays.
 */
export const MediaCell: React.FC<Props> = ({
  src,
  alt,
  type = 'image',
  grayscale = false,
  aspectRatio = '1',
  overlay,
}) => {
  const aspectClass = aspectRatio === '1' ? cellAspect1 : ''
  const grayscaleClass = grayscale ? mediaGrayscale : ''

  return (
    <div
      className={`${cellBase} ${aspectClass}`}
      style={aspectRatio !== '1' ? { aspectRatio } : undefined}
    >
      {type === 'video' ?
        <video src={src} className={`${mediaBase} ${grayscaleClass}`} muted playsInline /> :
        <img src={src} alt={alt} className={`${mediaBase} ${grayscaleClass}`} loading='lazy' />}
      {overlay}
    </div>
  )
}

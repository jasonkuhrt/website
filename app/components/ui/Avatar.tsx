import { css } from '../../../styled-system/css'

const avatarBase = css({
  borderRadius: 'full',
  overflow: 'hidden',
  objectFit: '[cover]',
})

const avatarSm = css({
  width: '2', // 12px (2 baselines)
  height: '2',
})

const avatarMd = css({
  width: '4', // 24px (4 baselines)
  height: '4',
})

const avatarLg = css({
  width: '8', // 48px (8 baselines)
  height: '8',
})

const avatarWithBorder = css({
  border: '[1px solid]',
  borderColor: 'border.subtle',
})

const avatarRounded = css({
  borderRadius: '[50%]',
})

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
   * Avatar size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Border radius variant
   * @default 'circle'
   */
  variant?: 'circle' | 'rounded'
  /**
   * Show border
   * @default false
   */
  border?: boolean
  /**
   * Image width attribute (for performance)
   */
  width?: number
  /**
   * Image height attribute (for performance)
   */
  height?: number
}

/**
 * Avatar component for displaying user profile images.
 * Supports multiple sizes and border variants.
 */
export const Avatar: React.FC<Props> = ({
  src,
  alt,
  size = 'md',
  variant = 'circle',
  border = false,
  width,
  height,
}) => {
  const sizeClass = size === 'sm' ? avatarSm : size === 'lg' ? avatarLg : avatarMd
  const variantClass = variant === 'rounded' ? avatarRounded : ''
  const borderClass = border ? avatarWithBorder : ''

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${avatarBase} ${sizeClass} ${variantClass} ${borderClass}`}
    />
  )
}

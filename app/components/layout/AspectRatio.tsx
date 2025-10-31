import { styled } from '../../../styled-system/jsx'

/**
 * AspectRatio - Aspect ratio container
 *
 * A utility component that maintains a specific aspect ratio for its content.
 * Uses modern CSS `aspect-ratio` property (95% browser support).
 *
 * Perfect for: Images, videos, cards, thumbnails
 *
 * @example
 * <AspectRatio ratio={16/9}>
 *   <img src="..." />
 * </AspectRatio>
 *
 * @example
 * // Square ratio
 * <AspectRatio ratio={1}>
 *   <Card />
 * </AspectRatio>
 */
export const AspectRatio = styled('div', {
  base: {
    position: 'relative',
    overflow: 'hidden',
    '& > *': {
      position: 'absolute',
      top: '[0]',
      left: '[0]',
      width: '[100%]',
      height: '[100%]',
      objectFit: 'cover',
    },
  },
})

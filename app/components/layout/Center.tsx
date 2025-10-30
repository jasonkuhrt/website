import { styled } from '../../../styled-system/jsx'

/**
 * Center - Centering utility
 *
 * A specialized layout component for centering content horizontally,
 * vertically, or both. Replaces manual centering patterns.
 *
 * @example
 * // Center both axes
 * <Center>
 *   <Logo />
 * </Center>
 *
 * @example
 * // Center horizontally only
 * <Center axis="x">
 *   <Nav />
 * </Center>
 */
export const Center = styled('div', {
  base: {
    display: 'flex',
  },
  variants: {
    axis: {
      both: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      x: {
        justifyContent: 'center',
      },
      y: {
        alignItems: 'center',
      },
    },
    inline: {
      true: { display: 'inline-flex' },
      false: { display: 'flex' },
    },
  },
  defaultVariants: {
    axis: 'both',
    inline: false,
  },
})

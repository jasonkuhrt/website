import { styled } from '../../../styled-system/jsx'

/**
 * Spacer - Flexible space utility
 *
 * A utility component that creates flexible space between flex items.
 * Equivalent to `flex-grow: 1`.
 *
 * @example
 * <Flex direction="row">
 *   <Logo />
 *   <Spacer />
 *   <Nav />
 * </Flex>
 */
export const Spacer = styled('div', {
  base: {
    flexGrow: 1,
  },
})

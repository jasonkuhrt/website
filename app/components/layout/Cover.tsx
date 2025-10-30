import { styled } from '../../../styled-system/jsx'

/**
 * Cover - Vertically centered hero layout
 *
 * A composition component for hero sections that centers content vertically
 * within a minimum height container. Based on the "Cover" pattern from Every Layout.
 *
 * Perfect for: Homepage heroes, landing pages, full-screen sections
 *
 * @example
 * <Cover minHeight="60vh">
 *   <Avatar />
 *   <H1>Jason Kuhrt</H1>
 *   <Bio />
 *   <Socials />
 * </Cover>
 */
export const Cover = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

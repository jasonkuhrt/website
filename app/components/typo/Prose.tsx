import { type ComponentProps } from 'react'
import { styled } from '#styled-system/jsx'

const ProseBase = styled('div', {
  base: {
    fontFamily: 'serif',
    fontOpticalSizing: '[auto]',
    maxWidth: '[65ch]',
    color: 'text.secondary',
  },
})

/**
 * Prose component for MDX content styling.
 *
 * Automatically applies `.prose` className to activate descendant selectors
 * defined in panda.config.ts globalCss.
 */
export const Prose = ({ className, ...props }: ComponentProps<typeof ProseBase>) => {
  return <ProseBase className={`prose${className ? ` ${className}` : ''}`} {...props} />
}

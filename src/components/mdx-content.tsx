import { run } from '@mdx-js/mdx'
import type React from 'react'
import * as runtime from 'react/jsx-runtime'
import { useMDXComponents } from '../../mdx-components.js'

interface Props {
  compiledJs: string
}

/**
 * Renders pre-compiled MDX content.
 *
 * The MDX is compiled at the Continent level (during content loading)
 * and executed here at render time with custom components.
 */
export const MdxContent: React.FC<Props> = async ({ compiledJs }) => {
  const { default: Content } = await run(compiledJs, {
    ...runtime,
    baseUrl: import.meta.url,
  })
  const components = useMDXComponents()
  return <Content components={components} />
}

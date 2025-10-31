/**
 * MDX Component Mappings
 *
 * This file provides custom React components for MDX content at the project root.
 * The @mdx-js/rollup plugin automatically imports and uses this file.
 */

import { Blockquote, Code, H1, H2, H3, H4, Li, Link, Ol, P, Pre, Ul } from './app/components/typo/__'

export function useMDXComponents() {
  return {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    p: P,
    a: Link,
    code: Code,
    pre: Pre,
    blockquote: Blockquote,
    ul: Ul,
    ol: Ol,
    li: Li,
  }
}

import { Mdx } from 'continent'
import * as S from 'effect/Schema'

export const Scribble = Mdx('scribble', {
  glob: 'content/scribbles/*.mdx',
  slug: (source) => source.stem.replace(/_.*$/, ''),
  frontmatter: {
    tags: S.optional(S.Array(S.String)),
  },
})

export type Scribble = typeof Scribble.Type

import { Mdx } from 'continent'
import * as S from 'effect/Schema'
import { rehypeImageDimensions } from '../lib/rehype-image-dimensions.js'

const Scribble = Mdx('scribble', {
  glob: 'content/scribble/[!_]*.mdx',
  slug: (source) => source.stem.replace(/_.*$/, ''),
  frontmatter: {
    tags: S.optional(S.Array(S.String)),
  },
  rehypePlugins: [rehypeImageDimensions],
})
export default Scribble
export type Scribble = typeof Scribble.Type

import { Mdx } from 'continent'
import { rehypeImageDimensions } from '../lib/rehype-image-dimensions.js'

const Essay = Mdx('essay', {
  glob: 'content/essay/*/content.mdx',
  rehypePlugins: [rehypeImageDimensions],
})
export default Essay
export type Essay = typeof Essay.Type

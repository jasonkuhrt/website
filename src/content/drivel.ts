import { Mdx } from 'continent'
import { rehypeImageDimensions } from '../lib/rehype-image-dimensions.js'

const Drivel = Mdx('drivel', {
  rehypePlugins: [rehypeImageDimensions],
})
export default Drivel
export type Drivel = typeof Drivel.Type

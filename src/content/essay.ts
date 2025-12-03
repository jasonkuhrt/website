import { Mdx } from 'continent'

export const Essay = Mdx('essay', {
  glob: 'content/essay/*/content.mdx',
})
export type Essay = typeof Essay.Type

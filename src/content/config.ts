import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const writing = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '!**/_*.md'],
    base: './src/content/writing',
  }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
  }),
})

export const collections = {
  writing,
}

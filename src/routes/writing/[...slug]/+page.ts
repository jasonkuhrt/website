import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  try {
    // Handle different path formats:
    // essays/{slug} -> src/content/essays/{slug}/index.md
    // logs/{slug} -> src/content/logs/{slug}.md
    // til/index -> src/content/til/index.md

    const [category, slug] = params.slug.split('/')

    let post
    if (category === 'essays') {
      post = await import(`../../../content/essays/${slug}/index.md`)
    } else if (category === 'logs') {
      post = await import(`../../../content/logs/${slug}.md`)
    } else if (category === 'til') {
      post = await import(`../../../content/til/index.md`)
    } else {
      throw new Error('Invalid category')
    }

    return {
      content: post.default,
      metadata: post.metadata,
    }
  } catch {
    throw error(404, `Post not found: ${params.slug}`)
  }
}

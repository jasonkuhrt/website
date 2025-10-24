import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

const essays = import.meta.glob('../../../../content/essays/*.md', { eager: true })
const logs = import.meta.glob('../../../../content/logs/*.md', { eager: true })

const essayPaths = Object.keys(essays).map((path) => {
  const slug = path.match(/essays\/(.+)\.md$/)?.[1]
  return `essays/${slug}`
})

const logPaths = Object.keys(logs).map((path) => {
  const slug = path.match(/logs\/(.+)\.md$/)?.[1]
  return `logs/${slug}`
})

const allEntries = [...essayPaths, ...logPaths].map((slug) => ({ slug }))

// Only enable prerendering if we have content
export const prerender = allEntries.length > 0

export const entries = () => {
  return allEntries
}

export const load: PageLoad = async ({ params }) => {
  try {
    // Handle different path formats:
    // essays/{slug} -> src/content/essays/{slug}.md
    // logs/{slug} -> src/content/logs/{slug}.md

    const [category, slug] = params.slug.split('/')

    let post
    if (category === 'essays') {
      post = await import(`../../../../content/essays/${slug}.md`)
    } else if (category === 'logs') {
      post = await import(`../../../../content/logs/${slug}.md`)
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

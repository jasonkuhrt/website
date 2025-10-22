import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const mdModules = import.meta.glob('../../content/writing/*.md')

  const posts = await Promise.all(
    Object.entries(mdModules).map(async ([path, resolver]) => {
      const resolved = (await resolver()) as { metadata?: { title?: string; date?: string } }
      const slug = path.split('/').pop()?.replace('.md', '') || ''

      return {
        slug,
        title: resolved.metadata?.title || 'Untitled',
        date: new Date(resolved.metadata?.date || Date.now()),
      }
    }),
  )

  // Filter out drafts (files starting with _) and sort by date
  const publishedPosts = posts
    .filter(post => !post.slug.startsWith('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return {
    posts: publishedPosts,
  }
}

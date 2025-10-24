import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  // Load from two directories
  const essayModules = import.meta.glob('../../../content/essays/*.md')
  const logModules = import.meta.glob('../../../content/logs/*.md')

  const loadPosts = async (
    modules: Record<string, () => Promise<unknown>>,
    category: 'essays' | 'logs',
  ) => {
    return Promise.all(
      Object.entries(modules).map(async ([path, resolver]) => {
        const resolved = (await resolver()) as { metadata?: { title?: string; date?: string } }

        // Extract slug from path
        const slug = path.split('/').pop()?.replace('.md', '') || ''

        return {
          slug: `${category}/${slug}`,
          title: resolved.metadata?.title || 'Untitled',
          date: new Date(resolved.metadata?.date || Date.now()),
          category,
        }
      }),
    )
  }

  const essays = await loadPosts(essayModules, 'essays')
  const logs = await loadPosts(logModules, 'logs')

  // Filter out drafts and sort by date within each category
  const publishedEssays = essays
    .filter(post => !post.slug.includes('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const publishedLogs = logs
    .filter(post => !post.slug.includes('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return {
    essays: publishedEssays,
    logs: publishedLogs,
  }
}

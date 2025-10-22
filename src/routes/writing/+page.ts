import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  // Load from three directories
  const essayModules = import.meta.glob('../../content/essays/*/index.md')
  const logModules = import.meta.glob('../../content/logs/*.md')
  const tilModules = import.meta.glob('../../content/til/entries/*.md')

  const loadPosts = async (
    modules: Record<string, () => Promise<unknown>>,
    category: 'essays' | 'logs' | 'til',
  ) => {
    return Promise.all(
      Object.entries(modules).map(async ([path, resolver]) => {
        const resolved = (await resolver()) as { metadata?: { title?: string; date?: string } }

        // Extract slug from path
        let slug = ''
        let anchorSlug = '' // For TIL entries, this is the anchor link

        if (category === 'essays') slug = path.split('/').slice(-2, -1)[0] || ''
        else if (category === 'logs') slug = path.split('/').pop()?.replace('.md', '') || ''
        else if (category === 'til') {
          // TIL entries link to the main TIL page with an anchor
          anchorSlug = path.split('/').pop()?.replace('.md', '') || ''
          slug = 'index' // All TIL links go to the index page
        }

        return {
          slug: category === 'til' ? `${category}/${slug}#${anchorSlug}` : `${category}/${slug}`,
          title: resolved.metadata?.title || 'Untitled',
          date: new Date(resolved.metadata?.date || Date.now()),
          category,
        }
      }),
    )
  }

  const essays = await loadPosts(essayModules, 'essays')
  const logs = await loadPosts(logModules, 'logs')
  const til = await loadPosts(tilModules, 'til')

  // Filter out drafts and sort by date within each category
  const publishedEssays = essays
    .filter(post => !post.slug.includes('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const publishedLogs = logs
    .filter(post => !post.slug.includes('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const publishedTil = til
    .filter(post => !post.slug.includes('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return {
    essays: publishedEssays,
    logs: publishedLogs,
    til: publishedTil,
  }
}

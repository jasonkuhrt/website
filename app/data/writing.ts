/**
 * Writing Data
 *
 * Loads and processes MDX content from essays, drivel, and scribbles directories.
 * Filters out drafts (files starting with _) and sorts by date.
 */

interface Post {
  slug: string
  title: string
  date: Date
  category: 'essays' | 'drivel' | 'scribbles'
}

// Load MDX modules with frontmatter at build time
const essayModules = import.meta.glob<{ frontmatter?: { title?: string; date?: string } }>(
  '../../content/essays/*.mdx',
  { eager: true },
)
const drivelModules = import.meta.glob<{ frontmatter?: { title?: string; date?: string } }>(
  '../../content/drivel/*.mdx',
  { eager: true },
)
const scribbleModules = import.meta.glob<{ frontmatter?: { title?: string; date?: string } }>(
  '../../content/scribbles/entries/*.mdx',
  { eager: true },
)

const loadPosts = (
  modules: Record<string, { frontmatter?: { title?: string; date?: string } }>,
  category: 'essays' | 'drivel' | 'scribbles',
): Post[] => {
  return Object.entries(modules).map(([path, module]) => {
    // Extract slug from path
    const slug = path.split('/').pop()?.replace('.mdx', '') || ''

    return {
      slug: `${category}/${slug}`,
      title: module.frontmatter?.title || 'Untitled',
      date: new Date(module.frontmatter?.date || Date.now()),
      category,
    }
  })
}

const allEssays = loadPosts(essayModules, 'essays')
const allDrivel = loadPosts(drivelModules, 'drivel')
const allScribbles = loadPosts(scribbleModules, 'scribbles')

// Filter out drafts (files starting with _) and sort by date
export const essays = allEssays
  .filter((post) => !post.slug.split('/').pop()?.startsWith('_'))
  .sort((a, b) => b.date.getTime() - a.date.getTime())

export const drivel = allDrivel
  .filter((post) => !post.slug.split('/').pop()?.startsWith('_'))
  .sort((a, b) => b.date.getTime() - a.date.getTime())

export const scribbles = allScribbles
  .filter((post) => !post.slug.split('/').pop()?.startsWith('_'))
  .sort((a, b) => b.date.getTime() - a.date.getTime())

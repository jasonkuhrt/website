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

type MdxModule = { default: React.ComponentType; frontmatter?: { title?: string; date?: string } }

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

// Load full MDX modules (with components) for rendering
const essayMdxModules = import.meta.glob<MdxModule>(
  '../../content/essays/*.mdx',
  { eager: true },
)
const drivelMdxModules = import.meta.glob<MdxModule>(
  '../../content/drivel/*.mdx',
  { eager: true },
)
const scribbleMdxModules = import.meta.glob<MdxModule>(
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

/**
 * Get a single post by slug (category/filename)
 * @returns Post if found, undefined otherwise
 */
export const getPostBySlug = (slug: string): Post | undefined => {
  const allPosts = [...essays, ...drivel, ...scribbles]
  return allPosts.find((post) => post.slug === slug)
}

/**
 * Get the MDX component for a given post slug
 * @returns React component if found, undefined otherwise
 */
export const getMdxComponent = (slug: string): React.ComponentType | undefined => {
  const [category, filename] = slug.split('/')

  let modules: Record<string, MdxModule>
  let moduleKey: string

  if (category === 'essays') {
    modules = essayMdxModules
    moduleKey = `../../content/essays/${filename}.mdx`
  } else if (category === 'drivel') {
    modules = drivelMdxModules
    moduleKey = `../../content/drivel/${filename}.mdx`
  } else if (category === 'scribbles') {
    modules = scribbleMdxModules
    moduleKey = `../../content/scribbles/entries/${filename}.mdx`
  } else {
    return undefined
  }

  return modules[moduleKey]?.default
}

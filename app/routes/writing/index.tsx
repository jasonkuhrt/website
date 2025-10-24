import { format } from 'date-fns'
import { Section } from '../../components/Section'
import type { Route } from './+types/index'

interface Post {
  slug: string
  title: string
  date: Date
  category: 'essays' | 'drivel' | 'scribbles'
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Writing | Jason Kuhrt' },
    { name: 'description', content: 'Writing by Jason Kuhrt' },
  ]
}

export const loader = async (args: Route.LoaderArgs) => {
  // Load from three directories - use eager loading to get frontmatter
  const essayModules = import.meta.glob<{ frontmatter?: { title?: string; date?: string } }>(
    '../../../content/essays/*.mdx',
    { eager: true },
  )
  const drivelModules = import.meta.glob<{ frontmatter?: { title?: string; date?: string } }>(
    '../../../content/drivel/*.mdx',
    { eager: true },
  )
  const scribbleModules = import.meta.glob<{ frontmatter?: { title?: string; date?: string } }>(
    '../../../content/scribbles/entries/*.mdx',
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

  const essays = loadPosts(essayModules, 'essays')
  const drivel = loadPosts(drivelModules, 'drivel')
  const scribbles = loadPosts(scribbleModules, 'scribbles')

  // Filter out drafts (files starting with _) and sort by date within each category
  const publishedEssays = essays
    .filter((post) => !post.slug.split('/').pop()?.startsWith('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const publishedDrivel = drivel
    .filter((post) => !post.slug.split('/').pop()?.startsWith('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const publishedScribbles = scribbles
    .filter((post) => !post.slug.split('/').pop()?.startsWith('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return {
    essays: publishedEssays,
    drivel: publishedDrivel,
    scribbles: publishedScribbles,
  }
}

export default function Writing({ loaderData }: Route.ComponentProps) {
  return (
    <Section spacing='xl'>
      <div className='container'>
        <div className='grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-16 max-w-7xl mx-auto'>
          {/* Essays Column */}
          <section aria-label='Essays'>
            <h2 className='text-4xl font-bold mb-10 tracking-tight' style={{ fontFamily: 'var(--font-display)' }}>
              Essays
            </h2>
            <div className='space-y-10'>
              {loaderData.essays.map((post) => (
                <article key={post.slug} className='group'>
                  <a
                    href={`/writing/${post.slug}`}
                    className='block border-b-2 border-gray-200 dark:border-gray-800 pb-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200'
                  >
                    <div className='eyebrow mb-3'>{format(post.date, 'LLL dd yyyy')}</div>
                    <h3
                      className='text-xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {post.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          </section>

          {/* Drivel Column */}
          <section aria-label='Drivel'>
            <h2 className='text-4xl font-bold mb-10 tracking-tight' style={{ fontFamily: 'var(--font-display)' }}>
              Drivel
            </h2>
            <div className='space-y-10'>
              {loaderData.drivel.map((post) => (
                <article key={post.slug} className='group'>
                  <a
                    href={`/writing/${post.slug}`}
                    className='block border-b-2 border-gray-200 dark:border-gray-800 pb-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200'
                  >
                    <div className='eyebrow mb-3'>{format(post.date, 'LLL dd yyyy')}</div>
                    <h3
                      className='text-xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {post.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          </section>

          {/* Scribbles Column - Narrower, dates only */}
          <section aria-label='Scribbles' className='md:pl-4'>
            <h2 className='text-4xl font-bold mb-10 tracking-tight' style={{ fontFamily: 'var(--font-display)' }}>
              Scribbles
            </h2>
            <div className='space-y-5'>
              {loaderData.scribbles.map((post) => (
                <article key={post.slug} className='group'>
                  <a
                    href={`/writing/${post.slug}`}
                    className='block eyebrow hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    {format(post.date, 'yyyy-MM-dd')}
                  </a>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Section>
  )
}

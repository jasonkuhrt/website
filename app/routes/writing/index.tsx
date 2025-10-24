import { format } from 'date-fns'
import { Section } from '../../components/Section'
import type { Route } from './+types/index'

interface Post {
  slug: string
  title: string
  date: Date
  category: 'essays' | 'logs' | 'scribbles'
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Writing | Jason Kuhrt' },
    { name: 'description', content: 'Writing by Jason Kuhrt' },
  ]
}

export async function loader() {
  // Load from three directories - use eager loading to get frontmatter
  const essayModules = import.meta.glob<{ frontmatter?: { title?: string; date?: string } }>(
    '../../../content/essays/*.mdx',
    { eager: true },
  )
  const logModules = import.meta.glob<{ frontmatter?: { title?: string; date?: string } }>(
    '../../../content/logs/*.mdx',
    { eager: true },
  )
  const scribbleModules = import.meta.glob<{ frontmatter?: { title?: string; date?: string } }>(
    '../../../content/scribbles/entries/*.mdx',
    { eager: true },
  )

  const loadPosts = (
    modules: Record<string, { frontmatter?: { title?: string; date?: string } }>,
    category: 'essays' | 'logs' | 'scribbles',
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
  const logs = loadPosts(logModules, 'logs')
  const scribbles = loadPosts(scribbleModules, 'scribbles')

  // Filter out drafts (files starting with _) and sort by date within each category
  const publishedEssays = essays
    .filter((post) => !post.slug.split('/').pop()?.startsWith('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const publishedLogs = logs
    .filter((post) => !post.slug.split('/').pop()?.startsWith('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const publishedScribbles = scribbles
    .filter((post) => !post.slug.split('/').pop()?.startsWith('_'))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return {
    essays: publishedEssays,
    logs: publishedLogs,
    scribbles: publishedScribbles,
  }
}

export default function Writing({ loaderData }: Route.ComponentProps) {
  return (
    <Section spacing='xl'>
      <div className='container'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto'>
          {/* Essays Column */}
          <section aria-label='Essays'>
            <h2 className='text-2xl font-bold mb-6'>Essays</h2>
            <div className='space-y-6'>
              {loaderData.essays.map((post) => (
                <article key={post.slug} className='group'>
                  <a
                    href={`/writing/${post.slug}`}
                    className='block border-b border-gray-200 dark:border-gray-800 pb-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors'
                  >
                    <time
                      dateTime={post.date.toISOString()}
                      className='text-xs text-gray-500 dark:text-gray-400 font-mono block mb-2'
                    >
                      {format(post.date, 'LLL dd yyyy')}
                    </time>
                    <h3 className='text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {post.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          </section>

          {/* Logs Column */}
          <section aria-label='Logs'>
            <h2 className='text-2xl font-bold mb-6'>Logs</h2>
            <div className='space-y-6'>
              {loaderData.logs.map((post) => (
                <article key={post.slug} className='group'>
                  <a
                    href={`/writing/${post.slug}`}
                    className='block border-b border-gray-200 dark:border-gray-800 pb-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors'
                  >
                    <time
                      dateTime={post.date.toISOString()}
                      className='text-xs text-gray-500 dark:text-gray-400 font-mono block mb-2'
                    >
                      {format(post.date, 'LLL dd yyyy')}
                    </time>
                    <h3 className='text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {post.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          </section>

          {/* Scribbles Column */}
          <section aria-label='Scribbles'>
            <h2 className='text-2xl font-bold mb-6'>Scribbles</h2>
            <div className='space-y-6'>
              {loaderData.scribbles.map((post) => (
                <article key={post.slug} className='group'>
                  <a
                    href={`/writing/${post.slug}`}
                    className='block border-b border-gray-200 dark:border-gray-800 pb-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors'
                  >
                    <time
                      dateTime={post.date.toISOString()}
                      className='text-xs text-gray-500 dark:text-gray-400 font-mono block mb-2'
                    >
                      {format(post.date, 'LLL dd yyyy')}
                    </time>
                    <h3 className='text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {post.title}
                    </h3>
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

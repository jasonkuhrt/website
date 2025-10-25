import { format } from 'date-fns'
import { Section } from '../../components/Section'
import type { Route } from './+types/index'
import styles from './index.module.css'

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
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Essays Column */}
          <section aria-label='Essays' className={styles.column}>
            <h2 className={styles.columnTitle}>
              Essays
            </h2>
            <div className={styles.postList}>
              {loaderData.essays.map((post) => (
                <article key={post.slug} className={styles.postCard}>
                  <a
                    href={`/writing/${post.slug}`}
                    className={styles.postLink}
                  >
                    <div className={styles.postDate}>{format(post.date, 'LLL dd yyyy')}</div>
                    <h3 className={styles.postTitle}>
                      {post.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          </section>

          {/* Drivel Column */}
          <section aria-label='Drivel' className={styles.column}>
            <h2 className={styles.columnTitle}>
              Drivel
            </h2>
            <div className={styles.postList}>
              {loaderData.drivel.map((post) => (
                <article key={post.slug} className={styles.postCard}>
                  <a
                    href={`/writing/${post.slug}`}
                    className={styles.postLink}
                  >
                    <div className={styles.postDate}>{format(post.date, 'LLL dd yyyy')}</div>
                    <h3 className={styles.postTitle}>
                      {post.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          </section>

          {/* Scribbles Column - Narrower, dates only */}
          <section aria-label='Scribbles' className={`${styles.column} ${styles.scribblesColumn}`}>
            <h2 className={styles.columnTitle}>
              Scribbles
            </h2>
            <div className={styles.scribblesList}>
              {loaderData.scribbles.map((post) => (
                <article key={post.slug}>
                  <a
                    href={`/writing/${post.slug}`}
                    className={styles.scribbleLink}
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

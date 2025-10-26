import { data } from 'react-router'
import { Container } from '../../components/Container'
import type { Route } from './+types/slug'

// Eagerly load all MDX files
const essayModules = import.meta.glob<{ default: React.ComponentType; frontmatter?: { title?: string } }>(
  '../../../content/essays/*.mdx',
  { eager: true },
)
const drivelModules = import.meta.glob<{ default: React.ComponentType; frontmatter?: { title?: string } }>(
  '../../../content/drivel/*.mdx',
  { eager: true },
)
const scribbleModules = import.meta.glob<{ default: React.ComponentType; frontmatter?: { title?: string } }>(
  '../../../content/scribbles/entries/*.mdx',
  { eager: true },
)

export const loader = async ({ params }: Route.LoaderArgs) => {
  const slug = params['*']

  if (!slug) throw data('No slug provided', { status: 404 })

  // Determine category and filename from slug
  const parts = slug.split('/')
  if (parts.length !== 2) throw data('Invalid slug format', { status: 404 })

  const [category, filename] = parts

  // Validate category and file exists
  let moduleKey: string
  let modules: Record<string, any>

  if (category === 'essays') {
    modules = essayModules
    moduleKey = `../../../content/essays/${filename}.mdx`
  } else if (category === 'drivel') {
    modules = drivelModules
    moduleKey = `../../../content/drivel/${filename}.mdx`
  } else if (category === 'scribbles') {
    modules = scribbleModules
    moduleKey = `../../../content/scribbles/entries/${filename}.mdx`
  } else {
    throw data('Invalid category', { status: 404 })
  }

  const module = modules[moduleKey]

  if (!module) {
    console.error('Module not found:', { moduleKey, availableKeys: Object.keys(modules).slice(0, 5) })
    throw data(`Post not found: ${slug}`, { status: 404 })
  }

  return {
    category,
    filename,
    slug,
    title: module?.frontmatter?.title || 'Untitled',
  }
}

export const meta: Route.MetaFunction = ({ data }) => {
  const title = data?.title || 'Post'
  return [{ title: `${title} | Jason Kuhrt` }]
}

export default function Post({ loaderData }: Route.ComponentProps) {
  const { category, filename, title } = loaderData

  // Get the appropriate module
  let Content
  if (category === 'essays') Content = essayModules[`../../../content/essays/${filename}.mdx`]?.default
  else if (category === 'drivel') Content = drivelModules[`../../../content/drivel/${filename}.mdx`]?.default
  else if (category === 'scribbles')
    Content = scribbleModules[`../../../content/scribbles/entries/${filename}.mdx`]?.default

  if (!Content) return <div>Post not found</div>

  return (
    <Container variant='content' className='py-16'>
      <article className='prose dark:prose-invert mx-auto' data-article={filename}>
        <header className='text-center mb-20'>
          <h1
            className='text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-0'
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
          >
            {title}
          </h1>
        </header>
        <Content />
      </article>
    </Container>
  )
}

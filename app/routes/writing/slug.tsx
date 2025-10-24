import { Container } from '../../components/Container'
import type { Route } from './+types/slug'
import { data } from 'react-router'

// Eagerly load all MDX files
const essayModules = import.meta.glob<{ default: React.ComponentType; frontmatter?: { title?: string } }>(
  '../../../content/essays/*.mdx',
  { eager: true }
)
const logModules = import.meta.glob<{ default: React.ComponentType; frontmatter?: { title?: string } }>(
  '../../../content/logs/*.mdx',
  { eager: true }
)
const scribbleModules = import.meta.glob<{ default: React.ComponentType; frontmatter?: { title?: string } }>(
  '../../../content/scribbles/entries/*.mdx',
  { eager: true }
)

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params['*']

  if (!slug) {
    throw data('No slug provided', { status: 404 })
  }

  // Determine category and filename from slug
  const parts = slug.split('/')
  if (parts.length !== 2) {
    throw data('Invalid slug format', { status: 404 })
  }

  const [category, filename] = parts

  // Validate category and file exists
  let moduleKey
  let modules
  if (category === 'essays') {
    modules = essayModules
    moduleKey = `../../../content/essays/${filename}.mdx`
  } else if (category === 'logs') {
    modules = logModules
    moduleKey = `../../../content/logs/${filename}.mdx`
  } else if (category === 'scribbles') {
    modules = scribbleModules
    moduleKey = `../../../content/scribbles/entries/${filename}.mdx`
  } else {
    throw data('Invalid category', { status: 404 })
  }

  if (!modules[moduleKey]) {
    throw data(`Post not found: ${slug}`, { status: 404 })
  }

  // Get the module to extract title
  let module
  if (category === 'essays') {
    module = modules[moduleKey]
  } else if (category === 'logs') {
    module = modules[moduleKey]
  } else if (category === 'scribbles') {
    module = modules[moduleKey]
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
  const { category, filename } = loaderData

  // Get the appropriate module
  let Content
  if (category === 'essays') {
    Content = essayModules[`../../../content/essays/${filename}.mdx`]?.default
  } else if (category === 'logs') {
    Content = logModules[`../../../content/logs/${filename}.mdx`]?.default
  } else if (category === 'scribbles') {
    Content = scribbleModules[`../../../content/scribbles/entries/${filename}.mdx`]?.default
  }

  if (!Content) {
    return <div>Post not found</div>
  }

  return (
    <Container variant="content" className="prose dark:prose-invert mx-auto py-12">
      <Content />
    </Container>
  )
}

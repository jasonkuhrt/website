import { data } from 'react-router'
import { css } from '../../../styled-system/css'
import { L, T } from '../../components/__'
import type { Route } from './+types/slug'

const container = css({
  paddingBlock: '10',
})

const header = css({
  textAlign: 'center',
  marginBottom: '8',
})

type MdxModule = { default: React.ComponentType; frontmatter?: { title?: string } }

// Eagerly load all MDX files
const essayModules = import.meta.glob<MdxModule>(
  '../../../content/essays/*.mdx',
  { eager: true },
)
const drivelModules = import.meta.glob<MdxModule>(
  '../../../content/drivel/*.mdx',
  { eager: true },
)
const scribbleModules = import.meta.glob<MdxModule>(
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
  let modules: Record<string, MdxModule>

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
    <L.Container variant='content' className={container}>
      <article data-article={filename}>
        <header className={header}>
          <T.DisplayXL>
            {title}
          </T.DisplayXL>
        </header>
        <Content />
      </article>
    </L.Container>
  )
}

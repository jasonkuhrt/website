import { MdxContent } from '#~/components/mdx-content.js'
import { Meta } from '#~/components/meta.js'
import { Scribble } from '#~/content/scribble.js'
import { formatDateLong } from '#~/lib/date.js'
import type { PageProps } from 'waku/router'

const ScribblePage = async ({ slug }: PageProps<'/writing/scribbles/[slug]'>) => {
  const post = await Scribble.get(slug)
  if (!post) throw new Error(`Scribble not found: ${slug}`)

  return (
    <>
      <Meta title={post.title} type='article' publishedAt={post.date.toISOString()} />

      <main>
        <article>
          <header>
            <h1>{post.title}</h1>
            <time dateTime={post.date.toISOString()}>{formatDateLong(post.date)}</time>
          </header>
          <MdxContent compiledJs={post.compiledJs} />
        </article>
      </main>
    </>
  )
}

export default ScribblePage

export const getConfig = async () => {
  const posts = await Scribble.list()
  return {
    render: 'static',
    staticPaths: posts.map(p => p.id),
  } as const
}

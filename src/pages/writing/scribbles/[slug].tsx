import { Meta } from '#~/components/meta.js'
import { Scribbles } from '#~/content/scribbles.js'
import { formatDateLong } from '#~/lib/date.js'
import { compileMDX } from 'next-mdx-remote/rsc'
import type { PageProps } from 'waku/router'

const ScribblePage = async ({ slug }: PageProps<'/writing/scribbles/[slug]'>) => {
  const post = await Scribbles.get(slug)
  if (!post) throw new Error(`Scribble not found: ${slug}`)

  const { content } = await compileMDX({
    source: post.source,
    options: { parseFrontmatter: false },
  })

  return (
    <>
      <Meta title={post.title} type='article' publishedAt={post.date.toISOString()} />

      <main>
        <article>
          <header>
            <h1>{post.title}</h1>
            <time dateTime={post.date.toISOString()}>{formatDateLong(post.date)}</time>
          </header>
          {content}
        </article>
      </main>
    </>
  )
}

export default ScribblePage

export const getConfig = async () => {
  const posts = await Scribbles.list()
  return {
    render: 'static',
    staticPaths: posts.map(p => p.id),
  } as const
}

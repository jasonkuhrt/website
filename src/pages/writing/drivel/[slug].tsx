import { MdxContent } from '#~/components/mdx-content.js'
import { Meta } from '#~/components/meta.js'
import { Drivel } from '#~/content/drivel.js'
import { formatDateLong } from '#~/lib/date.js'
import type { PageProps } from 'waku/router'

const DrivelPage = async ({ slug }: PageProps<'/writing/drivel/[slug]'>) => {
  const post = await Drivel.get({ slug })
  if (!post) throw new Error(`Drivel not found: ${slug}`)

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

export default DrivelPage

export const getConfig = async () => {
  const posts = await Drivel.list()
  return {
    render: 'static',
    staticPaths: posts.map(p => p.slug),
  } as const
}

import { MdxContent } from '#~/components/mdx-content.js'
import { Meta } from '#~/components/meta.js'
import { Scribble } from '#~/content/scribble.js'
import { formatDateLong } from '#~/lib/date.js'
import { config, page } from '#~/runtime.js'
import { Option } from 'effect'

export default page<{ slug: string }>(function*({ slug }) {
  const postOption = yield* Scribble.get({ slug })
  const post = Option.getOrThrowWith(postOption, () => new Error(`Scribble not found: ${slug}`))

  return (
    <>
      <Meta title={post.title} type='article' publishedAt={post.date.toISOString()} />

      <main>
        <article className='prose'>
          <header className='prose-header'>
            <h1>{post.title}</h1>
            <time dateTime={post.date.toISOString()}>{formatDateLong(post.date)}</time>
          </header>
          <MdxContent compiledJs={post.compiledJs} />
        </article>
      </main>
    </>
  )
})

export const getConfig = config(function*() {
  const posts = yield* Scribble.list()
  return {
    render: 'static',
    staticPaths: posts.map(p => p.slug),
  } as const
})

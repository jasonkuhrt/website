import { MdxContent } from '#~/components/mdx-content.js'
import { Meta } from '#~/components/meta.js'
import Essay from '#~/content/essay.js'
import { formatDateLong } from '#~/lib/date.js'
import { config, page } from '#~/runtime.js'
import { Option } from 'effect'

export default page<{ slug: string }>(function*({ slug }) {
  const essayOption = yield* Essay.getBy({ slug })
  const essay = Option.getOrThrowWith(essayOption, () => new Error(`Essay not found: ${slug}`))

  return (
    <>
      <Meta title={essay.title} type='article' publishedAt={essay.date.toISOString()} />

      <main>
        <article className='prose'>
          <header className='prose-header'>
            <h1>{essay.title}</h1>
            <time dateTime={essay.date.toISOString()}>{formatDateLong(essay.date)}</time>
          </header>
          <MdxContent compiledJs={essay.compiledJs} />
        </article>
      </main>
    </>
  )
})

export const getConfig = config(function*() {
  const essays = yield* Essay.list()
  return {
    render: 'static',
    staticPaths: essays.map(e => e.slug),
  } as const
})

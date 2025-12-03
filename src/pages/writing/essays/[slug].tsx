import { MdxContent } from '#~/components/mdx-content.js'
import { Meta } from '#~/components/meta.js'
import { Essay } from '#~/content/essay.js'
import { formatDateLong } from '#~/lib/date.js'
import type { PageProps } from 'waku/router'

const EssayPage = async ({ slug }: PageProps<'/writing/essays/[slug]'>) => {
  const essay = await Essay.get({ slug })
  if (!essay) throw new Error(`Essay not found: ${slug}`)

  return (
    <>
      <Meta title={essay.title} type='article' publishedAt={essay.date.toISOString()} />

      <main>
        <article>
          <header>
            <h1>{essay.title}</h1>
            <time dateTime={essay.date.toISOString()}>{formatDateLong(essay.date)}</time>
          </header>
          <MdxContent compiledJs={essay.compiledJs} />
        </article>
      </main>
    </>
  )
}

export default EssayPage

export const getConfig = async () => {
  const essays = await Essay.list()
  return {
    render: 'static',
    staticPaths: essays.map(e => e.slug),
  } as const
}

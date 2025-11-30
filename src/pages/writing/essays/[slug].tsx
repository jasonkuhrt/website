import { Meta } from '#~/components/meta.js'
import { Essays } from '#~/content/essays.js'
import { formatDateLong } from '#~/lib/date.js'
import { compileMDX } from 'next-mdx-remote/rsc'
import type { PageProps } from 'waku/router'

const EssayPage = async ({ slug }: PageProps<'/writing/essays/[slug]'>) => {
  const essay = await Essays.get(slug)
  if (!essay) throw new Error(`Essay not found: ${slug}`)

  const { content } = await compileMDX({
    source: essay.source,
    options: { parseFrontmatter: false },
  })

  return (
    <>
      <Meta title={essay.title} type='article' publishedAt={essay.date.toISOString()} />

      <main>
        <article>
          <header>
            <h1>{essay.title}</h1>
            <time dateTime={essay.date.toISOString()}>{formatDateLong(essay.date)}</time>
          </header>
          {content}
        </article>
      </main>
    </>
  )
}

export default EssayPage

export const getConfig = async () => {
  const essays = await Essays.list()
  return {
    render: 'static',
    staticPaths: essays.map(e => e.id),
  } as const
}

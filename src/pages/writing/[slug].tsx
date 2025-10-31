import { compileMDX } from 'next-mdx-remote/rsc'
import { readFileSync, readdirSync } from 'node:fs'
import type { PageProps } from 'waku/router'

export default async function WritingPost({ slug }: PageProps<'/writing/[slug]'>) {
  if (!slug) throw new Error('No slug provided')

  // Simple mapping - just try essays folder for now
  const filePath = `./content/essays/${slug}.mdx`

  const source = readFileSync(filePath, 'utf8')
  const { content, frontmatter } = await compileMDX<{ title?: string }>({
    source,
    options: { parseFrontmatter: true },
  })

  const title = frontmatter?.title || slug

  return (
    <>
      <title>{title} | Jason Kuhrt</title>

      <main>
        <article>
          <h1>{title}</h1>
          {content}
        </article>
      </main>
    </>
  )
}

export const getConfig = async () => {
  const essays = readdirSync('./content/essays')
    .filter(f => f.endsWith('.mdx') && !f.startsWith('_'))
    .map(f => f.replace('.mdx', ''))

  return {
    render: 'static',
    staticPaths: essays,
  } as const
}

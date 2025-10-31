import { L, Text } from '#~/components/__'
import * as WritingData from '#~/data/writing'
import { data } from 'react-router'
import type { Route } from './+types/slug'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const slug = params['*']

  if (!slug) throw data('No slug provided', { status: 404 })

  // Find the post in the writing data (validates it exists and isn't a draft)
  const post = WritingData.getPostBySlug(slug)

  if (!post) throw data(`Post not found: ${slug}`, { status: 404 })

  return { post }
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  const title = loaderData.post.title
  return [{ title: `${title} | Jason Kuhrt` }]
}

const Post: React.FC<Route.ComponentProps> = ({ loaderData: { post } }) => {
  const { slug, title } = post

  // Get the MDX component from the central data module
  const Content = WritingData.getMdxComponent(slug)

  if (!Content) return <div>Post not found</div>

  // Extract filename for article data attribute
  const filename = slug.split('/')[1]

  return (
    <L.Box paddingBlock='10'>
      <L.Container variant='content'>
        <article data-article={filename}>
          <Text.ArticleHeader title={title} />
          <Text.Prose>
            <Content />
          </Text.Prose>
        </article>
      </L.Container>
    </L.Box>
  )
}

export default Post

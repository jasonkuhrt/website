import { F, L, Text } from '#~/components/__'
import * as writingData from '#~/data/writing'
import { createPageMeta } from '#~/lib/metaHelpers'
import type { Route } from './+types/index'

export const meta: Route.MetaFunction = () => createPageMeta('Writing', 'Writing by Jason Kuhrt')

export const loader = async (args: Route.LoaderArgs) => {
  return {
    essays: writingData.essays,
    drivel: writingData.drivel,
    scribbles: writingData.scribbles,
  }
}

const Writing: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  return (
    <L.PageSection width='wide'>
      <L.Grid
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr auto' }}
        gap='16'
      >
        {/* Essays Column */}
        <section aria-label='Essays'>
          <Text.H2 marginBottom='10'>
            Essays
          </Text.H2>
          <L.Flex.Col gap='10'>
            {loaderData.essays.map(($post) => <F.PostCard key={$post.slug} post={$post} />)}
          </L.Flex.Col>
        </section>

        {/* Drivel Column */}
        <section aria-label='Drivel'>
          <Text.H2 marginBottom='10'>
            Drivel
          </Text.H2>
          <L.Flex.Col gap='10'>
            {loaderData.drivel.map(($post) => <F.PostCard key={$post.slug} post={$post} />)}
          </L.Flex.Col>
        </section>

        {/* Scribbles Column - Narrower, dates only */}
        <section aria-label='Scribbles'>
          <Text.H2 marginBottom='10'>
            Scribbles
          </Text.H2>
          <L.Flex.Col gap='5' paddingLeft={{ base: '4', md: '0' }}>
            {loaderData.scribbles.map((post) => (
              <article key={post.slug}>
                <F.ScribbleLink date={post.date} slug={post.slug} />
              </article>
            ))}
          </L.Flex.Col>
        </section>
      </L.Grid>
    </L.PageSection>
  )
}

export default Writing

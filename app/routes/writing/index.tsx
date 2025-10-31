import { F, L, T } from '../../components/__'
import * as writingData from '../../data/writing'
import { createPageMeta } from '../../lib/metaHelpers'
import type { Route } from './+types/index'

export const meta: Route.MetaFunction = () =>
  createPageMeta('Writing', 'Writing by Jason Kuhrt')

export const loader = async (args: Route.LoaderArgs) => {
  return {
    essays: writingData.essays,
    drivel: writingData.drivel,
    scribbles: writingData.scribbles,
  }
}

export default function Writing({ loaderData }: Route.ComponentProps) {
  return (
    <L.PageSection width="wide">
      <L.Grid
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr auto' }}
        gap='16'
      >
          {/* Essays Column */}
          <section aria-label='Essays'>
            <T.H2 marginBottom='10'>
              Essays
            </T.H2>
            <L.Flex.Col gap='10'>
              {loaderData.essays.map(($post) => <F.PostCard key={$post.slug} post={$post} />)}
            </L.Flex.Col>
          </section>

          {/* Drivel Column */}
          <section aria-label='Drivel'>
            <T.H2 marginBottom='10'>
              Drivel
            </T.H2>
            <L.Flex.Col gap='10'>
              {loaderData.drivel.map(($post) => <F.PostCard key={$post.slug} post={$post} />)}
            </L.Flex.Col>
          </section>

          {/* Scribbles Column - Narrower, dates only */}
          <section aria-label='Scribbles'>
            <T.H2 marginBottom='10'>
              Scribbles
            </T.H2>
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

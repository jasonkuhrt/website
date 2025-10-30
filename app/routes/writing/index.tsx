import { format } from 'date-fns'
import { css } from '../../../styled-system/css'
import { L, T } from '../../components/__'
import * as writingData from '../../data/writing'
import type { Route } from './+types/index'

const postCard = css({
  /* Article wrapper */
})

const postLink = css({
  display: 'block',
  borderBottom: '2px solid',
  borderColor: 'border.default',
  paddingBottom: '6',
  transition: 'all {durations.base}',
  _hover: {
    borderColor: 'accent.default',
    '& .post-title': {
      color: 'accent.dark',
    },
  },
})

const postDate = css({
  marginBottom: '3',
  fontSize: 'sm',
  textTransform: 'uppercase',
  letterSpacing: 'letterSpacings.wide',
  color: 'text.tertiary',
})

const postTitleTransition = css({
  transition: 'color {durations.base}',
})

const scribbleLink = css({
  display: 'block',
  fontSize: 'sm',
  textTransform: 'uppercase',
  letterSpacing: 'letterSpacings.wide',
  color: 'text.tertiary',
  transition: 'color {durations.base}',
  _hover: {
    color: 'accent.dark',
  },
})

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Writing | Jason Kuhrt' },
    { name: 'description', content: 'Writing by Jason Kuhrt' },
  ]
}

export const loader = async (args: Route.LoaderArgs) => {
  return {
    essays: writingData.essays,
    drivel: writingData.drivel,
    scribbles: writingData.scribbles,
  }
}

export default function Writing({ loaderData }: Route.ComponentProps) {
  return (
    <L.Section spacing='xl'>
      <L.Container variant='wide'>
        <L.Grid gridTemplateColumns={{ base: '1fr', md: '1fr 1fr auto' }} gap={16} maxWidth='90rem' marginInline='auto'>
          {/* Essays Column */}
          <section aria-label='Essays'>
            <T.H2 marginBottom='10'>
              Essays
            </T.H2>
            <L.Flex direction='column' gap={10}>
              {loaderData.essays.map((post) => (
                <article key={post.slug} className={postCard}>
                  <a
                    href={`/writing/${post.slug}`}
                    className={postLink}
                  >
                    <div className={postDate}>{format(post.date, 'LLL dd yyyy')}</div>
                    <T.H3 className={`${postTitleTransition} post-title`} marginBottom='4'>
                      {post.title}
                    </T.H3>
                  </a>
                </article>
              ))}
            </L.Flex>
          </section>

          {/* Drivel Column */}
          <section aria-label='Drivel'>
            <T.H2 marginBottom='10'>
              Drivel
            </T.H2>
            <L.Flex direction='column' gap={10}>
              {loaderData.drivel.map((post) => (
                <article key={post.slug} className={postCard}>
                  <a
                    href={`/writing/${post.slug}`}
                    className={postLink}
                  >
                    <div className={postDate}>{format(post.date, 'LLL dd yyyy')}</div>
                    <T.H3 className={`${postTitleTransition} post-title`} marginBottom='4'>
                      {post.title}
                    </T.H3>
                  </a>
                </article>
              ))}
            </L.Flex>
          </section>

          {/* Scribbles Column - Narrower, dates only */}
          <section aria-label='Scribbles'>
            <T.H2 marginBottom='10'>
              Scribbles
            </T.H2>
            <L.Flex direction='column' gap={5} paddingLeft={{ base: '4', md: 0 }}>
              {loaderData.scribbles.map((post) => (
                <article key={post.slug}>
                  <a
                    href={`/writing/${post.slug}`}
                    className={scribbleLink}
                  >
                    {format(post.date, 'yyyy-MM-dd')}
                  </a>
                </article>
              ))}
            </L.Flex>
          </section>
        </L.Grid>
      </L.Container>
    </L.Section>
  )
}

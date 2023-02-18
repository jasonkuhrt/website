import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { FC } from 'react'
import { allLogs, Log } from '../../.contentlayer/generated'

export const getStaticPaths: GetStaticPaths = () => {
  const paths = allLogs.map((log) => log.url)
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const log = allLogs.find((log) => log._raw.flattenedPath === params?.slug)
  return {
    props: {
      log,
    },
  }
}

const PostLayout: FC<{ log: Log }> = ({ log }) => {
  const title = `Jason Kuhrt – ${log.title}`
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <article style={{ marginBottom: '50vh' }} className="mx-auto max-w-2xl py-16">
        <div className="mb-6 text-center">
          <Link href="/">
            <a title="home" className="text-center text-sm font-bold uppercase text-blue-700">
              ↑
            </a>
          </Link>
        </div>
        <div className="mb-24 text-center">
          <h1 className="mb-1 text-3xl font-bold">{log.title}</h1>
          <time dateTime={log.date} className="text-sm">
            {format(parseISO(log.date), 'LLLL d, yyyy')}
          </time>
        </div>
        <div dangerouslySetInnerHTML={{ __html: log.body.html }} />
      </article>
    </>
  )
}

export default PostLayout

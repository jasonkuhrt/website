import Head from 'next/head'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { compareDesc, format, parseISO } from 'date-fns'
import { GetStaticProps, NextPage } from 'next'
import { FC } from 'react'
import { allLogs, Log } from '../../.contentlayer/generated'

export const getStaticProps: GetStaticProps = async () => {
  const logs = allLogs.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date))
  })
  return { props: { logs } }
}

const LogCard: FC<Log> = (log) => {
  return (
    <div className="mb-6">
      <time dateTime={log.date} className="block text-sm text-slate-600">
        {format(parseISO(log.date), 'LLLL d, yyyy')}
      </time>
      <h2 className="text-lg">
        <Link href={log.url} className="text-blue-700 hover:text-blue-900">
          {log.title}
        </Link>
      </h2>
    </div>
  )
}

const Home: NextPage<{ logs: Log[] }> = ({ logs }) => {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      hello
      <Head>
        <title>Jason Kuhrt – Logs</title>
      </Head>
      <div className="mb-6 text-center">
        <Link href="/" title="home" className="text-center text-sm font-bold uppercase text-blue-700">
          ↑
        </Link>
      </div>
      <h1 className="mb-8 text-3xl font-bold">Logs</h1>
      {logs.map((log, idx) => (
        <LogCard key={idx} {...log} />
      ))}
    </div>
  )
}

export default Home

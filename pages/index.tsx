import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { socialLinks } from '../data/socialLinks'
import profilePicture from '../public/avatar@0.5x.png'
import { faTwitter, faYoutube, faMeetup } from '@fortawesome/free-brands-svg-icons'
import { allLogs, Log } from '../.contentlayer/generated'
import { compareDesc } from 'date-fns'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const getStaticProps: GetStaticProps = async () => {
  const logs = allLogs.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date))
  })
  return { props: { logs } }
}

const Home: NextPage<{ logs: Log[] }> = ({ logs }) => {
  return (
    <div style={{ marginBottom: '50vh' }} className="p-6 mt-24 space-y-20 max-w-2xl mr-auto ml-auto">
      <Head>
        <title>Jason Kuhrt</title>
      </Head>

      <section className="flex flex-col items-center">
        <div className="rounded-full overflow-hidden w-48 h-48">
          <Image src={profilePicture} alt="Profile picture of Jason Kuhrt" />
        </div>

        <h1 className="mt-5">Jason Kuhrt</h1>
        <div className="flex mt-3 space-x-5">
          {socialLinks.map((socialLink) => (
            <Link
              rel="me"
              key={socialLink.title}
              href={socialLink.href}
              title={socialLink.title}
              className="opacity-20 hover:opacity-100"
              target="_blank"
            >
              <FontAwesomeIcon icon={socialLink.icon} size="1x" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <p className="">
          Hey! 👋
          <br />
          <br /> I am a developer passionate about system design, developer experience, static typing, and
          functional programming. Educated in design theory, practice, and social responsibility, I discovered
          programming through open source community and tools like Wordpress, Node.js, and GitHub. Over a
          decade later I find myself in love with TypeScript and working at Prisma, leading development on the
          Prisma Data Platform Control Plane.
          <br />
          <br />
          In my personal life, I sometimes work on open source projects, but closest to my heart are the
          backpacking trips I take with my boys across the beautiful rugged Canadian landscape. 🏔🇨🇦
        </p>
      </section>

      <section>
        <Link href="/logs">
          <Title>Logs</Title>
        </Link>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <Link href={log.url} title={log.title}>
                {log.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 w-full">
        <Title>Talks</Title>
        <div className="w-full">
          <Talk
            title="Introduction to Data Modeling with Algebraic Data Types in TypeScript with Alge"
            venue="Berlin TypeScript Meetup #9"
            date="August 2022"
            links={{
              info: 'https://www.meetup.com/typescript-berlin/events/287592005/',
              recording: `https://www.youtube.com/watch?v=JWvy7JXE6vw`,
              twitter: 'https://twitter.com/NWoroniec/status/1559506067977011202',
            }}
          />
          <Talk
            title="Diving into the new Nexus Prisma"
            venue="Berlin GraphQL Meetup #25"
            date="February 2022"
            links={{
              info: 'https://www.meetup.com/graphql-berlin/events/283094727/',
              recording: 'https://youtu.be/srkTmlFNOyw?t=2046',
              twitter: 'https://twitter.com/prisma/status/1492136994834628613',
            }}
          />
          <Talk
            title="Jason Kuhrt on Prisma, Nexus, Dogfooding Open Source, GraphQL's Early Days, Design Education, Path To Coding, Prisma Learnings, Schema Design, Data Modeling, and beyond"
            venue="GraphQL Radio"
            date="August 2022"
            links={{
              recording:
                'https://graphqlradio.com/episodes/jason-kuhrt-on-prisma-nexus-dogfooding-open-source-graphql-early-days-design-education-path-to-coding-prisma-learnings-schema-design-data-modeling-and-beyond',
              twitter: 'https://twitter.com/graphqlradio/status/1554117177480863745',
            }}
          />
          <Talk
            title="Introduction to Nexus"
            venue="SF Node Meetup"
            date="February 2021"
            links={{
              info: 'https://www.meetup.com/sfnode/events/hdgjmryccdbpb/',
              recording: 'https://www.youtube.com/watch?v=WUz5JulzSDA',
              twitter: 'https://twitter.com/sfnode/status/1360305708449689601',
            }}
          />
          <Talk
            title="Nexus Schema in the Context of Building a Small API"
            venue="Node.js Wroclaw Meetup #8"
            date="November 2020"
            links={{
              info: 'https://www.meetup.com/node-js-wroclaw/events/274063640/',
              recording:
                'https://www.youtube.com/watch?v=Ocr5m5ZsDfE&list=PLyBCIdozqa-QddgDTh4IiiiE3qCywqKpt&index=1',
              twitter: 'https://twitter.com/prisma/status/1328653494010736646',
            }}
          />
          <Talk
            title="Building a type-safe GraphQL server with Nexus and Prisma"
            venue="Prisma Day"
            date="June 2020"
            links={{
              info: 'https://www.prisma.io/day-2020/',
              recording: 'https://www.youtube.com/watch?v=oFk4rxz_KO8&feature=youtu.be',
              twitter: 'https://twitter.com/JasonKuhrt/status/1274421971997134851',
            }}
          />
        </div>
      </section>
    </div>
  )
}

const Title: FC<{ children: React.ReactNode }> = (props) => {
  // TODO hash anchor link
  return <h1>{props.children}</h1>
}

const Talk: FC<{
  title: string
  venue: string
  date: string
  links?: {
    recording?: string
    info?: string
    twitter?: string
  }
}> = (props) => {
  return (
    <div className="flex flex-col md:flex-row text-sm hover:bg-[#fcfcfc] p-2">
      <div className="p-3 align-top">
        <div className="md:w-96">
          <div>{props.title}</div>
          <div className="opacity-40">@ {props.venue}</div>
        </div>
      </div>
      <div className="p-3 align-top">{props.date}</div>
      <div className="p-3 align-top">
        <div className="flex space-x-2">
          {props.links?.info ? (
            <a className="opacity-20 hover:opacity-100" href={props.links.info}>
              <FontAwesomeIcon icon={faMeetup} size="1x" />
            </a>
          ) : (
            <div className="opacity-10">
              <FontAwesomeIcon icon={faMeetup} size="1x" />
            </div>
          )}
          {props.links?.recording ? (
            <a className="opacity-20 hover:opacity-100" href={props.links.recording}>
              <FontAwesomeIcon icon={faYoutube} size="1x" />
            </a>
          ) : (
            <div className="opacity-10">
              <FontAwesomeIcon icon={faYoutube} size="1x" />
            </div>
          )}
          {props.links?.twitter && (
            <a className="opacity-20 hover:opacity-100" href={props.links?.twitter}>
              <FontAwesomeIcon icon={faTwitter} size="1x" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home

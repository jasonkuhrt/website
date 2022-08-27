import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { socialLinks } from '../data/socialLinks'
import profilePicture from '../public/profile-picture.png'
import { Info, Twitter, Youtube } from 'react-feather'
import { title } from 'process'

const Home: NextPage = () => {
  return (
    <div className="mt-24 space-y-20 max-w-2xl mr-auto ml-auto">
      <section className="flex flex-col items-center">
        <div className="rounded-full overflow-hidden w-48 h-48">
          <Image src={profilePicture} alt="Profile picture of Jason Kuhrt" />
        </div>

        <h1 className="mt-5">Jason Kuhrt</h1>
        <div className="flex mt-3 space-x-5">
          {socialLinks.map((socialLink) => (
            <Link key={socialLink.title} href={socialLink.href}>
              <a title={socialLink.title} className="opacity-20 hover:opacity-100" target="_blank">
                <socialLink.icon size={20} />
              </a>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <p className="">
          Hey! 👋
          <br />
          <br /> I am a developer passionate about system design, developer experience, static typing, and
          functional programming. Educated in design theory, practice, and social responsibility, I fell into
          programming through the portal of open source, Node.js, and GitHub. Over a decade later I find
          myself in love with TypeScript and working at Prisma, leading development on the Prisma Data
          Platform Control Plane.
          <br />
          <br />
          In my personal life, I sometimes work on open source projects, but closest to my heart are the
          backpacking trips I take my two boys on across the beautiful rugged Canadian wilderness! 🏔🇨🇦
        </p>
      </section>

      <section className="mt-20 w-full">
        <h1 className="">Appearances</h1>
        <table>
          <tbody>
            <Appearance
              title="Berlin TypeScript Meetup #9"
              date="August 2022"
              links={{
                info: 'https://www.meetup.com/typescript-berlin/events/287592005/',
                recording: 'https://youtu.be/srkTmlFNOyw?t=2046',
                twitter: 'https://twitter.com/NWoroniec/status/1559506067977011202',
              }}
            />
            <Appearance
              title="Berlin GraphQL Meetup #25"
              date="February 2022"
              links={{
                info: 'https://www.meetup.com/graphql-berlin/events/283094727/',
                recording: 'https://youtu.be/srkTmlFNOyw?t=2046',
                twitter: 'https://twitter.com/prisma/status/1492136994834628613',
              }}
            />
            <Appearance
              title="GraphQL Radio"
              date="August 2022"
              links={{
                recording:
                  'https://graphqlradio.com/episodes/jason-kuhrt-on-prisma-nexus-dogfooding-open-source-graphql-early-days-design-education-path-to-coding-prisma-learnings-schema-design-data-modeling-and-beyond',
                twitter: 'https://twitter.com/graphqlradio/status/1554117177480863745',
              }}
            />
            <Appearance
              title="SF Node Meetup"
              date="February 2021"
              links={{
                info: 'https://www.meetup.com/sfnode/events/hdgjmryccdbpb/',
                recording: 'https://www.youtube.com/watch?v=WUz5JulzSDA',
                twitter: 'https://twitter.com/sfnode/status/1360305708449689601',
              }}
            />
            <Appearance
              title="Node.js Wroclaw Meetup #8"
              date="November 2020"
              links={{
                info: 'https://www.meetup.com/node-js-wroclaw/events/274063640/',
                recording:
                  'https://www.youtube.com/watch?v=Ocr5m5ZsDfE&list=PLyBCIdozqa-QddgDTh4IiiiE3qCywqKpt&index=1',
                twitter: 'https://twitter.com/prisma/status/1328653494010736646',
              }}
            />
          </tbody>
        </table>
      </section>
    </div>
  )
}

const Appearance = (props: {
  title: string
  date: string
  links?: {
    recording?: string
    info?: string
    twitter?: string
  }
}) => {
  return (
    <tr className="flex hover:bg-[#fcfcfc] p-2">
      <td className="w-80">{props.title}</td>
      <td className="w-40 mr-10">{props.date}</td>
      <td className="flex ml-4 space-x-2">
        {props.links?.info && (
          <a className="opacity-20 hover:opacity-100" href={props.links.info}>
            <Info />
          </a>
        )}
        {props.links?.recording && (
          <a className="opacity-20 hover:opacity-100" href={props.links.recording}>
            <Youtube />
          </a>
        )}
        {props.links?.twitter && (
          <a className="opacity-20 hover:opacity-100" href={props.links?.twitter}>
            <Twitter />
          </a>
        )}
      </td>
    </tr>
  )
}

export default Home

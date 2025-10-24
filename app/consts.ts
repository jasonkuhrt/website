// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const siteTitle = 'KUHRT'

export const siteDescription = 'Personal website of Jason Kuhrt'

interface SocialLink {
  href: string
  title: string
  icon: string
}

export const socialLinks: SocialLink[] = [
  {
    href: 'https://github.com/jasonkuhrt',
    title: 'github.com/jasonkuhrt',
    icon: 'github',
  },
  {
    href: 'https://bsky.app/profile/kuhrt.me',
    title: 'Bluesky',
    icon: 'bluesky',
  },
  {
    href: 'mailto:jasonkuhrt@me.com',
    title: 'jasonkuhrt@me.com',
    icon: 'mail',
  },
]

interface Talk {
  title: string
  venue: string
  date: string
  links: {
    info?: string
    repo?: string
    recording?: string
    twitter?: string
  }
}

export const talks: Talk[] = [
  {
    title: 'Imagining the Future of GraphQL Documentation Tooling',
    venue: 'GraphQLConf 2025',
    date: 'September 2025',
    links: {
      info:
        'https://graphqlconf2025.sched.com/event/264O0/imagining-the-future-of-graphql-documentation-tooling-jason-kuhrt-the-guild',
      repo: 'https://github.com/jasonkuhrt/tech-talk-2025-polen',
    },
  },
  {
    title: 'Hello Graffle! A Modular Type Safe GraphQL Client',
    venue: 'GraphQLConf 2025',
    date: 'September 2025',
    links: {
      info: 'https://graphqlconf2025.sched.com/event/26zPj',
      repo: 'https://github.com/graffle-js/tech-talk-2025-gql-conf',
    },
  },
  {
    title: 'Discovering Graffle and Some of its TypeScript Techniques',
    venue: 'Montreal TypeScript Meetup',
    date: 'November 2024',
    links: {
      info: 'https://www.meetup.com/typescript-montreal/events/302867057/?eventOrigin=your_events',
      repo: 'https://github.com/graffle-js/tech-talk-2024-11',
    },
  },
  {
    title: 'Introduction to Data Modeling with Algebraic Data Types in TypeScript with Alge',
    venue: 'Berlin TypeScript Meetup #9',
    date: 'August 2022',
    links: {
      info: 'https://www.meetup.com/typescript-berlin/events/287592005/',
      recording: 'https://www.youtube.com/watch?v=JWvy7JXE6vw',
      twitter: 'https://twitter.com/NWoroniec/status/1559506067977011202',
    },
  },
  {
    title:
      "Jason Kuhrt on Prisma, Nexus, Dogfooding Open Source, GraphQL's Early Days, Design Education, Path To Coding, Prisma Learnings, Schema Design, Data Modeling, and beyond",
    venue: 'GraphQL Radio',
    date: 'August 2022',
    links: {
      recording:
        'https://graphqlradio.com/episodes/jason-kuhrt-on-prisma-nexus-dogfooding-open-source-graphql-early-days-design-education-path-to-coding-prisma-learnings-schema-design-data-modeling-and-beyond',
      twitter: 'https://twitter.com/graphqlradio/status/1554117177480863745',
    },
  },
  {
    title: 'Diving into the new Nexus Prisma',
    venue: 'Berlin GraphQL Meetup #25',
    date: 'February 2022',
    links: {
      info: 'https://www.meetup.com/graphql-berlin/events/283094727/',
      recording: 'https://youtu.be/srkTmlFNOyw?t=2046',
      twitter: 'https://twitter.com/prisma/status/1492136994834628613',
    },
  },
  {
    title: 'Introduction to Nexus',
    venue: 'SF Node Meetup',
    date: 'February 2021',
    links: {
      info: 'https://www.meetup.com/sfnode/events/hdgjmryccdbpb/',
      recording: 'https://www.youtube.com/watch?v=WUz5JulzSDA',
      twitter: 'https://twitter.com/sfnode/status/1360305708449689601',
    },
  },
  {
    title: 'Nexus Schema in the Context of Building a Small API',
    venue: 'Node.js Wroclaw Meetup #8',
    date: 'November 2020',
    links: {
      info: 'https://www.meetup.com/node-js-wroclaw/events/274063640/',
      recording: 'https://www.youtube.com/watch?v=Ocr5m5ZsDfE&list=PLyBCIdozqa-QddgDTh4IiiiE3qCywqKpt&index=1',
      twitter: 'https://twitter.com/prisma/status/1328653494010736646',
    },
  },
  {
    title: 'Building a type-safe GraphQL server with Nexus and Prisma',
    venue: 'Prisma Day',
    date: 'June 2020',
    links: {
      info: 'https://www.prisma.io/day-2020/',
      recording: 'https://www.youtube.com/watch?v=oFk4rxz_KO8&feature=youtu.be',
      twitter: 'https://twitter.com/JasonKuhrt/status/1274421971997134851',
    },
  },
]

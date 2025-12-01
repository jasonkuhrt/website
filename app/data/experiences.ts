import {
  Achievement,
  DateString,
  Education,
  Personal,
  Speaking,
  WorkExperience,
} from '../../src/content/experience.js'

/**
 * Experiences
 *
 * Unified timeline of professional experience, education, speaking, achievements, and personal milestones.
 */
export const experiences = [
  WorkExperience.make({
    title: 'Software Engineer',
    company: 'The Guild Software',
    location: 'Montreal, Quebec, Canada · Remote',
    date: DateString.make('Dec 2024'),
    overview: '',
    accomplishments: [],
    technologies: [],
  }),
  WorkExperience.make({
    title: 'Tech Lead',
    company: 'Prisma',
    location: 'Montreal, Quebec, Canada · Remote',
    date: DateString.make('Jan 2021'),
    endDate: DateString.make('Aug 2024'),
    overview: 'Led technical direction for Prisma Data Platform Control Plane.',
    accomplishments: [],
    technologies: ['TypeScript', 'System Architecture', 'Mentoring', 'GraphQL', 'Cloudflare'],
  }),
  WorkExperience.make({
    title: 'Prisma Labs Lead',
    company: 'Prisma',
    location: 'Montreal, Canada Area',
    date: DateString.make('Sep 2019'),
    endDate: DateString.make('Jan 2021'),
    overview: '',
    accomplishments: [],
    technologies: [],
  }),
  WorkExperience.make({
    title: 'Software Engineer',
    company: 'Dialogue',
    location: 'Montreal, Canada Area · On-site',
    date: DateString.make('Apr 2018'),
    endDate: DateString.make('Aug 2019'),
    overview: '',
    accomplishments: [],
    technologies: ['Python', 'FastAPI', 'Amazon Web Services (AWS)', 'Kubernetes', 'DevOps'],
  }),
  WorkExperience.make({
    title: 'Tech Lead',
    company: 'SSENSE',
    location: 'Montreal',
    date: DateString.make('Oct 2016'),
    endDate: DateString.make('Apr 2018'),
    overview: 'Principal Architect for Edge System and Experimentation System. Led R&D for GraphQL adoption.',
    accomplishments: [],
    technologies: ['Kubernetes', 'GraphQL', 'Continuous Deployment'],
  }),
  WorkExperience.make({
    title: 'Lead Platform Architect',
    company: 'littleBits',
    location: 'Montreal / New York',
    date: DateString.make('May 2013'),
    endDate: DateString.make('Jan 2016'),
    overview:
      'Built the realtime distributed cloud system that powers the cloudBit. Built micro-service cloud platform, designed APIs, collaborated on product development, maintained service availability.',
    accomplishments: [],
    technologies: [
      'TLS Server',
      'HTTPS API',
      'WebSocket API',
      'Redis',
      'RethinkDB',
      'Elastic Search',
      'AWS/GCP',
      'Docker/Kubernetes',
      'OAuth 2',
    ],
  }),
  WorkExperience.make({
    title: 'Senior Frontend Engineer',
    company: 'Kenzan Media',
    location: 'Montreal, Canada Area',
    date: DateString.make('Mar 2013'),
    endDate: DateString.make('May 2013'),
    overview:
      'Developed modular UI components and implemented hardest UI views. Implemented 300 page webapp (Angular.js) for Optimum.',
    accomplishments: [],
    technologies: ['Angular.js', 'BEM', 'CSS Architecture'],
  }),
  WorkExperience.make({
    title: 'Senior Frontend Engineer',
    company: 'Presstube Inc',
    location: 'Montreal, Canada Area',
    date: DateString.make('Nov 2012'),
    endDate: DateString.make('Mar 2013'),
    overview: 'Architected frontend stack for large team.',
    accomplishments: [],
    technologies: ['Grunt', 'LESS', 'Angular', 'Karma'],
  }),
  WorkExperience.make({
    title: 'Designer / Frontend Engineer',
    company: 'Taking Root',
    location: 'Montreal, Canada Area',
    date: DateString.make('Jul 2012'),
    endDate: DateString.make('Nov 2012'),
    overview:
      'Designed + Built CO2R web app showcasing carbon footprint reduction impact supporting reforestation and community development in Nicaragua',
  }),
  WorkExperience.make({
    title: 'Art Director / Frontend Engineer',
    company: 'Artfox',
    location: 'Montreal, Canada Area',
    date: DateString.make('Jul 2011'),
    endDate: DateString.make('May 2012'),
    overview:
      'Brainstormed platform features. Designed/Implemented UI Views. Designed brand touch-points (newsletter, documents)',
  }),
  WorkExperience.make({
    title: 'Graphic Designer',
    company: 'Kenneth Dean, Prof., McGill University',
    location: 'Montreal, Canada Area',
    date: DateString.make('Nov 2010'),
    endDate: DateString.make('Feb 2011'),
    overview:
      'Designed poster/website/jewel-case for film Bored in Heaven - a documentary exploring ritualistic tradition renaissance in south-east China',
  }),
  WorkExperience.make({
    title: 'UI Designer / Frontend Engineer',
    company: 'TANK',
    location: 'Montreal, Canada Area',
    date: DateString.make('Nov 2010'),
    endDate: DateString.make('Jan 2011'),
    overview: 'Built modular CSS system. Designed UI views',
  }),
  WorkExperience.make({
    title: 'UI/X Designer / Frontend Engineer',
    company: 'Bluesponge',
    location: 'Montreal, Canada Area',
    date: DateString.make('Sep 2010'),
    endDate: DateString.make('Oct 2010'),
    overview:
      'Designed/Built microsite prototype for CCA Journeys - digital experience for exhibition on global movement research',
  }),
  WorkExperience.make({
    title: 'Intern UI/X Designer / Fullstack Engineer',
    company: 'Icograda',
    location: 'Montreal, Canada Area',
    date: DateString.make('May 2009'),
    endDate: DateString.make('Sep 2009'),
    overview:
      "Designed/Built Icograda's Biennial Review - reimagined printed booklet as digital platform for World Design Congress",
  }),
  WorkExperience.make({
    title: 'Graphic Designer',
    company: 'Concordia University',
    location: 'Montreal, Canada Area',
    date: DateString.make('Aug 2008'),
    endDate: DateString.make('Oct 2008'),
    overview: 'Designed/Built poster/microsite for Portfolio Day in Montreal',
  }),
  WorkExperience.make({
    title: 'Graphic Designer Intern',
    company: 'Icograda',
    location: 'Montreal, Canada Area',
    date: DateString.make('May 2007'),
    endDate: DateString.make('Sep 2007'),
    overview: 'Designed poster for the World Design Congress 2007',
  }),
  WorkExperience.make({
    title: 'Graphic Designer',
    company: "time's thievish progress to eternity FILMS",
    location: 'Montreal, Canada Area',
    date: DateString.make('Oct 2007'),
    endDate: DateString.make('Oct 2013'),
    overview:
      'Designed poster for Montreal Stories 1944. Designed/Built poster/microsite for At the Bottom of the Hill. Designed poster/package for Woman in Car. Designed/Built website for filmmaker Vanya Rose',
  }),
  Education.make({
    institution: 'Concordia University',
    degree: 'BFA, Design',
    date: DateString.make('2005'),
    endDate: DateString.make('2010'),
    description:
      'President, Concordia Design Students · Council Member, Fine Arts, Concordia Student Union · Exchange to Bremen (Germany) at Master-level studies · Golden Key Honour Society Member · Graduating project "Sousveillance" included in the Canadian Art and Surveillance database',
  }),
  Education.make({
    institution: 'HSB Hochschule Bremen – City University of Applied Sciences',
    degree: 'Design',
    date: DateString.make('2007'),
    endDate: DateString.make('2008'),
    description: 'Exchange program',
  }),
  Achievement.make({
    title: 'Founding Member',
    issuer: 'littleBits',
    date: DateString.make('Jul 2015'),
    description:
      'Recognized as a Founding Member for joining littleBits when it was a small startup in May 2013. Principal role in building the Cloud Platform from scratch',
  }),
  Achievement.make({
    title: 'Special Selection',
    issuer: 'Art & Surveillance',
    date: DateString.make('Jun 2015'),
    description:
      '"Sousveillance" selected for inclusion in a curated gallery of Canadian Artworks that tackle the topic of Surveillance',
  }),
  Achievement.make({
    title: 'Special Selection',
    issuer: 'Justseeds',
    date: DateString.make('Oct 2012'),
    description: '"Wall" selected for inclusion in the Justseeds collection, an Artists\' Cooperative',
  }),
  Achievement.make({
    title: 'Special Invitation',
    issuer: 'Golden Key Honour Society',
    date: DateString.make('Nov 2010'),
    description: 'Admitted into the Golden Key Honour Society following the completion of BFA',
  }),
  Achievement.make({
    title: 'Semi-finalist, Adobe Design Achievement Awards',
    issuer: 'Adobe',
    date: DateString.make('Jun 2008'),
    description:
      'Poster design for the World Design Congress (2007) was a semi-finalist in the 2008 Adobe Design Achievement Awards',
  }),
  Speaking.make({
    title: 'Imagining the Future of GraphQL Documentation Tooling',
    venue: 'GraphQLConf 2025',
    date: DateString.make('September 2025'),
    links: {
      info:
        'https://graphqlconf2025.sched.com/event/264O0/imagining-the-future-of-graphql-documentation-tooling-jason-kuhrt-the-guild',
      repo: 'https://github.com/jasonkuhrt/tech-talk-2025-polen',
    },
  }),
  Speaking.make({
    title: 'Hello Graffle! A Modular Type Safe GraphQL Client',
    venue: 'GraphQLConf 2025',
    date: DateString.make('September 2025'),
    links: {
      info: 'https://graphqlconf2025.sched.com/event/26zPj',
      repo: 'https://github.com/graffle-js/tech-talk-2025-gql-conf',
    },
  }),
  Speaking.make({
    title: 'Discovering Graffle and Some of its TypeScript Techniques',
    venue: 'Montreal TypeScript Meetup',
    date: DateString.make('November 2024'),
    links: {
      info: 'https://www.meetup.com/typescript-montreal/events/302867057/?eventOrigin=your_events',
      repo: 'https://github.com/graffle-js/tech-talk-2024-11',
    },
  }),
  Speaking.make({
    title: 'Introduction to Data Modeling with Algebraic Data Types in TypeScript with Alge',
    venue: 'Berlin TypeScript Meetup #9',
    date: DateString.make('August 2022'),
    links: {
      info: 'https://www.meetup.com/typescript-berlin/events/287592005/',
      recording: 'https://www.youtube.com/watch?v=JWvy7JXE6vw',
      twitter: 'https://twitter.com/NWoroniec/status/1559506067977011202',
    },
  }),
  Speaking.make({
    title:
      "Jason Kuhrt on Prisma, Nexus, Dogfooding Open Source, GraphQL's Early Days, Design Education, Path To Coding, Prisma Learnings, Schema Design, Data Modeling, and beyond",
    venue: 'GraphQL Radio',
    date: DateString.make('August 2022'),
    links: {
      recording:
        'https://graphqlradio.com/episodes/jason-kuhrt-on-prisma-nexus-dogfooding-open-source-graphql-early-days-design-education-path-to-coding-prisma-learnings-schema-design-data-modeling-and-beyond',
      twitter: 'https://twitter.com/graphqlradio/status/1554117177480863745',
    },
  }),
  Speaking.make({
    title: 'Diving into the new Nexus Prisma',
    venue: 'Berlin GraphQL Meetup #25',
    date: DateString.make('February 2022'),
    links: {
      info: 'https://www.meetup.com/graphql-berlin/events/283094727/',
      recording: 'https://youtu.be/srkTmlFNOyw?t=2046',
      twitter: 'https://twitter.com/prisma/status/1492136994834628613',
    },
  }),
  Speaking.make({
    title: 'Introduction to Nexus',
    venue: 'SF Node Meetup',
    date: DateString.make('February 2021'),
    links: {
      info: 'https://www.meetup.com/sfnode/events/hdgjmryccdbpb/',
      recording: 'https://www.youtube.com/watch?v=WUz5JulzSDA',
      twitter: 'https://twitter.com/sfnode/status/1360305708449689601',
    },
  }),
  Speaking.make({
    title: 'Nexus Schema in the Context of Building a Small API',
    venue: 'Node.js Wroclaw Meetup #8',
    date: DateString.make('November 2020'),
    links: {
      info: 'https://www.meetup.com/node-js-wroclaw/events/274063640/',
      recording: 'https://www.youtube.com/watch?v=Ocr5m5ZsDfE&list=PLyBCIdozqa-QddgDTh4IiiiE3qCywqKpt&index=1',
      twitter: 'https://twitter.com/prisma/status/1328653494010736646',
    },
  }),
  Speaking.make({
    title: 'Building a type-safe GraphQL server with Nexus and Prisma',
    venue: 'Prisma Day',
    date: DateString.make('June 2020'),
    links: {
      info: 'https://www.prisma.io/day-2020/',
      recording: 'https://www.youtube.com/watch?v=oFk4rxz_KO8&feature=youtu.be',
      twitter: 'https://twitter.com/JasonKuhrt/status/1274421971997134851',
    },
  }),
  Personal.make({
    title: 'My first son Roman is born',
    date: DateString.make('July 2011'),
    icon: 'Baby',
  }),
  Personal.make({
    title: 'Move to NYC',
    date: DateString.make('March 2014'),
    icon: 'MapPin',
  }),
  Personal.make({
    title: 'Launch cloudBit at TED',
    date: DateString.make('March 2014'),
    icon: 'Heart',
    description:
      'Preview of littleBits cloudBit at TED2014 conference in Vancouver. Official product launch followed in July 2014.',
    url: 'https://en.wikipedia.org/wiki/LittleBits',
  }),
  Personal.make({
    title: 'Move back to Montreal',
    date: DateString.make('July 2015'),
    icon: 'Home',
  }),
  Personal.make({
    title: 'My second son Willem is born',
    date: DateString.make('March 2016'),
    icon: 'Baby',
  }),
  Personal.make({
    title: 'First Rocky Mountains Expedition',
    date: DateString.make('July 2023'),
    icon: 'Mountain',
  }),
  Personal.make({
    title: 'ADHD positive assessment',
    date: DateString.make('December 2023'),
    icon: 'Brain',
  }),
  Personal.make({
    title: 'Second Rocky Mountains Expedition',
    date: DateString.make('August 2025'),
    icon: 'Mountain',
  }),
]

import { Experience } from '../src/content/experience.js'

export default Experience.Store.makeMany(
  {
    _tag: 'work',
    title: 'Open Source Developer',
    company: 'The Guild Software',
    location: 'Montreal, Quebec, Canada · Remote',
    date: 'Dec 2024',
    endDate: 'Sep 2025',
    overview: 'Developed Polen, a new framework for building developer portals.',
    accomplishments: [
      'Market research on developer portal tooling',
      'Developed Polen, a new framework for building developer portals',
      "Presented Polen at GraphQL Conf '25 in Amsterdam",
    ],
    technologies: ['TypeScript', 'NodeJS', 'Effect', 'Claude Code', 'Vite', 'Rolldown'],
    projects: [
      {
        name: 'Polen',
        description:
          'Deep dive into ground-up framework over Vite/Rolldown. Got up to speed on tools like Radix, MDX, Tree-Sitter, CodeHike, Shiki, and more. Effect schema modelling of the GraphQL data types (schema, versioned schema, etc.) for serialization and type safety. Novel versioned schema support. R&D Hydra abstraction for Effect Schema that added a new combinator to encode breakpoints into schemas to facilitate navigation-driven data structure loading allowing for performant navigation of schemas of any size (e.g. the SDL of GH API is 30k LOC). Learned to integrate Claude Code (Opus 4) agentic workflows into daily practice.',
      },
    ],
  },
  {
    _tag: 'work',
    title: 'Tech Lead',
    company: 'Prisma',
    location: 'Montreal, Quebec, Canada · Remote',
    date: 'Jan 2021',
    endDate: 'Aug 2024',
    overview: 'Led technical direction for Prisma Data Platform Control Plane.',
    accomplishments: [
      'Control Plane architecture of Prisma Cloud',
      'Planning, task breakdown, mentoring, leadership',
    ],
    technologies: [
      'TypeScript',
      'CloudFlare Workers',
      'Queues',
      'Prisma',
      'Remix',
      'GraphQL',
      'Postgres',
      'Fly',
      'NextJS',
      'Relay',
    ],
    projects: [
      {
        name: 'Control Plane',
        description:
          'Initial first version was NextJS on Vercel, using GraphQL Prisma and Relay. Brief second version was Edge Microservices on Fly. Final third version was Remix on CloudFlare, using GraphQL model layer executed in memory by Remix loaders to supply data to views + exposed on api endpoint to power public API. CI/CD, scripting fly/cloudflare for automated E2E tests via ephemeral on-demand infra per PR. General mentorship and full stack development, leading type-safe patterns for full-stack feature development. Stripe resource definitions pipeline, declarative price and plan definitions synchronized to Stripe price/products. Stripe subscription usage metering integration, nightly cron jobs that queued jobs to optimally sync customer usage for accurate billing. Complex cancellation/refund/proration logic handling various edge cases. Augmented an existing fragile Prisma CLI with cloud features powered by the Control Plane API. Leading data modelling in postgres, dogfooding Prisma, thoughtful relations, maximizing potential to encode invariants in the data model.',
      },
    ],
  },
  {
    _tag: 'work',
    title: 'Prisma Labs Lead',
    company: 'Prisma',
    location: 'Montreal, Canada Area',
    date: 'Sep 2019',
    endDate: 'Jan 2021',
    overview: 'Developed Nexus Framework, open source tool for rapid development of GraphQL APIs.',
    accomplishments: [
      'Triage and organize open source portfolio',
      'Developed Nexus Framework, open source tool for rapid development of GraphQL APIs',
    ],
    technologies: ['TypeScript', 'GraphQL'],
    projects: [
      {
        name: 'Nexus',
        description:
          'R&D on turning Nexus Library into a framework, a CLI tool. Innovative framework for rapid type safe GraphQL API development. Presented at Prisma Day 2. Executive decision to change direction, reverting back to library and getting it to 1.0 in collaboration with external author Tim Griesser.',
      },
    ],
  },
  {
    _tag: 'work',
    title: 'Software Engineer',
    company: 'Dialogue',
    location: 'Montreal, Canada Area · On-site',
    date: 'Apr 2018',
    endDate: 'Aug 2019',
    overview:
      'Backend development across core services. Collaborated closely with Ops lead to successfully pitch, design, and implement an internal PaaS platform.',
    accomplishments: [
      'Backend development across core services',
      'Collaborated closely with Ops lead to successfully pitch, design, and implement an internal PaaS platform to streamline microservice deployments',
    ],
    technologies: [
      'Python',
      'FastAPI',
      'Pydantic',
      'AWS Kinesis',
      'AWS Lambda',
      'Step Functions',
      'Terraform',
      'Auth0',
      'Kubernetes',
      'Helm',
    ],
    projects: [
      {
        name: 'Internal PaaS',
        description:
          'Infrastructure as code with Helm charts and Terraform. CircleCI pipeline automation and reusable orbs. FastAPI application templates and scaffolding. Structured logging standards across services. Automated preview environments with integrated log platform routing. Auth0 Terraform automation streamlining inter-service authentication flows.',
      },
    ],
  },
  {
    _tag: 'work',
    title: 'Tech Lead',
    company: 'SSENSE',
    location: 'Montreal',
    date: 'Oct 2016',
    endDate: 'Apr 2018',
    overview: 'Principal Architect for Edge System and Experimentation System. Led R&D for GraphQL adoption.',
    accomplishments: [
      'Tech lead Personalized Email Marketing Optimization',
      'Principal Architect Edge System',
      'Principal Architect Experimentation System',
      'GraphQL R&D',
      'Vendor analysis, load testing',
      'Team management, sprint planning, review, backlog refinement',
      'Interviewing, scouted promising juniors',
    ],
    technologies: [
      'Kubernetes',
      'Vue',
      'Fastly',
      'Terraform',
      'NodeJS',
      'VCL',
      'Google Optimize',
      'Express',
      'GitHub Actions',
    ],
    projects: [
      {
        name: 'Experimentation System',
        description:
          'After evaluating Google Optimize and Optimizely, championed Google Optimize for its Bayesian statistics approach (enabling faster statistical significance), native Google Analytics integration, and cost efficiency. Leading a 2-person engineering team, architected an end-to-end A/B testing platform built on three key pillars: CDN layer—Fastly/Varnish VCL with Vary headers for cache variation and Surrogate-Key tagging for selective purging, enabling intelligent cache bypass for pages under test; Application layer—custom Express middleware distributed as an internal NPM package, coordinating with CDN-level experiment configuration; Analytics layer—Google Optimize integration for Bayesian statistical analysis. The infrastructure was managed through a GitHub Actions workflow with Terraform-deployed VCL logic and JSON-based experiment definitions, enabling product teams to practically self-serve launch data-driven feature rollouts with minimal performance impact.',
      },
      {
        name: 'Personalized Email Marketing',
        description:
          'Led a 4-person engineering team with a dedicated PM and data scientist to transform SSENSE\'s weekly "For You" email campaigns from static, hand-curated product picks into a data-driven personalization system. Architected an automated pipeline using React templates, Mailchimp API integration, and data science model outputs, supporting 3 subscription campaign variants with rapid weekly iteration. Through systematic refinement with fashion marketing stakeholders, achieved consistent week-over-week improvements across all key metrics—open rates, click-through rates, conversions, and revenue.',
      },
    ],
  },
  {
    _tag: 'work',
    title: 'Lead Platform Architect',
    company: 'littleBits',
    location: 'Montreal / New York',
    date: 'May 2013',
    endDate: 'Jan 2016',
    overview:
      'Built the realtime distributed cloud system that powers the cloudBit. Built micro-service cloud platform, designed APIs, collaborated on product development, maintained service availability.',
    accomplishments: [
      'Founding Engineer',
      'Architected a realtime distributed cloud system for the cloudBit module',
      'REST+Websocket realtime API for cloudBit read/write interaction',
      'Architected observability system',
      'IFTTT integration',
      'Product vision/development collaboration',
      'Initiated first React meetup in NYC',
    ],
    technologies: [
      'TCP',
      'TLS',
      'REST API',
      'WebSocket API',
      'Redis',
      'RethinkDB',
      'Elastic Search',
      'AWS',
      'GCP',
      'Docker',
      'Kubernetes',
      'OAuth 2',
    ],
    projects: [
      {
        name: 'Social IoT Product Vision',
        description:
          'Identified a strategic product opportunity to motivate multiple cloudBit purchases through powerful composition visualization and social collaboration tools. Championed a visual orchestration system enabling users to manage multi-cloudBit circuits through intuitive UI—configuring device relationships (fan out, in etc.), naming schemes (doorbell, trigger, dispenser), and privacy modes including public access (e.g. interactive artist installations). The centerpiece innovation was "multiplayer mode": allowing users to discover and subscribe to other users\' circuits, creating a social IoT ecosystem and alternative/complement to software social media, a platform where creative projects could be discovered, remixed, and built upon. Designed semantics, terminologies, concepts, and diagrams of various networking possibilities and layouts, and shared the vision across multiple leadership meetings, navigating the strategic tension between the company\'s hardware-first identity and the platform leverage opportunity.',
      },
    ],
  },
  {
    _tag: 'work',
    title: 'Senior Frontend Engineer',
    company: 'Kenzan Media',
    location: 'Montreal, Canada Area',
    date: 'Mar 2013',
    endDate: 'May 2013',
    overview:
      'Developed modular UI components and implemented hardest UI views. Implemented 300 page webapp (Angular.js) for Optimum.',
    accomplishments: [],
    technologies: ['Angular.js', 'BEM', 'CSS Architecture'],
  },
  {
    _tag: 'work',
    title: 'Senior Frontend Engineer',
    company: 'Presstube Inc',
    location: 'Montreal, Canada Area',
    date: 'Nov 2012',
    endDate: 'Mar 2013',
    overview: 'Architected frontend stack for large team.',
    accomplishments: [],
    technologies: ['Grunt', 'LESS', 'Angular', 'Karma'],
  },
  {
    _tag: 'work',
    title: 'Designer / Frontend Engineer',
    company: 'Taking Root',
    location: 'Montreal, Canada Area',
    date: 'Jul 2012',
    endDate: 'Nov 2012',
    overview:
      'Designed + Built CO2R web app showcasing carbon footprint reduction impact supporting reforestation and community development in Nicaragua',
  },
  {
    _tag: 'work',
    title: 'Art Director / Frontend Engineer',
    company: 'Artfox',
    location: 'Montreal, Canada Area',
    date: 'Jul 2011',
    endDate: 'May 2012',
    overview:
      'Brainstormed platform features. Designed/Implemented UI Views. Designed brand touch-points (newsletter, documents)',
  },
  {
    _tag: 'work',
    title: 'Graphic Designer',
    company: 'Kenneth Dean, Prof., McGill University',
    location: 'Montreal, Canada Area',
    date: 'Nov 2010',
    endDate: 'Feb 2011',
    overview:
      'Designed poster/website/jewel-case for film Bored in Heaven - a documentary exploring ritualistic tradition renaissance in south-east China',
  },
  {
    _tag: 'work',
    title: 'UI Designer / Frontend Engineer',
    company: 'TANK',
    location: 'Montreal, Canada Area',
    date: 'Nov 2010',
    endDate: 'Jan 2011',
    overview: 'Built modular CSS system. Designed UI views',
  },
  {
    _tag: 'work',
    title: 'UI/X Designer / Frontend Engineer',
    company: 'Bluesponge',
    location: 'Montreal, Canada Area',
    date: 'Sep 2010',
    endDate: 'Oct 2010',
    overview:
      'Designed/Built microsite prototype for CCA Journeys - digital experience for exhibition on global movement research',
  },
  {
    _tag: 'work',
    title: 'Intern UI/X Designer / Fullstack Engineer',
    company: 'Icograda',
    location: 'Montreal, Canada Area',
    date: 'May 2009',
    endDate: 'Sep 2009',
    overview:
      "Designed/Built Icograda's Biennial Review - reimagined printed booklet as digital platform for World Design Congress",
  },
  {
    _tag: 'work',
    title: 'Graphic Designer',
    company: 'Concordia University',
    location: 'Montreal, Canada Area',
    date: 'Aug 2008',
    endDate: 'Oct 2008',
    overview: 'Designed/Built poster/microsite for Portfolio Day in Montreal',
  },
  {
    _tag: 'work',
    title: 'Graphic Designer Intern',
    company: 'Icograda',
    location: 'Montreal, Canada Area',
    date: 'May 2007',
    endDate: 'Sep 2007',
    overview: 'Designed poster for the World Design Congress 2007',
  },
  {
    _tag: 'work',
    title: 'Graphic Designer',
    company: "time's thievish progress to eternity FILMS",
    location: 'Montreal, Canada Area',
    date: 'Oct 2007',
    endDate: 'Oct 2013',
    overview:
      'Designed poster for Montreal Stories 1944. Designed/Built poster/microsite for At the Bottom of the Hill. Designed poster/package for Woman in Car. Designed/Built website for filmmaker Vanya Rose',
  },
  {
    _tag: 'education',
    institution: 'Concordia University',
    degree: 'BFA, Design',
    date: '2005',
    endDate: '2010',
    description:
      'President, Concordia Design Students · Council Member, Fine Arts, Concordia Student Union · Exchange to Bremen (Germany) at Master-level studies · Golden Key Honour Society Member · Graduating project "Sousveillance" included in the Canadian Art and Surveillance database',
  },
  {
    _tag: 'education',
    institution: 'HSB Hochschule Bremen – City University of Applied Sciences',
    degree: 'Design',
    date: '2007',
    endDate: '2008',
    description: 'Exchange program',
  },
  {
    _tag: 'achievement',
    title: 'Founding Member',
    issuer: 'littleBits',
    date: 'Jul 2015',
    description:
      'Recognized as a Founding Member for joining littleBits when it was a small startup in May 2013. Principal role in building the Cloud Platform from scratch',
  },
  {
    _tag: 'achievement',
    title: 'Special Selection',
    issuer: 'Art & Surveillance',
    date: 'Jun 2015',
    description:
      '"Sousveillance" selected for inclusion in a curated gallery of Canadian Artworks that tackle the topic of Surveillance',
  },
  {
    _tag: 'achievement',
    title: 'Special Selection',
    issuer: 'Justseeds',
    date: 'Oct 2012',
    description: '"Wall" selected for inclusion in the Justseeds collection, an Artists\' Cooperative',
  },
  {
    _tag: 'achievement',
    title: 'Special Invitation',
    issuer: 'Golden Key Honour Society',
    date: 'Nov 2010',
    description: 'Admitted into the Golden Key Honour Society following the completion of BFA',
  },
  {
    _tag: 'achievement',
    title: 'Semi-finalist, Adobe Design Achievement Awards',
    issuer: 'Adobe',
    date: 'Jun 2008',
    description:
      'Poster design for the World Design Congress (2007) was a semi-finalist in the 2008 Adobe Design Achievement Awards',
  },
  {
    _tag: 'speaking',
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
    _tag: 'speaking',
    title: 'Hello Graffle! A Modular Type Safe GraphQL Client',
    venue: 'GraphQLConf 2025',
    date: 'September 2025',
    links: {
      info: 'https://graphqlconf2025.sched.com/event/26zPj',
      repo: 'https://github.com/graffle-js/tech-talk-2025-gql-conf',
    },
  },
  {
    _tag: 'speaking',
    title: 'Discovering Graffle and Some of its TypeScript Techniques',
    venue: 'Montreal TypeScript Meetup',
    date: 'November 2024',
    links: {
      info: 'https://www.meetup.com/typescript-montreal/events/302867057/?eventOrigin=your_events',
      repo: 'https://github.com/graffle-js/tech-talk-2024-11',
    },
  },
  {
    _tag: 'speaking',
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
    _tag: 'speaking',
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
    _tag: 'speaking',
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
    _tag: 'speaking',
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
    _tag: 'speaking',
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
    _tag: 'speaking',
    title: 'Building a type-safe GraphQL server with Nexus and Prisma',
    venue: 'Prisma Day',
    date: 'June 2020',
    links: {
      info: 'https://www.prisma.io/day-2020/',
      recording: 'https://www.youtube.com/watch?v=oFk4rxz_KO8&feature=youtu.be',
      twitter: 'https://twitter.com/JasonKuhrt/status/1274421971997134851',
    },
  },
  {
    _tag: 'personal',
    title: 'My first son Roman is born',
    date: 'July 2011',
    icon: 'Baby',
  },
  {
    _tag: 'personal',
    title: 'Move to NYC',
    date: 'March 2014',
    icon: 'MapPin',
  },
  {
    _tag: 'personal',
    title: 'Launch cloudBit at TED',
    date: 'March 2014',
    icon: 'Heart',
    description:
      'Preview of littleBits cloudBit at TED2014 conference in Vancouver. Official product launch followed in July 2014.',
    url: 'https://en.wikipedia.org/wiki/LittleBits',
  },
  {
    _tag: 'personal',
    title: 'Move back to Montreal',
    date: 'July 2015',
    icon: 'Home',
  },
  {
    _tag: 'personal',
    title: 'My second son Willem is born',
    date: 'March 2016',
    icon: 'Baby',
  },
  {
    _tag: 'personal',
    title: 'First Rocky Mountains Expedition',
    date: 'July 2023',
    icon: 'Mountain',
  },
  {
    _tag: 'personal',
    title: 'ADHD positive assessment',
    date: 'December 2023',
    icon: 'Brain',
  },
  {
    _tag: 'personal',
    title: 'Second Rocky Mountains Expedition',
    date: 'August 2025',
    icon: 'Mountain',
  },
)

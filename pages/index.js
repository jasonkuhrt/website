import React from "react"
import Banner from "../components/Banner"

const Index = () => (
  <div id="app">
    <Banner />
    <ul className="ExternalLinks">
      <li>
        <a href="https://blog.jasonkuhrt.com">Blog</a>
      </li>
      <li>
        <a href="/static/resume.pdf" target="_blank">
          Resume
        </a>
      </li>
      <li>
        <a href="https://github.com/jasonkuhrt">Github</a>
      </li>
      <li>
        <a href="https://twitter.com/jasonkuhrt">Twitter</a>
      </li>
      <li>
        <a href="https://www.behance.net/KUHRT">Behance</a>
      </li>
      <li>
        <a href="mailto:jasonkuhrt@me.com">Email</a>
      </li>
    </ul>
    <section className="Section">
      <h1>Hello!</h1>
      <p>
        Hi, my name is Jason Kuhrt. I am a design-minded self-taught
        functionally-oriented software engineer with over seven years experience
        shipping web-related softare into production. I earned a Bachelor of
        Fine Arts majoring in design at Concordia University where systems,
        theory, and society were foundational. Since then I have also become a
        passionate builder of software yet have not only maintained but
        furthered my capabilities in ideation, interdisciplinary collaboration,
        design thinking, research, and synthesis.
      </p>
      <h2>My status</h2>
      <p>
        I am currently based in Montreal working at{" "}
        <a href="https://www.ssense.com">SSENSE</a> where I lead an amazing team
        and am principal architect on a few systems namely Experiment, Edge, and
        Email. I am not currently taking contracts but none the less do not
        hesitate to get in touch be it a particular opportunity or just an
        open-ended nerd session over drinks. No recruiters please.
      </p>
    </section>
    <section className="Section">
      <h1>Technical Work</h1>

      <p>
        The following is a rough sketch of some of my granular experiences. For
        a brief and formal overview refer to my{" "}
        <a href="/static/resume.pdf" target="_blank">
          resume
        </a>.
      </p>

      <h2>Edge Architecture, Fastly CDN / Varnish</h2>
      <ul>
        <li>Custom VCL (not relying on Fastly UI)</li>
        <li>Terraform based deploys on a weekly frequency</li>
        <li>
          Complex redirects and routing logic inlcuding use of lookup tables,
          geo, complex regex on request paths
        </li>
        <li>
          Advanced understanding of Varnish state machine behaviour between
          different sub-routines
        </li>
        <li>
          Maximize cache coverage, validate use-cases, document, teach other
          teams, diagram
        </li>
        <li>
          Test suite built in TypeScript/Jest; 100+ different checks run on
          every pull-request
        </li>
      </ul>

      <h2>Experiment System</h2>
      <ul>
        <li>
          Built A/B testing system on server-side-rendered
          single-page-application sitting behind a caching CDN
        </li>
        <li>Integrated Express, Vue, Fastly, Google Optimize</li>
        <li>
          Comprehensive understanding of Varnish to implement at the CDN level
          variant assignment, fully optimized cache coverage, traffic inclusion
          control, mutual-exclusion between tests, etc.
        </li>
        <li>Evaluated vendors Google Optimize and Optimizely</li>
        <li>
          Seamless vue integration for accessing experiment data at component
          level isomorphically over client or server side
        </li>
      </ul>

      <h2>Realtime cloudBit Platform</h2>
      <ul>
        <li>docker-deployed services onto AWS EC2 with auto-scaling groups</li>
        <li>TLS service connected to by cloudBit IoT hardware product</li>
        <li>Simple JSON-like protocol over TLS</li>
        <li>HTTP and WebSocket API sevices secured by OAuth 2</li>
        <li>
          Redis for pub-sub communication and small set of application data
        </li>
        <li>realtime cloudBit-to-cloudBit subscription system</li>
        <li>React/fluxxor (before redux) web app</li>
        <li>Logs into ELK stack</li>
      </ul>

      <h2>Dev of DevOps</h2>
      <ul>
        <li>Early adoptor of kubernetes, docker, terraform</li>
        <li>
          Developer-level understanding of kubernetes and community; how to
          leverage it, aware of important tools and players in the community
        </li>
        <li>
          Experience with k8s resources: Deployment, Ingress, Service, Pod,
          ReplicationController, Secrets
        </li>
        <li>Worked with ELK stack to handle logs. Effective with Kibana.</li>
        <li>
          Perspective on effective Git practices and supporting tools (hub,
          release, etc.)
        </li>
        <li>
          Experience with and understanding of concepts in continuous
          integration (Travis, Circle) and continuous deployment (Go CD,
          interest in Drone)
        </li>
      </ul>

      <h2>Other</h2>
      <ul>
        <li>
          Strong theoretical undertanding of GraphQL and various prototypes
          under my belt; understand the type system, query language, use-cases,
          community
        </li>
        <li>
          Exposure to Nodejs HTTP-based microservices on kubernetes at SSENSE
          (30+ services); request tracing, New Relic, Data Dog; have witnessed
          the problems of scaling without the fundamentals in place
        </li>
        <li>
          personally interested in{" "}
          <a https="https://www.google.ca/search?q=event-sourcing+architecture">
            event-sourcing architectures
          </a>, GraphQL, gRPC, kafka;
        </li>
      </ul>

      <h2>Leadership & Culture</h2>
      <ul>
        <li>Lead teams from 2-8</li>
        <li>Open-soure adovcate</li>
        <li>Harmony, openness, intellectual rigor, why why why</li>
        <li>
          treat peers not by title but merit of input on
          discussion-by-discussion basis (junior on this topic, senior there,
          intermediate ..., etc.)
        </li>
        <li>
          Informal lead-by-inspiration style with high expectations on effort
          and rigor from all and significant autonomy given routinely
        </li>
        <li>
          Believe in giving room to experiment, fail, learn and come up with
          novel solutions
        </li>
        <li>
          Interested in fostering positive divergences that allow converging
          upon the best ideas and outcomes and generally keeping a low bar to
          new trying new ideas; better hiring, tech, happiness, innovation,
          motivation, business
        </li>
        <li>
          Generally move-fast approach favouring eventual-perfection over
          short-term perfection; constant iteration with real committment to
          refactoring; win real world feedback more often and faster for both
          for business and engineering
        </li>
        <li>
          Engineers need to feel connected to their field and have space to
          contribute back
        </li>
        <li>
          Software engineering takes many forms in my opinion; the kind I'm
          experienced with is as creative act, dynamic problem solving,
          inspiration, practical cleverness, raw experience, principaled
          investigation, taste, intellectual honesty, and more to form what is
          arguably a craft before applied science; math and science are dear to
          my heart and I love functional programming which is more principaled
          than mainstream software approaches but there is an art to the
          practice as well that I respect
        </li>
      </ul>
    </section>
    <section className="Section">
      <h1>More About Me</h1>

      <h2>Ethos</h2>
      <p>
        I am a generalist in the pursuit of elegant systems primarily among the
        fields of engineering, design, and art. I am driven by a passion to
        substitute the ogre of chaos for qualities of simplicity and humanity,
        consistency and honesty, transparency and accountability. To this end, I
        prioritize opportunities encompassing systemic problem solving.
      </p>

      <h2>@ssense</h2>
      <p>TODO</p>

      <h2>@littleBits</h2>
      <p>
        I built the realtime distributed cloud system at littleBits that powers
        the cloudBit. The cloudBit was an "Internet of Things" (IoT) product
        realized as a prized module in the littleBits library. It bridged
        communication between a user's circuit and the internet. The internet
        became a physical building block. For a medium otherwise invisible to
        the senses this bore a potent feeling that we could revolutionize
        people's relation to connectivity!
      </p>
      <p>
        To realize this platform I built a number of backend services including
        a TLS Server, an HTTPS API, a Web Socket API. Tools used included Redis
        and RethinkDB for data/messaging, Elastic Search for log analysis,
        AWS/GCP for infrastructure, docker/kubernetes for deployment, OAuth 2. I
        also built the control app in React where users setup, managed, and
        interacted with their cloudBit. Furthermore I helped grow the team,
        researched advanced platform features, made internal CLI tools, weighed
        in on product decisions, contributed leadership, and more.
      </p>
    </section>
    <style jsx global>{`
      html,
      body {
        margin: 0;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: normal;
        margin-top: 3rem;
        margin-bottom: 1.5rem;
      }

      * {
        box-sizing: border-box;
      }

      html {
        font-family: monospace;
        font-size: 16px;
        line-height: 1.5;
        color: hsl(0, 0%, 12%);
      }
    `}</style>
    <style jsx>{`
      .ExternalLinks {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .ExternalLinks li:not(:first-child) {
        margin-left: 1rem;
      }
      #appContainer {
        width: 100%;
        height: 100%;
        display: flex;
      }

      #app {
        min-height: 100%;
        max-width: 40rem;
        display: flex;
        flex-direction: column;
        padding-left: 3rem;
        padding-right: 3rem;
        margin-bottom: 10vh;
        margin-left: auto;
        margin-right: auto;
      }
      @media screen and (max-device-width: 400px) {
        #app {
          padding-left: 2rem;
          padding-right: 2rem;
        }
      }

      #banner {
        margin-top: 20vw;
      }

      .Avatar {
        line-height: 1;
      }

      .Section {
        margin-top: 6rem;
      }

      .DotCyan {
        color: hsl(137, 96%, 44%);
      }

      .DotMagenta {
        color: hsl(336, 100%, 75%);
      }

      .DotBlue {
        color: hsl(195, 100%, 50%);
      }

      .DotPurple {
        color: hsl(278, 80%, 51%);
      }

      h2 {
        font-size: 0.8rem;
        text-transform: uppercase;
        /*opacity: 0.75;*/
        margin-top: 1.5rem;
        /*text-align: center;*/
        font-weight: bold;
      }
    `}</style>
  </div>
)

export default Index

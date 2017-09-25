import React from "react"
import Banner from "../components/Banner"

const Index = () =>
  <div id="app">
    <Banner />
    <section className="Section">
      <h1>Hello!</h1>
      <p>Hi, my name is Jason Kuhrt. I am a design-minded self-taught functionally-oriented software engineer with over five years experience creating web apps and backend systems. Recently I helped lead development of the realtime distributed cloud system at littleBits that powers the cloudBit. I earned a BFA majoring in design at Concordia University where systems, theory, and society were foundational. I can get a computer to do the right thing, yet I am adept at ideation, interdisciplinary collaboration, design thinking, research, and synthesis.</p>
      <h2>Work With Me</h2>
      <p>I am currently based in Montreal and available for contract work. Feel free to get in touch with an opportunity or just a friendly hello!</p>
    </section>
    <ul>
      <li><a href="https://github.com/jasonkuhrt">Github</a></li>
      <li><a href="https://blog.jasonkuhrt.com">Blog</a></li>
      <li><a href="https://twitter.com/jasonkuhrt">Twitter</a></li>
      <li><a href="https://www.behance.net/KUHRT">Behance</a></li>
      <li><a href={'pathResume'} target="_blank">Resume</a></li>
      <li><a href="mailto:jasonkuhrt@me.com">Email</a></li>
    </ul>
    <section className="Section">
      <h1>More About Me</h1>
      <h2>Ethos</h2>
      <p>I am a generalist in the pursuit of elegant systems primarily among the fields of engineering, design, and art. I am driven by a passion to substitute the ogre of chaos for qualities of simplicity and humanity, consistency and honesty, transparency and accountability. To this end, I prioritize opportunities encompassing systemic problem solving.</p>
      <h2>Expertise</h2>
      <p>I have architected a real-time cloud platform, contributed critical design thinking to product, and putted a humble art practice focused on anatomy of systems. As a design-minded generalist engineer I am equipped to help mediate various domain tradeoffs inherent to those interdisciplinary projects concerned with using technology to enhance the human condition.</p>
      <h2>Recently</h2>
      <p>I built the realtime distributed cloud system at littleBits that powers the cloudBit. The cloudBit was an "Internet of Things" (IoT) product realized as a prized module in the littleBits library. It bridged communication between a user's circuit and the internet. The internet became a physical building block. For a medium otherwise invisible to the senses this bore a potent feeling that we could revolutionize people's relation to connectivity!</p>
      <p>To realize this platform I built a number of backend services including a TLS Server, an HTTPS API, a Web Socket API. Tools used included Redis and RethinkDB for data/messaging, Elastic Search for log analysis, AWS/GCP for infrastructure, docker/kubernetes for deployment, OAuth 2. I also built the control app where users setup, managed, and interacted with their cloudBit. Furthermore I helped grow the team, researched advanced platform features, made internal CLI tools, weighed in on product decisions, contributed leadership, and more.</p>
    </section>
    <style jsx global>{`
      html, body {
        margin: 0;
      }

      h1,h2,h3,h4,h5,h6 {
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
        color: hsl(0,0%,12%);
      }
    `}</style>
    <style jsx>{`
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
        color: hsl(278, 80%, 51%)
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

export default Index

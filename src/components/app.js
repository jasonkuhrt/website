import React from "react"

export default class App extends React.Component {
  render () {
    return (
      <div id="app">
        <header id="banner">
          <h1 className="Avatar">Jason<br/>Kuhrt</h1>
          <p>An aspiring polymath shapeshifting amidst Art, Design, and Engineering<span className="DotMagenta">.</span> Once described as "poet philosopher" within a "feral tribe of wandering alchemists after the apocolypse"<span className="DotPurple">.</span> Devotee to the humanities<span className="DotCyan">.</span> In an alternate universe, xor: Coureur de Bois, Architect, Athlete, Lego Master Builder<span className="DotBlue">.</span></p>
        </header>
        <section className="Section">
          <h1>Hello!</h1>
          <p>Hi, my name is Jason Kuhrt. I am a design-minded self-taught functionally-oriented software engineer with over five years experience creating web apps and backend systems. Recently I helped lead development of the realtime distributed cloud system at littleBits that powers the cloudBit. I earned a BFA majoring in design at Concordia University where systems, theory, and society were foundational. I can get a computer to do the right thing, yet I am adept at ideation, interdisciplinary collaboration, design thinking, research, and synthesis.</p>
          <h2>Work With Me</h2>
          <p>I am currently based in Montreal and available for contract work. Feel free to get in touch with an opportunity or just a friendly hello!</p>
        </section>
        <ul>
          <li><a href="mailto:jasonkuhrt@me.com">Email</a></li>
          <li><a href="https://github.com/jasonkuhrt">Github</a></li>
          <li><a href="https://www.behance.net/KUHRT">Behance</a></li>
          <li><a href="https://twitter.com/JasonKuhrt">Twitter</a></li>
          <li><a href="https://ca.linkedin.com/in/kuhrt">linkedIn</a></li>
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
      </div>
    )
  }
}

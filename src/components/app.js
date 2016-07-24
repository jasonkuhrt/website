import React from "react"

export default class App extends React.Component {
  render () {
    return (
      <div id="app">
        <header id="banner">
          <h1 className="Avatar">Jason<br/>Kuhrt</h1>
          <p>An aspiring polymath shapeshifting amidst Art, Design, and Engineering<span className="DotMagenta">.</span> Once described as "poet philosopher" amongst a "feral tribe of wandering alchemists after the apocolypse"<span className="DotPurple">.</span> Devotee to the humanities<span className="DotCyan">.</span> In an alternate universe, xor: Coureur de Bois, Architect, Athlete, Lego Master Builder<span className="DotBlue">.</span></p>
        </header>
        <section className="Section">
          <h1>My Ethos</h1>
          <p>I am a generalist in the pursuit of elegant systems primarily among the fields of engineering, design, and art. I am driven by a passion to substitute the ogre of chaos for qualities of simplicity and humanity, consistency and honesty, transparency and accountability. To this end, I prioritize opportunities encompassing systemic problem solving.</p>
          <h1>My Ability</h1>
          <p>I have architected a real-time cloud platform, contributed critical design thinking to product, and putted a humble art practice focused on anatomy of systems. As a design-minded generalist engineer I am equipped to help mediate various domain tradeoffs inherent to those interdisciplinary projects concerned with using technology to enhance the human condition.</p>
          <h1>An Example</h1>
          <p>I recently worked at littleBits where my principal mission was to engineer the cloud platform behind the cloudBit. The cloudBit was an "Internet of Things" (IoT) product realized as a prized module in the littleBits library. When used, it bridged communication between a user's circuit and the internet. The internet became a building block. Such manifest physicality of a medium otherwise invisible to the senses bore a potent feeling that we could revolutionize people's utility of, expression with, and relationship to connectivity.</p>
          <p>I contributed as lead engineer for almost three years. Despite lacking experience in network programming, distributed systems or formal engineering, and being without programmer collaboration or operations support until the last months, progress occurred. Following a TED unveil, we launched mid 2014 with a simple control app, IFTTT integration, and multiple APIs.</p>
          <h1>Lets Collaborate</h1>
          <p>I am currently based in Montreal and available for contract work. Feel free to get in touch with a specific opportunity or just a friendly hello!</p>
        </section>
        <ul>
          <li><a href="mailto:jasonkuhrt@me.com">Email</a></li>
          <li><a href="https://github.com/jasonkuhrt">Github</a></li>
          <li><a href="https://www.behance.net/KUHRT">Behance</a></li>
          <li><a href="https://twitter.com/JasonKuhrt">Twitter</a></li>
          <li><a href="https://ca.linkedin.com/in/kuhrt">linkedIn</a></li>
        </ul>
      </div>
    )
  }
}

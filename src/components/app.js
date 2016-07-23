import React from "react"

export default class App extends React.Component {
  render () {
    return (
      <div id="app">
        <header id="banner">
          <h1 id="avatar">Jason Kuhrt</h1>
          <p>A romantic polymath shapeshifting amidst Art, Design, and Engineering<span className="DotMagenta">.</span> Devotee to the humanities<span className="DotCyan">.</span> In an alternate universe, xor: Coureur de Bois, Architect, Athlete, Lego Master Builder<span className="DotBlue">.</span></p>
        </header>
        <section className="Section">
          <h1>Work With Me</h1>
          <p>Hi, I am a functional programmer with experience writing code for both frontend web applications, and backend web services. Recently I helped lead development of the realtime cloud platform at littleBits and before that architect the implementation for a large telcom website.</p>
          <p>I graduated from design in a fine art faculty and incidentally can contribute an atypical perspective to traditional technology circles. Swapping my engineering hat out for research, conception, design, and so on is no problem.</p>
          <p>I am currently based in Montreal and available for contract work. Feel free to get in touch, be it for a specific work/project opportunity or just a friendly hello.</p>
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

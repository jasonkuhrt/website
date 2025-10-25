import { MapPin } from 'lucide-react'
import { Container } from '../components/Container'
import { Section } from '../components/Section'
import { Socials } from '../components/Socials'
import type { Route } from './+types/home'
import styles from './home.module.css'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Jason Kuhrt' },
    { name: 'description', content: 'Personal website of Jason Kuhrt' },
  ]
}

export default function Home() {
  return (
    <Section spacing='xl'>
      <Container variant='content' className={styles.container}>
        {/* Avatar */}
        <div className={styles.avatar}>
          <img
            src='/images/avatar2@1x.jpg'
            alt='Jason Kuhrt'
            width='128'
            height='128'
            className={styles.avatarImage}
          />
        </div>

        {/* Name */}
        <h1 className={styles.name}>
          Jason Kuhrt
        </h1>

        {/* Bio */}
        <p className={styles.bio}>
          Shapeshifting Polymath ≒ Art ∙ Design ∙ Engineering. Heart humanities. In alternate universes ⊻ Coureur de
          Bois, Architect, Athlete, Lego Master Builder.
        </p>

        {/* Location */}
        <div className={styles.location}>
          <MapPin className={styles.locationIcon} />
          <span>Montreal, Quebec, Canada</span>
        </div>

        {/* Social Links */}
        <Socials />
      </Container>
    </Section>
  )
}

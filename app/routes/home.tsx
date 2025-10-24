import { MapPin } from 'lucide-react'
import { Container } from '../components/Container'
import { Section } from '../components/Section'
import { Socials } from '../components/Socials'
import type { Route } from './+types/home'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Jason Kuhrt' },
    { name: 'description', content: 'Personal website of Jason Kuhrt' },
  ]
}

export default function Home() {
  return (
    <Section spacing='xl'>
      <Container variant='content' className='flex flex-col items-center justify-center min-h-[60vh]'>
        {/* Avatar */}
        <div className='rounded-full overflow-hidden w-32 h-32 mb-8 ring-1 ring-gray-200 dark:ring-gray-800'>
          <img
            src='/images/avatar2@1x.jpg'
            alt='Jason Kuhrt'
            width='128'
            height='128'
            className='object-cover'
          />
        </div>

        {/* Name */}
        <h1 className='text-5xl font-bold mb-6 font-sans'>
          Jason Kuhrt
        </h1>

        {/* Bio */}
        <p className='text-lg text-center max-w-2xl mb-8 text-gray-700 dark:text-gray-300'>
          Shapeshifting Polymath ≒ Art ∙ Design ∙ Engineering. Heart humanities. In alternate universes ⊻ Coureur de
          Bois, Architect, Athlete, Lego Master Builder.
        </p>

        {/* Location */}
        <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-8'>
          <MapPin className='w-4 h-4' />
          <span>Montreal, Quebec, Canada</span>
        </div>

        {/* Social Links */}
        <Socials />
      </Container>
    </Section>
  )
}

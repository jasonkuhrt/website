import { Container } from '../components/Container'
import type { Route } from './+types/bio'

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Bio | Jason Kuhrt' }]
}

export default function Bio() {
  return (
    <Container variant='content' className='prose dark:prose-invert mx-auto'>
      <h1>Bio</h1>
      <p>Coming soon...</p>
    </Container>
  )
}

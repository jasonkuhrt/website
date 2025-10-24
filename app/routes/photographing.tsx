import { Container } from '../components/Container'
import type { Route } from './+types/photographing'

export const meta: Route.MetaFunction = () => {
  return [{ title: 'uphotographing | Jason Kuhrt' }]
}

export default function uphotographing() {
  return (
    <Container variant='content' className='prose dark:prose-invert mx-auto'>
      <h1>uphotographing</h1>
      <p>Coming soon...</p>
    </Container>
  )
}

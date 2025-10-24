import { Container } from '../components/Container'
import type { Route } from './+types/speaking'

export const meta: Route.MetaFunction = () => {
  return [{ title: 'uspeaking | Jason Kuhrt' }]
}

export default function uspeaking() {
  return (
    <Container variant='content' className='prose dark:prose-invert mx-auto'>
      <h1>uspeaking</h1>
      <p>Coming soon...</p>
    </Container>
  )
}

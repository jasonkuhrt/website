import { Container } from '../components/Container'
import type { Route } from './+types/drawing'

export const meta: Route.MetaFunction = () => {
  return [{ title: 'udrawing | Jason Kuhrt' }]
}

export default function udrawing() {
  return (
    <Container variant="content" className="prose dark:prose-invert mx-auto">
      <h1>udrawing</h1>
      <p>Coming soon...</p>
    </Container>
  )
}

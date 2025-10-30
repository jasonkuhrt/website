import { photoCollection } from '../data/photos.js'
import { L, F } from '../components/__'
import type { Route } from './+types/capturing'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Capturing – Kuhrt' },
    { name: 'description', content: 'Images by Jason Kuhrt' },
  ]
}

export default function Capturing() {
  const { photos } = photoCollection

  return (
    <L.Section spacing='sm'>
      <L.Container variant='standard'>
        {photos.length > 0 && <F.PhotoGrid photos={[...photos]} />}
      </L.Container>
    </L.Section>
  )
}

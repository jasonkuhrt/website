import photoData from '../../public/data/capturing/photos.json'
import type { PhotoCollection } from '../../public/data/capturing/types'
import { PhotoGrid } from '../components/PhotoGrid'
import type { Route } from './+types/capturing'

const data = photoData as PhotoCollection

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Capturing – Kuhrt' },
    { name: 'description', content: 'Images by Jason Kuhrt' },
  ]
}

export default function Capturing() {
  const { photos } = data

  return (
    <div className='container mx-auto px-4 py-8'>
      {photos.length > 0 && <PhotoGrid photos={photos} />}
    </div>
  )
}

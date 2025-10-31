import { F, L } from '../components/__'
import { photoCollection } from '../data/photos.js'
import { createPageMeta } from '../lib/metaHelpers'
import type { Route } from './+types/capturing'

export const meta: Route.MetaFunction = () =>
  createPageMeta('Capturing', 'Images by Jason Kuhrt')

export default function Capturing() {
  const { photos } = photoCollection

  return (
    <L.PageSection spacing="xs" width="standard">
      {photos.length > 0 && <F.PhotoGrid photos={[...photos]} />}
    </L.PageSection>
  )
}

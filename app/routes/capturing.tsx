import { F, L } from '#~/components/__'
import { photoCollection } from '#~/data/photos.js'
import { createPageMeta } from '#~/lib/metaHelpers'
import type { Route } from './+types/capturing'

export const meta: Route.MetaFunction = () =>
  createPageMeta('Capturing', 'Images by Jason Kuhrt')

const Capturing: React.FC<Route.ComponentProps> = () => {
  const { photos } = photoCollection

  return (
    <L.PageSection spacing="8" width="standard">
      {photos.length > 0 && <F.PhotoGrid photos={[...photos]} />}
    </L.PageSection>
  )
}

export default Capturing

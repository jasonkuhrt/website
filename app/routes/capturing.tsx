import { F, L } from '#~/components/__'
import * as Frame from '#~/content/frame.js'
import { createPageMeta } from '#~/lib/metaHelpers'
import type { Route } from './+types/capturing'

export const loader = async () => {
  const photos = await Frame.get()
  return { photos }
}

export const meta: Route.MetaFunction = () =>
  createPageMeta('Capturing', 'Images by Jason Kuhrt')

const CapturingPage: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  const { photos } = loaderData

  return (
    <L.PageSection spacing="8" width="standard">
      {photos.length > 0 && <F.PhotoGrid photos={photos} />}
    </L.PageSection>
  )
}

export default CapturingPage

import { css } from '#styled-system/css'
import { L, Text, UI } from '#~/components/__'
import * as Speaking from '#~/content/speaking.js'
import { DateString } from '../../src/content/bio.js'
import { createPageMeta } from '#~/lib/metaHelpers'
import type { Route } from './+types/speaking'

export const loader = async () => {
  const talks = await Speaking.get()
  return { talks }
}

export const meta: Route.MetaFunction = () => createPageMeta('Speaking', 'Talks and presentations by Jason Kuhrt')

const SpeakingPage: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  const { talks } = loaderData

  const headers = [
    { key: 'date', label: 'Date', align: 'left' as const },
    { key: 'title', label: 'Title', align: 'left' as const },
    { key: 'venue', label: 'Venue', align: 'left' as const },
    { key: 'slides', label: 'Slides', align: 'center' as const },
    { key: 'info', label: 'Info', align: 'center' as const },
    { key: 'recording', label: 'Recording', align: 'center' as const },
    { key: 'post', label: 'Post', align: 'center' as const },
  ]

  const rows = talks.map(($talk) => ({
    date: (
      <L.Box whiteSpace='nowrap'>
        <Text.Text fontSize='2' color='text.secondary'>{DateString.format($talk.date)}</Text.Text>
      </L.Box>
    ),
    title: <Text.Text fontSize='2' color='text.primary'>{$talk.title}</Text.Text>,
    venue: <Text.Text fontSize='2' color='text.secondary'>{$talk.venue}</Text.Text>,
    slides: <UI.IconLink href={$talk.links?.repo} title='Slides' icon={<UI.Badge icon='Github' scale='1' />} />,
    info: <UI.IconLink href={$talk.links?.info} title='Event Info' icon={<UI.Badge icon='Link' scale='1' />} />,
    recording: <UI.IconLink href={$talk.links?.recording} title='Recording' icon={<UI.Badge icon='Play' scale='1' />} />,
    post: <UI.IconLink href={$talk.links?.twitter} title='Twitter' icon={<UI.Badge icon='Twitter' scale='1' />} />,
  }))

  return (
    <L.PageSection>
      <UI.DataTable headers={headers} rows={rows} />
    </L.PageSection>
  )
}

export default SpeakingPage

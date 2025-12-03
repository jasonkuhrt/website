import { Meta } from '#~/components/meta.js'
import { DateString, Experience, ExperienceSpeaking } from '../../content/experience.js'

export const loader = async () => {
  const allExperiences = await Experience.list()
  // Experience now returns union directly (no wrapper)
  const speakingItems = allExperiences.filter((e): e is ExperienceSpeaking => e._tag === 'speaking')
  return { speakingItems }
}

const SpeakingPage: React.FC<{ loaderData: Awaited<ReturnType<typeof loader>> }> = ({ loaderData }) => {
  const { speakingItems } = loaderData

  return (
    <>
      <Meta title="Speaking" />

      <main>
        <h1>Speaking</h1>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Venue</th>
              <th>Slides</th>
              <th>Info</th>
              <th>Recording</th>
              <th>Post</th>
            </tr>
          </thead>
          <tbody>
            {speakingItems.map((item) => (
              <tr key={`speaking-${item.date.getTime()}`}>
                <td>{DateString.format(item.date)}</td>
                <td>{item.title}</td>
                <td>{item.venue}</td>
                <td>{item.links?.repo && <a href={item.links.repo}>Slides</a>}</td>
                <td>{item.links?.info && <a href={item.links.info}>Info</a>}</td>
                <td>{item.links?.recording && <a href={item.links.recording}>Recording</a>}</td>
                <td>{item.links?.twitter && <a href={item.links.twitter}>Post</a>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  )
}

export default SpeakingPage

export const getConfig = async () => {
  return { render: 'static' } as const
}

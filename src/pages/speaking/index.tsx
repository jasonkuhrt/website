import experiences from '../../../content/experience.js'
import { Meta } from '#~/components/meta.js'
import { DateString, ExperienceSpeaking } from '../../content/experience.js'

const speakingItems = experiences.filter(
  (e): e is ExperienceSpeaking => e._tag === 'ExperienceSpeaking',
)

const SpeakingPage: React.FC = () => {
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
              <tr key={item.id}>
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

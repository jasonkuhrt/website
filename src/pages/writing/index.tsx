import { Meta } from '#~/components/meta.js'
import { Drivel } from '#~/content/drivel.js'
import { Essay } from '#~/content/essay.js'
import { Scribble } from '#~/content/scribble.js'
import { formatDateShort } from '#~/lib/date.js'

const WritingPage = async () => {
  const essays = await Essay.list()
  const drivel = await Drivel.list()
  const scribbles = await Scribble.list()

  return (
    <>
      <Meta title='Writing' />

      <main>
        <h1>Writing</h1>

        <div>
          <section>
            <h2>Essays</h2>
            <ul>
              {essays.map(essay => (
                <li key={essay.slug}>
                  <a href={`/writing/essays/${essay.slug}`}>{essay.title}</a>
                  <span>— {formatDateShort(essay.date)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Drivel</h2>
            <ul>
              {drivel.map(post => (
                <li key={post.slug}>
                  <a href={`/writing/drivel/${post.slug}`}>{post.title}</a>
                  <span>— {formatDateShort(post.date)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Scribbles</h2>
            <ul>
              {scribbles.map(post => (
                <li key={post.slug}>
                  <a href={`/writing/scribbles/${post.slug}`}>{post.title}</a>
                  <span>— {formatDateShort(post.date)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  )
}

export default WritingPage

export const getConfig = async () => {
  return { render: 'static' } as const
}

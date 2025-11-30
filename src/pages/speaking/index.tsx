import { Meta } from '#~/components/meta.js'

// TODO: Migrate Speaking content type to Continent framework
const SpeakingPage = async () => {
  return (
    <>
      <Meta title="Speaking" />

      <main>
        <h1>Speaking</h1>
        <p>Coming soon - content migration in progress.</p>
      </main>
    </>
  )
}

export default SpeakingPage

export const getConfig = async () => {
  return { render: 'static' } as const
}

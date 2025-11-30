import { Meta } from '#~/components/meta.js'

// TODO: Migrate Capturing content type to Continent framework
const CapturingPage = async () => {
  return (
    <>
      <Meta title="Capturing" />

      <main>
        <h1>Capturing</h1>
        <p>Coming soon - content migration in progress.</p>
      </main>
    </>
  )
}

export default CapturingPage

export const getConfig = async () => {
  return { render: 'static' } as const
}

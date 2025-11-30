import { Meta } from '#~/components/meta.js'

// TODO: Migrate Bio content type to Continent framework
const BioPage = async () => {
  return (
    <>
      <Meta title="Bio" />

      <main>
        <h1>Bio</h1>
        <p>Coming soon - content migration in progress.</p>
      </main>
    </>
  )
}

export default BioPage

export const getConfig = async () => {
  return { render: 'static' } as const
}

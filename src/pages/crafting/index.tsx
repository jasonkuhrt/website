import { Meta } from '#~/components/meta.js'

// TODO: Migrate Crafting content type to Continent framework
const CraftingPage = async () => {
  return (
    <>
      <Meta title="Crafting" />

      <main>
        <h1>Crafting</h1>
        <p>Coming soon - content migration in progress.</p>
      </main>
    </>
  )
}

export default CraftingPage

export const getConfig = async () => {
  return { render: 'static' } as const
}

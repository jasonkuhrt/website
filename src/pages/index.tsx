import { Meta } from '#~/components/meta'

export default async function HomePage() {
  return (
    <>
      <Meta title='Jason Kuhrt' description='Personal website of Jason Kuhrt' />

      <main style={{ padding: '40px' }}>
        <h1>Jason Kuhrt</h1>
        <p>Shapeshifting Polymath ≒ Art ∙ Design ∙ Engineering</p>
      </main>
    </>
  )
}

export const getConfig = async () => {
  return { render: 'static' } as const
}

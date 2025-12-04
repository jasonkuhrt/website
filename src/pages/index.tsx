import { Meta } from '#~/components/meta.js'
import { page, config } from '#~/runtime.js'

export default page(function* () {
  return (
    <>
      <Meta title='Jason Kuhrt' description='Personal website of Jason Kuhrt' />

      <main>
        <h1>Jason Kuhrt</h1>
        <p>Shapeshifting Polymath ≒ Art ∙ Design ∙ Engineering</p>
      </main>
    </>
  )
})

export const getConfig = config(function* () {
  return { render: 'static' } as const
})

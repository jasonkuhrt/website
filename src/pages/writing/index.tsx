export default async function WritingPage() {
  return (
    <>
      <title>Writing | Jason Kuhrt</title>

      <main>
        <h1>Writing</h1>
        <p>Essays, drivel, and scribbles</p>
      </main>
    </>
  )
}

export const getConfig = async () => {
  return { render: 'static' } as const
}

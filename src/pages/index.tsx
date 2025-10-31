export default async function HomePage() {
  return (
    <>
      <title>Jason Kuhrt</title>
      <meta name='description' content='Personal website of Jason Kuhrt' />

      <main>
        <h1>Jason Kuhrt</h1>
      </main>
    </>
  )
}

export const getConfig = async () => {
  return { render: 'static' } as const
}

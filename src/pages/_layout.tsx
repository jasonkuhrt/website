export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel='icon' href='/favicon.ico' />
      <meta property='og:site_name' content='Jason Kuhrt' />
      {children}
    </>
  )
}

export const getConfig = async () => {
  return { render: 'static' } as const
}

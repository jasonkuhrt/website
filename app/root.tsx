import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import './styles/global.css'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import type { Route } from './+types/root'
import { Header } from './components/Header'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Jason Kuhrt' },
    { name: 'description', content: 'Personal website of Jason Kuhrt' },
  ]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return (
    <>
      <Header />
      <main className='pt-20'>
        <Outlet />
      </main>
    </>
  )
}

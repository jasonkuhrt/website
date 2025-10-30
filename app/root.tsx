import '@fontsource-variable/inter'
// Slab serif options - user selectable (multiple weights)
import '@fontsource/zilla-slab/400.css'
import '@fontsource/zilla-slab/600.css'
import '@fontsource/zilla-slab/700.css'
import '@fontsource/roboto-slab/400.css'
import '@fontsource/roboto-slab/600.css'
import '@fontsource/roboto-slab/700.css'
import '@fontsource/bitter/400.css'
import '@fontsource/bitter/600.css'
import '@fontsource/bitter/700.css'
import '@fontsource/arvo/400.css'
import '@fontsource/arvo/700.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import './global.css'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { css } from '../styled-system/css'
import type { Route } from './+types/root'
import { A, D, F } from './components/__'

const main = css({
  paddingTop: '20',
  viewTransitionName: 'main-content',
})

const settingsButton = css({
  position: 'fixed',
  bottom: '6',
  left: '6',
  zIndex: 50,
})

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
      <A.Header />
      <main className={main}>
        <Outlet />
      </main>
      {/* Settings button - pinned to bottom left */}
      <div className={settingsButton}>
        <F.Settings.Button />
      </div>
      {/* Vertical rhythm grid overlay */}
      <D.VerticalRhythmOverlay />
    </>
  )
}

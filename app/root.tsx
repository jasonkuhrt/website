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
import { Box } from '#styled-system/jsx/box'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import type { Route } from './+types/root'
import { A } from './components/__'

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
      <A.Header marginTop='20' />
      <Box as={'main'} marginTop='20' viewTransitionName='main-content'>
        <Outlet />
      </Box>
      {/* Settings button - pinned to bottom left */}
      {
        /*<div className={css({
          position: 'fixed',
          bottom: '6',
          left: '6',
          zIndex: 50,
        })}>
        <F.Settings.Button />
      </div>*/
      }
      {/* Dev tools */}
      {/*<D.VerticalRhythmOverlay />*/}
    </>
  )
}

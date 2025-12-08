import { DebugMixedContent } from '../components/DebugMixedContent.js'

export default async function RootElement({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body>
        {children}
        {import.meta.env.DEV && <DebugMixedContent />}
      </body>
    </html>
  )
}

export const getConfig = async () => {
  return { render: 'static' } as const
}

import '#~/global.css'
import { Link as NavLink } from '#~/components/link/_.js'

// TODO: Migrate Site to new content framework
const navItems = [
  { to: '/' as const, label: 'bio' },
  { to: '/writing' as const, label: 'writing' },
  { to: '/crafting' as const, label: 'crafting' },
  { to: '/framing' as const, label: 'framing' },
  { to: '/speaking' as const, label: 'speaking' },
]

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel='icon' href='/favicon.ico' />
      <meta property='og:site_name' content='Jason Kuhrt' />
      <div className='container-app'>
        <nav style={{ display: 'flex', gap: '1rem', marginTop: '3rem', justifyContent: 'center' }}>
          {navItems.map((item) => (
            <NavLink.In key={item.to} to={item.to}>
              {item.label}
            </NavLink.In>
          ))}
        </nav>

        {children}
      </div>
    </>
  )
}

export const getConfig = async () => {
  return { render: 'static' } as const
}

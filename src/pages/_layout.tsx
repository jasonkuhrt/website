import { Link as NavLink } from '#~/components/link/_.js'

// TODO: Migrate Site to new content framework
const navItems = [
  { to: '/' as const, label: 'home' },
  { to: '/writing' as const, label: 'writing' },
  { to: '/crafting' as const, label: 'crafting' },
  { to: '/capturing' as const, label: 'capturing' },
  { to: '/speaking' as const, label: 'speaking' },
  { to: '/bio' as const, label: 'bio' },
]

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:site_name" content="Jason Kuhrt" />

      <nav style={{ padding: '20px', display: 'flex', gap: '20px' }}>
        {navItems.map((item) => (
          <NavLink.In key={item.to} to={item.to}>
            {item.label}
          </NavLink.In>
        ))}
      </nav>

      {children}
    </>
  )
}

export const getConfig = async () => {
  return { render: 'static' } as const
}

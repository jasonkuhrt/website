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

const gridDebugScript = `
window.grid = function(show) {
  const isOn = document.body.hasAttribute('data-show-grid');
  const newState = show !== undefined ? show : !isOn;
  if (newState) {
    const res = document.body.getAttribute('data-show-grid') || '6';
    document.body.setAttribute('data-show-grid', res);
    console.log('Grid overlay: ON (' + res + 'px)');
  } else {
    document.body.removeAttribute('data-show-grid');
    console.log('Grid overlay: OFF');
  }
  return newState;
};
window.gridRes = function() {
  const current = document.body.getAttribute('data-show-grid');
  const next = current === '12' ? '6' : '12';
  document.body.setAttribute('data-show-grid', next);
  console.log('Grid resolution: ' + next + 'px');
  return next;
};
console.log('%c grid() %c Toggle overlay  %c gridRes() %c Cycle 6px/12px', 'background:#3b82f6;color:white;padding:2px 6px;border-radius:3px', 'color:#666', 'background:#3b82f6;color:white;padding:2px 6px;border-radius:3px', 'color:#666');
`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:site_name" content="Jason Kuhrt" />
      <script dangerouslySetInnerHTML={{ __html: gridDebugScript }} />

      <nav>
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

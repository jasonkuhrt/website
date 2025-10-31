# Waku Migration Plan - MINIMAL SCOPE

**Status**: In Progress
**Estimated Effort**: 1-2 days (reduced scope)
**Started**: 2025-10-31

## Overview

Migrating ONLY homepage and writing routes from React Router v7 to Waku RSC framework.

**Scope**:
- ✅ Homepage (/)
- ✅ Writing index (/writing)
- ✅ Writing MDX posts (/writing/[slug])
- ❌ Bio page (keep in React Router)
- ❌ Speaking page (keep in React Router)
- ❌ Other routes (keep in React Router)

**Why Minimal Scope**:
- Faster validation of Waku + MDX workflow
- Test Cloudflare deployment with minimal risk
- Can iterate and expand scope later
- Reduces migration from 5-7 days → 1-2 days

**Reference**: Maglev project (existing Waku RSC implementation)

---

## Phase 1: Dependencies ✅

### 1.1 Install Waku ✅
```bash
pnpm add waku next-mdx-remote
```
- [x] Waku 0.27.0 installed
- [x] next-mdx-remote 5.0.0 installed

### 1.2 Remove React Router ✅
```bash
pnpm remove @react-router/dev @react-router/node @react-router/serve react-router @vitejs/plugin-react
```
- [x] All React Router packages removed
- [x] @vitejs/plugin-react removed (was causing RefreshRuntime duplicate)

### 1.3 Verify React Versions
- [x] React 19.2.0 (compatible with Waku)
- [x] react-dom 19.2.0
- [ ] Add react-server-dom-webpack if needed

---

## Phase 2: Project Structure ✅

### 2.1 Create Waku Directories ✅
```bash
mkdir -p src/pages src/components src/lib
```
- [x] src/pages/ created
- [x] src/components/ created
- [x] src/lib/ created

### 2.2 Copy Existing Code ✅
```bash
cp -r app/components src/
cp -r app/lib src/
cp -r app/data src/
cp -r app/hooks src/
```
- [x] Components copied
- [x] Lib copied
- [x] Data copied
- [x] Hooks copied

### 2.3 Update Subpath Imports ⏳
**package.json:**
```json
"imports": {
  "#~/*": "./src/*",
  "#styled-system/*": "./styled-system/*"
}
```
- [ ] Update #~/* from ./app/* to ./src/*

**tsconfig.json:**
```json
"paths": {
  "#~/*": ["./src/*"],
  "#styled-system/*": ["./styled-system/*"]
}
```
- [ ] Update paths

---

## Phase 3: Configuration

### 3.1 Create waku.config.ts
```typescript
import { defineConfig } from 'waku/config'

export default defineConfig({
  vite: {
    plugins: [
      // Panda CSS PostCSS plugin
    ],
  },
})
```
- [ ] Create waku.config.ts
- [ ] Configure Panda CSS integration
- [ ] Test Panda codegen still works

### 3.2 Update package.json Scripts
```json
{
  "scripts": {
    "gen:css": "panda codegen",
    "prepare": "pnpm gen:css",
    "dev": "waku dev",
    "build": "waku build",
    "start": "waku start",
    "test": "playwright test"
  }
}
```
- [ ] Remove React Router typegen
- [ ] Update dev script
- [ ] Update build script
- [ ] Add start script

### 3.3 Update Panda Config
```typescript
// panda.config.ts
include: ['./src/**/*.{ts,tsx}'], // Change from ./app
```
- [ ] Update include path

---

## Phase 4: Waku Root Files

### 4.1 Create _root.tsx
```tsx
// src/pages/_root.tsx
export default async function RootElement({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}

export const getConfig = async () => {
  return { render: 'static' } as const
}
```
- [ ] Create src/pages/_root.tsx
- [ ] Add HTML structure
- [ ] Configure as static

### 4.2 Create _layout.tsx
```tsx
// src/pages/_layout.tsx
import '../global.css'
import { A } from '#~/components/__'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:site_name" content="Jason Kuhrt" />

      <A.Header />
      {children}
      <A.SettingsButton />
      <D.VerticalRhythmOverlay />
    </>
  )
}

export const getConfig = async () => {
  return { render: 'static' } as const
}
```
- [ ] Create src/pages/_layout.tsx
- [ ] Import global.css
- [ ] Add Header, SettingsButton, VerticalRhythmOverlay
- [ ] Configure as static

---

## Phase 5: Route Migration

### 5.1 Homepage
**From:** `app/routes/home.tsx`
**To:** `src/pages/index.tsx`

```tsx
// src/pages/index.tsx
import { A, F, L, Text } from '#~/components/__'

export default async function HomePage() {
  return (
    <>
      <title>Jason Kuhrt</title>
      <meta name="description" content="Personal website of Jason Kuhrt" />

      <L.PageSection withContainer={false}>
        <L.Cover minHeight='[60vh]'>
          <A.Avatar scale='3' />
          <Text.DisplayHero>Jason Kuhrt</Text.DisplayHero>
          <Text.P>
            Shapeshifting Polymath ≒ Art ∙ Design ∙ Engineering...
          </Text.P>
          <L.Flex.Item marginBottom='8'>
            <A.LocationBadge location='Montreal, Canada' />
          </L.Flex.Item>
          <F.Socials />
        </L.Cover>
      </L.PageSection>
    </>
  )
}

export const getConfig = async () => {
  return { render: 'static' } as const
}
```
- [ ] Create src/pages/index.tsx
- [ ] Move homepage content
- [ ] Add metadata tags
- [ ] Add getConfig export

### 5.2 Bio Page
**From:** `app/routes/bio.tsx`
**To:** `src/pages/bio.tsx`

- [ ] Copy bio route
- [ ] Keep useState (will need 'use client' later)
- [ ] Add metadata tags
- [ ] Add getConfig export

### 5.3 Speaking Page
**From:** `app/routes/speaking.tsx`
**To:** `src/pages/speaking.tsx`

- [ ] Copy speaking route
- [ ] Add metadata
- [ ] Add getConfig

### 5.4 Writing Index
**From:** `app/routes/writing/index.tsx`
**To:** `src/pages/writing/index.tsx`

- [ ] Create src/pages/writing/ directory
- [ ] Copy writing index
- [ ] Update imports
- [ ] Add metadata

### 5.5 Writing Dynamic Route (COMPLEX - MDX Runtime)
**From:** `app/routes/writing/slug.tsx`
**To:** `src/pages/writing/[slug].tsx`

```tsx
// src/pages/writing/[slug].tsx
import { compileMDX } from 'next-mdx-remote/rsc'
import { readFileSync, readdirSync } from 'node:fs'
import type { PageProps } from 'waku/router'

export default async function WritingPost({ slug }: PageProps<'/writing/[slug]'>) {
  // Determine category from slug pattern
  const category = determineCategory(slug)
  const source = readFileSync(`./content/${category}/${slug}.mdx`, 'utf8')

  const { content, frontmatter } = await compileMDX({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  })

  return (
    <>
      <title>{frontmatter.title} | Jason Kuhrt</title>
      <meta name="description" content={frontmatter.description} />

      <article>
        <h1>{frontmatter.title}</h1>
        {content}
      </article>
    </>
  )
}

export const getConfig = async () => {
  const essays = readdirSync('./content/essays').map(f => f.replace('.mdx', ''))
  const drivel = readdirSync('./content/drivel').map(f => f.replace('.mdx', ''))
  const scribbles = readdirSync('./content/scribbles/entries').map(f => f.replace('.mdx', ''))

  const staticPaths = [
    ...essays.map(s => `essays/${s}`),
    ...drivel.map(s => `drivel/${s}`),
    ...scribbles.map(s => `scribbles/${s}`),
  ]

  return {
    render: 'static',
    staticPaths,
  } as const
}
```
- [ ] Create src/pages/writing/[slug].tsx
- [ ] Implement runtime MDX compilation
- [ ] Generate static paths from filesystem
- [ ] Handle essays, drivel, scribbles routing

---

## Phase 6: MDX Setup

### 6.1 Create MDX Components
```tsx
// src/components/mdx/mdx-components.tsx
export const mdxComponents = {
  h1: (props) => <h1 className={...} {...props} />,
  h2: (props) => <h2 className={...} {...props} />,
  code: Code, // Async server component
  pre: Pre,
  // ... other components
}
```
- [ ] Create mdx-components.tsx
- [ ] Map all MDX component overrides
- [ ] Migrate typography components

### 6.2 Create Code Component (Syntax Highlighting)
```tsx
// src/components/mdx/code.tsx
import { codeToHtml } from 'shiki'

export const Code = async ({ children, className = '' }) => {
  const lang = className.replace('language-', '') || 'typescript'
  const html = await codeToHtml(children.trim(), {
    lang,
    themes: { light: 'min-light', dark: 'tokyo-night' },
  })
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```
- [ ] Create code.tsx
- [ ] Configure Shiki
- [ ] Match current theme settings
- [ ] Add all current languages

### 6.3 Update waku.config.ts for Shiki
```typescript
export default defineConfig({
  vite: {
    environments: {
      rsc: {
        resolve: {
          external: ['shiki'], // Shiki is server-only
        },
      },
    },
  },
})
```
- [ ] Mark Shiki as external for RSC

---

## Phase 7: Add 'use client' Directives

### 7.1 Identify Client Components
Components using:
- useState, useEffect, useRef
- onClick, onChange, onSubmit
- useRouter, useLocation
- Browser APIs (localStorage, window, etc.)

### 7.2 Settings Components
- [ ] src/components/features/settings/SettingsButton.tsx - add 'use client'
- [ ] src/components/features/settings/SettingsModal.tsx - add 'use client'

### 7.3 Interactive Features
- [ ] src/components/features/RepoRefreshTimer.tsx - add 'use client'
- [ ] src/components/features/PhotoGallery.tsx - add 'use client'
- [ ] src/components/features/PhotoGrid.tsx - add 'use client'
- [ ] src/components/features/Timeline.tsx - add 'use client'
- [ ] src/components/dev/VerticalRhythmOverlay.tsx - add 'use client'

### 7.4 App Components
- [ ] src/components/app/ViewToggle.tsx - add 'use client'
- [ ] src/components/app/Header.tsx - check if needs 'use client' (useLocation)

### 7.5 Bio Page
- [ ] src/pages/bio.tsx - add 'use client' (uses useState for view mode)

---

## Phase 8: Import Path Updates

### 8.1 Global Find/Replace
- [ ] Find: `from 'react-router'` → Replace with: `from 'waku'`
- [ ] Find: `from '#~/` → Verify still works with new src/ structure
- [ ] Find: `import type { Route }` → Remove (no longer exists)
- [ ] Find: `Route.ComponentProps` → Remove
- [ ] Find: `Route.MetaFunction` → Remove
- [ ] Find: `Route.LoaderArgs` → Remove

### 8.2 Component Imports
- [ ] Update all relative imports affected by app/ → src/ move
- [ ] Verify styled-system imports still work

---

## Phase 9: Remove React Router Patterns

### 9.1 Remove Meta Exports
```tsx
// REMOVE THESE:
export const meta: Route.MetaFunction = ...
```
Replace with JSX metadata in component.

### 9.2 Remove Loader Exports
```tsx
// REMOVE THESE:
export const loader = async ({ params }: Route.LoaderArgs) => { ... }
```
Move data fetching into async server component.

### 9.3 Update Component Signatures
```tsx
// FROM:
export default function Post({ loaderData }: Route.ComponentProps) {

// TO:
export default async function Post({ slug }: PageProps<'/writing/[slug]'>) {
```

---

## Phase 10: Configuration Files

### 10.1 Delete React Router Config
- [ ] Delete react-router.config.ts (no longer needed)

### 10.2 Delete/Update vite.config.ts
- [ ] Remove import for reactRouter
- [ ] Remove import for @vitejs/plugin-react
- [ ] Remove import for @mdx-js/rollup (using runtime MDX now)
- [ ] Remove oxc config
- [ ] Keep custom plugins (designingDataPlugin, reposDataPlugin) - test if compatible

### 10.3 Update .gitignore
```
# Waku
dist/
.waku/

# Remove React Router specific
# .react-router/
```
- [ ] Add Waku build output
- [ ] Remove React Router entries

---

## Phase 11: Global CSS & Assets

### 11.1 Move global.css
```bash
cp app/global.css src/global.css
```
- [ ] Copy global.css to src/
- [ ] Import in _layout.tsx

### 11.2 Verify Public Assets
- [ ] Ensure /public still works (images, fonts, etc.)
- [ ] Update any hardcoded /public references if needed

---

## Phase 12: TypeScript Configuration

### 12.1 Update tsconfig.json
```json
{
  "include": [
    "src/**/*",
    "vite-env.d.ts"
  ],
  "compilerOptions": {
    "paths": {
      "#~/*": ["./src/*"],
      "#styled-system/*": ["./styled-system/*"]
    },
    "types": ["vite/client"] // Remove @react-router/node
  }
}
```
- [ ] Update include paths
- [ ] Update compilerOptions paths
- [ ] Remove React Router types

---

## Phase 13: Testing

### 13.1 Dev Server
```bash
pnpm dev
```
- [ ] Start Waku dev server
- [ ] Fix initial errors
- [ ] Verify homepage loads
- [ ] Test navigation

### 13.2 TypeScript
```bash
pnpm exec tsc --noEmit
```
- [ ] Fix type errors
- [ ] Verify all imports resolve

### 13.3 Build
```bash
pnpm build
```
- [ ] Test production build
- [ ] Verify static generation works
- [ ] Check dist/ output

### 13.4 Playwright Tests
- [ ] Update test baseURL if needed
- [ ] Run tests and fix failures
- [ ] May need to update selectors/assertions

---

## Phase 14: Deployment

### 14.1 Cloudflare Adapter
```typescript
// src/server-entry.ts (if needed)
import { fsRouter } from 'waku'
import adapter from 'waku/adapters/cloudflare'

export default adapter(
  fsRouter(import.meta.glob('./**/*.{tsx,ts}', { base: './pages' })),
  { static: true },
)
```
- [ ] Create server-entry.ts if needed
- [ ] Test Cloudflare deployment
- [ ] Update cf:deploy script if needed

---

## Known Issues & Blockers

### Issue 1: Vite Peer Dependency Warning
```
✕ unmet peer vite@npm:rolldown-vite@latest: found 7.1.20
```
- Status: Warning only, should work
- Action: Monitor if it causes issues

### Issue 2: MDX Runtime vs Build-time
- Current: Build-time compilation (@mdx-js/rollup)
- Waku: Runtime compilation (next-mdx-remote)
- Impact: Slower dev server, different architecture
- Mitigation: Cache compiled MDX in production

### Issue 3: Ark UI Dialog + React 19
- Known issue: Dialog not opening (from earlier investigation)
- Root cause: Likely React 19 incompatibility with Ark UI
- Action: May need to downgrade React or find alternative

---

## Rollback Plan

If migration fails:

```bash
git checkout main
pnpm install
pnpm dev
```

All changes on branch, safe to abandon.

---

## Progress Tracking

- **Phase 1**: ✅ Complete (2/2 tasks)
- **Phase 2**: ✅ Complete (3/3 tasks)
- **Phase 3**: ⏳ In Progress (1/3 tasks)
- **Phase 4**: 🔜 Not Started
- **Phase 5**: 🔜 Not Started
- **Phase 6**: 🔜 Not Started
- **Phase 7**: 🔜 Not Started
- **Phase 8**: 🔜 Not Started
- **Phase 9**: 🔜 Not Started
- **Phase 10**: 🔜 Not Started
- **Phase 11**: 🔜 Not Started
- **Phase 12**: 🔜 Not Started
- **Phase 13**: 🔜 Not Started
- **Phase 14**: 🔜 Not Started

**Overall Progress**: ~15% (3/14 phases complete)

---

## Next Session Checklist

When resuming:
1. Read this document
2. Check current phase progress
3. Continue from last incomplete task
4. Update checkboxes as you complete tasks
5. Run tests frequently to catch issues early

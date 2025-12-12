# Continent Tutorials

Continent is a content management library for TypeScript/Vite projects. These tutorials guide you through common content patterns.

---

## Tutorial 1: MDX Blog

Build a blog with MDX posts that have frontmatter, assets, and automatic slug extraction.

### Step 1: Create Content Directory

```
content/
└── drivel/
    ├── 2024-01-15_hello-world.mdx
    └── 2024-02-20_second-post.mdx
```

### Step 2: Write an MDX Post

```mdx
---
title: Hello World
date: 2024-01-15
---

Welcome to my blog!

![Photo](./hero.jpg)
```

### Step 3: Define Content

```typescript
// src/content/drivel.ts
import { Mdx } from 'continent'

export const Drivel = Mdx('drivel')
export type Drivel = typeof Drivel.Type
```

That's it! The `Mdx` factory handles:

- File discovery via `content/drivel/*.mdx`
- Frontmatter parsing (title, date)
- MDX compilation
- Asset URL rewriting
- Slug extraction from filename (`2024-01-15_hello-world` → `hello-world`)

### Step 4: Use in Your App

```typescript
import { Drivel } from './content/drivel.js'

// List all posts
const posts = await Drivel.list()
// → [{ slug: 'hello-world', title: 'Hello World', date: Date, compiledJs: '...', assets: [...] }, ...]

// Get single post by slug
const post = await Drivel.get({ slug: 'hello-world' })
```

### Step 5: Directory-Based Posts (with co-located assets)

For posts with multiple assets, use directories:

```
content/
└── essay/
    └── 2024-03-01_my-essay/
        ├── content.mdx
        ├── diagram.png
        └── screenshot.jpg
```

```typescript
// src/content/essay.ts
import { Mdx } from 'continent'

export const Essay = Mdx('essay', {
  glob: 'content/essay/*/content.mdx',
})
export type Essay = typeof Essay.Type
```

The factory detects the directory-based pattern and:

- Extracts slug from directory name (not filename)
- Resolves assets from the same directory

### Step 6: Custom Frontmatter

Add custom frontmatter fields:

```typescript
import { Mdx } from 'continent'
import * as S from 'effect/Schema'

export const Drivel = Mdx('drivel', {
  frontmatter: {
    tags: S.optional(S.Array(S.String)),
    featured: S.optional(S.Boolean),
  },
})
```

Now your posts can have:

```mdx
---
title: Hello World
date: 2024-01-15
tags: [typescript, tutorial]
featured: true
---
```

---

## Tutorial 2: Portfolio with GitHub Integration

Build a portfolio page that lists your GitHub projects with live data.

### Step 1: Create Module Manifest

```typescript
// content/module.ts
export default [
  { repo: 'owner/project-a', featured: true },
  { repo: 'owner/project-b' },
  { repo: 'owner/project-c', featured: true },
]
```

### Step 2: Define Content with API Enrichment

```typescript
// src/content/module.ts
import { Content, Store } from 'continent'
import * as S from 'effect/Schema'

// Transform "owner/name" string to structured object
const RepoId = S.transform(
  S.String.pipe(S.pattern(/^[^/]+\/[^/]+$/)),
  S.Struct({ owner: S.String, name: S.String }),
  {
    strict: true,
    decode: (s) => {
      const [owner, name] = s.split('/')
      return { owner: owner!, name: name! }
    },
    encode: ({ owner, name }) => `${owner}/${name}`,
  },
)

// GitHub API fetching (simplified)
const fetchGitHubRepo = async (owner: string, name: string) => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${name}`)
  return response.json()
}

export const Module = Content('module', {
  // Source: JS manifest file
  store: Store.js({
    path: 'content/module.ts',
    schema: S.Struct({
      repo: RepoId,
      featured: S.optional(S.Boolean),
    }),
  }),

  // Output: Enriched with GitHub data
  schema: {
    repo: S.String,
    owner: S.String,
    name: S.String,
    featured: S.Boolean,
    description: S.NullOr(S.String),
    stargazerCount: S.Number,
    url: S.String,
  },

  uniqueKeys: ['repo'],

  // Transform: Fetch live GitHub data
  async map(source) {
    const repoData = await fetchGitHubRepo(source.repo.owner, source.repo.name)
    return {
      repo: `${source.repo.owner}/${source.repo.name}`,
      owner: source.repo.owner,
      name: source.repo.name,
      featured: source.featured ?? false,
      description: repoData.description,
      stargazerCount: repoData.stargazers_count,
      url: repoData.html_url,
    }
  },
})
export type Module = typeof Module.Type
```

### Step 3: Use in Your App

```typescript
import { Module } from './content/module.js'

// List all modules (fetches GitHub data, cached)
const modules = await Module.list()

// Get by repo name
const project = await Module.get({ repo: 'owner/project-a' })

// Filter featured
const featured = modules.filter(m => m.featured)
```

### Step 4: Singleton Content

For single-record content (site config, profile):

```typescript
// content/site.ts
export default {
  title: 'My Portfolio',
  description: 'A showcase of my work',
}
```

```typescript
// src/content/site.ts
import { Content, Store } from 'continent'
import * as S from 'effect/Schema'

export const Site = Content('site', {
  store: Store.js({
    path: 'content/site.ts',
    cardinality: '1', // Singleton
    schema: S.Struct({
      title: S.String,
      description: S.String,
    }),
  }),
})

// Usage
const site = await Site.get()
// → { title: 'My Portfolio', description: 'A showcase of my work' }
```

---

## Vite Plugin

Enable HMR and asset serving during development:

```typescript
// waku.config.ts or vite.config.ts
import { continentPlugin } from 'continent'
import { defineConfig } from 'waku/config'

export default defineConfig({
  vite: {
    plugins: [continentPlugin()],
  },
})
```

The plugin auto-discovers content definitions from `src/content/`:

- Watches content directories for changes
- Triggers HMR on content updates
- Serves assets from `/content/` prefix in dev mode

### Manual Definitions (Optional)

If you prefer explicit configuration over auto-discovery:

```typescript
import { continentPlugin } from 'continent'
import { defineConfig } from 'waku/config'
import { Drivel } from './src/content/drivel.js'
import { Essay } from './src/content/essay.js'

export default defineConfig({
  vite: {
    plugins: [
      continentPlugin({
        definitions: [Drivel, Essay],
      }),
    ],
  },
})
```

---

## Quick Reference

### Store Types

| Store                        | Use Case              | Source Data               |
| ---------------------------- | --------------------- | ------------------------- |
| `Store.dir({ glob })`        | Files (MDX, markdown) | `{ stem, path, content }` |
| `Store.js({ path, schema })` | JS/TS manifests       | Decoded schema type       |

### Content Factory API

```typescript
// Collection (multiple records)
const posts = await Content.list()
const post = await Content.get({ slug: 'my-post' })

// Singleton (single record)
const config = await Content.get()

// Cache management
await Content.flushCache()
await Content.loadCache()
```

### UniqueKey for O(1) Lookups

```typescript
import { Content, Store, UniqueKey } from 'continent'
import * as S from 'effect/Schema'

export const Post = Content('post', {
  store: Store.dir({ glob: 'content/posts/*.mdx' }),
  schema: {
    slug: UniqueKey(S.String), // Enables .get({ slug })
    email: UniqueKey(S.String), // Multiple unique keys allowed
    title: S.String,
  },
  async map(source) {
    return { slug: source.stem, email: '...', title: '...' }
  },
})

// O(1) lookup by any unique key
await Post.get({ slug: 'my-post' })
await Post.get({ email: 'user@example.com' })
```

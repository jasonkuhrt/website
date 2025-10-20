# Feature: GitHub Repository Cards Grid for Coding Page

**Date**: 2025-10-20
**Status**: In Definition

## Overview

Replace the "Coming soon" placeholder on the `/coding` page with a responsive grid of cards displaying curated GitHub repositories (Polen, Graffle, Molt, etc.). Each card will show rich repository information fetched from the GitHub GraphQL API at build time.

---

## User Journeys

### Primary Journey: Browse Curated Projects

1. User navigates to `/coding` page
2. User sees a responsive grid of repository cards (1 col on mobile, 2 on tablet, 3+ on desktop)
3. Each card displays:
   - Repository name
   - Description
   - Stats (stars, forks)
   - Primary language/tech stack
   - Last updated date
4. User hovers over a card → visual feedback (scale/shadow animation)
5. User clicks on a card → navigates to the GitHub repository

### Secondary Journey: First-Time Build

1. Developer runs build command
2. Build system reads list of curated repositories from config
3. System makes GraphQL query to GitHub API using Personal Access Token from env var
4. System fetches all repository data in a single request
5. Repository data is embedded into the static page
6. Build completes successfully

---

## Failure States

| Failure Scenario                        | User Experience                                 | System Behavior                                                                                      |
| --------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| GitHub API unavailable during build     | Build fails with error message                  | Build process exits with non-zero status; developer must retry or investigate                        |
| GitHub API rate limit exceeded          | Build fails with rate limit error               | Build process exits; error message indicates rate limit issue and suggests waiting or checking token |
| Invalid Personal Access Token           | Build fails with authentication error           | Build process exits; error message indicates auth failure and points to env var configuration        |
| Repository not found (404)              | Build fails with error identifying missing repo | Build process exits; error message specifies which configured repository doesn't exist               |
| Malformed GraphQL response              | Build fails with parsing error                  | Build process exits; error message indicates unexpected API response format                          |
| Missing required env var (GITHUB_TOKEN) | Build fails with configuration error            | Build process exits; error message explains missing env var requirement                              |

---

## Technical Architecture

### Data Flow

```
[Build Time]
Config File (repo list)
  → GraphQL Query Builder
  → GitHub GraphQL API (authenticated)
  → Response Parser
  → Static Page Generator
  → Built HTML with embedded data

[Runtime]
Static HTML served
  → User interaction (hover/click)
  → CSS transitions / navigation
```

### GitHub API Integration

**API**: GitHub GraphQL API v4
**Endpoint**: `https://api.github.com/graphql`
**Authentication**: Personal Access Token via `GITHUB_TOKEN` environment variable

#### GraphQL Query Structure

```graphql
query GetRepositories($owner: String!, $repos: [String!]!) {
  user(login: $owner) {
    repositories(first: 100, ownerAffiliations: OWNER) {
      nodes {
        name
        description
        stargazerCount
        forkCount
        primaryLanguage {
          name
          color
        }
        pushedAt
        url
      }
    }
  }
}
```

**Variables**:

```json
{
  "owner": "jasonkuhrt",
  "repos": ["polen", "graffle", "molt", ...]
}
```

**Note**: Since we're fetching multiple specific repos, we'll need to either:

- Fetch all repos and filter client-side (simpler but potentially wasteful)
- Make individual queries per repo (more requests but more precise)
- Use GraphQL aliases to fetch multiple repos in one query (optimal)

**Recommended approach**: GraphQL aliases for multiple repos in single query:

```graphql
query GetCuratedRepos {
  polen: repository(owner: "jasonkuhrt", name: "polen") {
    ...RepoFields
  }
  graffle: repository(owner: "jasonkuhrt", name: "graffle") {
    ...RepoFields
  }
  molt: repository(owner: "jasonkuhrt", name: "molt") {
    ...RepoFields
  }
}

fragment RepoFields on Repository {
  name
  description
  stargazerCount
  forkCount
  primaryLanguage {
    name
    color
  }
  pushedAt
  url
}
```

#### API Response Example

```json
{
  "data": {
    "polen": {
      "name": "polen",
      "description": "Type-safe polymorphic functions for TypeScript",
      "stargazerCount": 42,
      "forkCount": 3,
      "primaryLanguage": {
        "name": "TypeScript",
        "color": "#3178c6"
      },
      "pushedAt": "2025-10-15T14:32:00Z",
      "url": "https://github.com/jasonkuhrt/polen"
    },
    "graffle": {
      "name": "graffle",
      "description": "GraphQL client for TypeScript",
      "stargazerCount": 128,
      "forkCount": 12,
      "primaryLanguage": {
        "name": "TypeScript",
        "color": "#3178c6"
      },
      "pushedAt": "2025-10-18T09:15:00Z",
      "url": "https://github.com/jasonkuhrt/graffle"
    }
  }
}
```

### Configuration Schema

**File**: `src/config/repos.ts` (or similar)

```typescript
export const curatedRepos = [
  'polen',
  'graffle',
  'molt',
  // ... additional repos
] as const

export type CuratedRepo = (typeof curatedRepos)[number]
```

### Component Structure

**File**: `src/pages/coding.astro`

- Imports build-time GitHub data fetcher
- Renders responsive grid layout
- Passes repo data to card components

**File**: `src/components/RepoCard.astro` (new)

- Accepts repo data as props
- Renders card with all required fields
- Handles hover states via CSS
- Links to GitHub repository

**File**: `src/lib/github.ts` (new)

- Exports `fetchRepoData()` function
- Handles GraphQL query construction
- Manages authentication
- Parses and validates response
- Throws errors on failure (fails build)

### CSS/Styling Approach

- Use existing design tokens from the site
- Responsive grid: CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`
- Hover effects: `transform: scale(1.02)` + `box-shadow` transition
- Dark mode support: use existing dark mode utilities
- Language color badges: use GitHub's language colors from API

### Environment Variables

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Required permissions**: `public_repo` or `repo` (read-only access to repository data)

---

## Data Model

### TypeScript Types

```typescript
interface GitHubRepo {
  name: string
  description: string | null
  stargazerCount: number
  forkCount: number
  primaryLanguage: {
    name: string
    color: string
  } | null
  pushedAt: string // ISO 8601 date string
  url: string
}

interface RepoCardProps {
  repo: GitHubRepo
}
```

---

## Dependencies

**New dependencies** (to be added):

- None - using native `fetch` for GraphQL requests

**Existing dependencies** (assumed):

- Astro (static site generator)
- TypeScript

---

## File Structure

```
src/
├── pages/
│   └── coding.astro (modified)
├── components/
│   └── RepoCard.astro (new)
├── lib/
│   └── github.ts (new)
└── config/
    └── repos.ts (new)
```

---

## Open Questions

1. **Repository order**: Should cards be displayed in a specific order (e.g., by stars, by update date, manually curated order)?
2. **Repository ownership**: Are all repos under the same GitHub user/org, or do we need to support cross-org repos?
3. **Caching strategy**: Should we cache the API response during dev mode to avoid hitting rate limits?
4. **Additional repos**: What is the complete list of repositories to include?

---

## Out of Scope

- Runtime fetching of GitHub data
- User interaction beyond clicking to GitHub (no inline README, no clone buttons, etc.)
- Filtering or searching repositories
- Pagination (assuming small curated list)
- Repository statistics graphs/charts
- Contribution activity visualization
- Multi-user repository collections

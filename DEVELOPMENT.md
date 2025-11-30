# Development Guide

## Writing Content

Content lives in `content/writing/` with three categories:

### Essays (`essays/`)
Long-form technical essays. Two formats:
- **Flat file**: `{slug}.mdx` - no assets
- **Directory**: `{slug}/content.mdx` + assets - for posts with images

### Drivel (`drivel/`)
Shorter blog posts. Same formats as essays but with date prefix:
- **Flat file**: `YYYY-MM-DD_{slug}.mdx` - no assets
- **Directory**: `YYYY-MM-DD_{slug}/content.mdx` + assets

### Scribbles (`scribbles/`)
Quick notes/TIL. Date-based naming:
- **Flat file**: `YYYY-MM-DD.mdx` or `YYYY-MM-DD_{slug}.mdx` - no assets
- **Directory**: `YYYY-MM-DD/content.mdx` + assets

### Asset References
Use relative paths `./image.png` - automatically rewritten to absolute URLs.

## Dev Server Behavior

### Dev Server Restart Required

The dev server must be restarted when:

**Content Type Definitions** - Changes to content definitions in `src/content/` require restart:
- Schema changes (adding/removing fields)
- Discover config changes (strategies, roots, entry patterns)
- Loader logic changes (ID extraction, date normalization)

**Continent Package** - Changes to `packages/continent/src/`:
- `definition.ts` - Core discovery and loading logic
- `vite-plugin.ts` - Asset copying behavior

**Asset Path Changes** - Any change that affects how asset URLs are computed:
- Changes to `getAssetBasePath()` logic
- Changes to `getAssetsToCopy()` destination paths
- ID transformation changes in loaders (e.g., date stripping)

### What Hot Reloads

The following changes are picked up automatically:
- MDX content changes
- React component changes
- CSS/styling changes
- New content files (detected by watcher)

## GitHub Repository Data

The coding page displays GitHub repository data that is automatically refreshed daily.

### How It Works

1. **Automated Refresh**: A GitHub Actions workflow runs daily at 00:00 UTC
2. **Data Fetch**: The workflow fetches fresh repository data from GitHub's GraphQL API
3. **Auto-Deploy**: If data changes, it commits the updates and triggers a new deployment
4. **Live Timer**: The UI shows a countdown to the next refresh (24 hours from last fetch)

### Data Structure

Repository data is stored in `data/repos.json` with the following structure:

```json
{
  "fetchedAt": "2025-10-21T00:24:38.564Z",
  "repos": [
    {
      "name": "repo-name",
      "description": "...",
      "stargazerCount": 123,
      "forkCount": 45,
      "primaryLanguage": { "name": "TypeScript", "color": "#3178c6" },
      "pushedAt": "2025-10-20T...",
      "url": "https://github.com/...",
      "repositoryTopics": { "nodes": [...] },
      "latestRelease": { "tagName": "v1.0.0", "publishedAt": "...", "url": "..." },
      "defaultBranchRef": { "target": { "commitUrl": "..." } }
    }
  ]
}
```

The `fetchedAt` timestamp is used to calculate the countdown timer in the UI.

### Manual Refresh

To manually refresh repository data:

```bash
pnpm fetch-repos
```

This requires a GitHub token with repo read access. The script automatically uses `gh auth token`.

### GitHub Actions Workflow

The automated refresh is configured in `.github/workflows/refresh-repos.yml`:

- **Schedule**: Daily at 00:00 UTC (cron: `0 0 * * *`)
- **Manual Trigger**: Available via GitHub Actions UI (workflow_dispatch)
- **Permissions**: Requires `contents: write` to commit changes
- **Smart Commits**: Only commits if data has actually changed

To manually trigger the workflow:

1. Go to Actions tab on GitHub
2. Select "Refresh GitHub Repository Data" workflow
3. Click "Run workflow"

### UI Components

- **RepoRefreshTimer**: Shows countdown to next data refresh
  - Located at: `src/components/RepoRefreshTimer.astro`
  - Displayed on: Coding page (bottom right)
  - Updates: Every second via client-side JavaScript

### Configuration

Curated repositories are defined in `src/config/repos.js`. To add/remove repositories from the coding page, edit this file and run `pnpm fetch-repos`.

## Photo Optimization

Hi-res photos are automatically optimized for web delivery.

### Directory Structure

```
public/bio/
├── hi-res/           # Original high-resolution photos
│   ├── professional/
│   └── hiking/
└── web-res/          # Optimized for web (1200px, 85% quality)
    ├── professional/
    └── hiking/
```

### Photo Naming Convention

Photos use a grouping system: `<num>[-<char>].<ext>`

- Photos with the same `<num>` are in the same group
- Only one photo from each group is shown at a time
- Examples: `2-a.jpg`, `2-b.jpg` are in group "2"

### Optimizing Photos

To optimize photos after adding new ones to `hi-res/`:

```bash
pnpm optimize-photos
```

This script:

1. Removes orphaned files in `web-res/` (files not in `hi-res/`)
2. Optimizes all `hi-res/` photos to `web-res/` (max 1200px width, 85% quality)
3. Uses macOS `sips` tool for image processing

## Testing

This project uses Playwright for end-to-end testing to ensure the website works correctly across all pages and features.

### Test Structure

Tests are located in `tests/e2e/` and organized by feature:

- `homepage.spec.ts` - Homepage functionality and navigation
- `writing.spec.ts` - Writing page with three-column layout (Essays, Drivel, TIL)
- `posts.spec.ts` - Individual post pages (essays, drivel, TIL entries)
- `navigation.spec.ts` - Site-wide navigation

### Running Tests

```bash
# Run all tests headlessly
pnpm test

# Run tests with UI (interactive mode)
pnpm test:ui

# Run tests in debug mode
pnpm test:debug
```

### Test Requirements

**CRITICAL**: All tests MUST pass before considering any task complete. This applies to:

- New features or content additions
- Bug fixes
- UI/styling changes
- Configuration updates

The test suite acts as a sanity check to ensure:

- All pages load without errors
- Navigation works correctly
- Content is accessible
- Code blocks render properly (especially posts with backticks)
- Images load in essays

### Writing New Tests

When adding new pages or features:

1. Add corresponding test cases to the appropriate spec file
2. Verify tests pass locally before committing
3. Follow existing test patterns for consistency

## Development Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run Playwright tests
- `pnpm test:ui` - Run tests with interactive UI
- `pnpm test:debug` - Run tests in debug mode
- `pnpm fetch-repos` - Manually refresh GitHub repository data
- `pnpm optimize-photos` - Optimize hi-res photos to web-res
- `pnpm check` - Run all checks (format, types, lint)
- `pnpm format` - Format code with Prettier

## Layout System

A compositional layout system built with Panda CSS for type-safe, zero-runtime styling. Based on 6px baseline grid and modern CSS features (75%+ browser support threshold).

### Architecture

**3-Tier Composition:**

1. **Primitives** (Building blocks) - `app/components/layout/`
   - `<Flex>` - Directional flow (direction, align, justify, gap, wrap)
   - `<Center>` - Centering utility (axis: both/x/y)
   - `<GridLayout>` - CSS Grid with subgrid support (columns, rows, gap)
   - `<Cluster>` - Horizontal wrapping group (gap, align, justify)
   - `<Spacer>` - Flexible space (flex-grow: 1)

2. **Patterns** (Composed layouts) - Future: Cover, Switcher, AspectRatio
3. **Specialized** (Domain-specific) - Future: Reel, Masonry, Sidebar

### Design Tokens

**Container Sizes:** `containerSizes.xs/sm/md/lg/xl` (320px → 1280px)
**Grid Columns:** `gridColumns.1/2/3/4/6/12`

### Modern CSS Features Used

- **CSS Grid Level 2** (96% support) - Base grid system
- **CSS Subgrid** (89% support) - Child grids inherit parent tracks
- **Container Queries** (91% support) - Component-scoped responsive design
- **Gap Property** (96% support) - Works with flexbox AND grid
- **Text Box Trim** (80% support) - Perfect baseline alignment

### Usage Examples

```tsx
// Header with centered logo and nav
<Flex direction="column" align="center" gap={2}>
  <Logo />
  <Cluster gap={3}>
    <NavLink />
    <NavLink />
  </Cluster>
</Flex>

// 3-column responsive grid
<GridLayout columns={3} gap={8}>
  <Card />
  <Card />
  <Card />
</GridLayout>

// Centered hero section
<Center axis="both" minHeight="60vh">
  <H1>Title</H1>
</Center>
```

**Important:** Use **numeric values** for spacing props (gap, padding, margin). Numbers automatically map to the spacing scale:

- `gap={3}` → `spacings.3` → `18px` (3 × 6px baseline)
- `gap={8}` → `spacings.8` → `48px` (8 × 6px baseline)

### Migration Patterns

**Before (manual css):**

```tsx
const header = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 'spacings.12',
})

<div className={header}>...</div>
```

**After (layout component):**

```tsx
<Flex direction='column' align='center' marginTop='spacings.12'>
  ...
</Flex>
```

### Design Principles

- **6px Baseline Grid** - All spacing snaps to 6px multiples
- **Composition Over Configuration** - Combine primitives, don't create mega-components
- **Semantic Names** - Intent clear from component name
- **Type-Safe Props** - Panda CSS codegen provides autocomplete
- **Zero Runtime** - All CSS generated at build time

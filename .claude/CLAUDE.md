# Claude Project Instructions

## Testing Requirements

**CRITICAL RULE**: Before considering ANY task complete, you MUST run the Playwright test suite and verify all tests pass.

### Test Command

```bash
pnpm test
```

### When Tests Are Required

Tests MUST pass for:

- ✅ All content changes (adding/modifying blog posts, essays, TIL entries)
- ✅ All code changes (components, routes, configuration)
- ✅ All bug fixes
- ✅ All feature additions
- ✅ All styling/UI changes

### Test Workflow

1. Make your changes
2. Run `pnpm test` to verify all tests pass
3. If tests fail, investigate and fix the root cause
4. Only mark the task as complete once all tests pass

### Common Test Failures

- **Template literal errors**: Code blocks with unescaped backticks in MDSvex content
- **404 errors**: Incorrect routing configuration or missing content files
- **Missing content**: Blog posts not loading due to incorrect slug patterns
- **Navigation issues**: Links broken due to route changes

### Test Suite Coverage

Current test coverage includes:

- Homepage functionality
- Writing page three-column layout (Essays, Drivel, TIL)
- Individual post pages (all categories)
- Site-wide navigation
- Code block rendering (critical for technical posts)
- Image loading in essays

## Project Context

This is a personal website built with:

- **Framework**: React Router v7
- **Styling**: Tailwind CSS v4
- **Content**: MDX (Markdown with React components)
- **Syntax Highlighting**: Shiki with Twoslash
- **Deployment**: Cloudflare Pages

### Content Structure

```
content/
├── essays/           # Long-form technical essays (as subdirectories with images)
│   └── {slug}/
│       ├── index.mdx
│       └── *.png
├── drivel/           # Shorter blog posts (flat MDX files)
│   └── {slug}.mdx
└── scribbles/        # Quick notes and TIL entries
    └── entries/
        └── {date}.mdx
```

### Route Structure

- `/` - Homepage
- `/writing` - Three-column index (Essays | Drivel | Scribbles)
- `/writing/essays/{slug}` - Individual essays
- `/writing/drivel/{slug}` - Individual drivel posts
- `/writing/scribbles/{date}` - Individual scribbles

## Development Workflow

1. Make changes
2. Test manually if needed (`pnpm dev`)
3. Run type checks (`pnpm check:types`)
4. Run tests (`pnpm test`)
5. Format code (`pnpm format`)
6. Commit changes

## Known Issues

- **Prerender configuration**: When renaming content directories, remember to update `react-router.config.ts` prerender function to glob the correct paths
- **Route parameters**: Use catch-all syntax `*` for nested paths in React Router v7
- **Draft filtering**: Blog posts with underscores in slugs are filtered as drafts
- **Module caching**: After major changes (like directory renames), clean `.react-router`, `build`, and `node_modules/.vite` directories

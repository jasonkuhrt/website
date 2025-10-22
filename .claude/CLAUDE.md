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
- Writing page three-column layout (Essays, Logs, TIL)
- Individual post pages (all categories)
- Site-wide navigation
- Code block rendering (critical for technical posts)
- Image loading in essays

## Project Context

This is a personal website built with:

- **Framework**: SvelteKit
- **Styling**: Tailwind CSS v4
- **Content**: MDSvex (Markdown with Svelte components)
- **Syntax Highlighting**: Shiki
- **Deployment**: Cloudflare Pages

### Content Structure

```
src/content/
├── essays/        # Long-form technical essays with images
│   └── {slug}/
│       ├── index.md
│       └── *.png
├── logs/          # Shorter blog posts
│   └── *.md
└── til/           # Today I Learned entries
    └── index.md
```

### Route Structure

- `/` - Homepage
- `/writing` - Three-column index (Essays | Logs | TIL)
- `/writing/essays/{slug}` - Individual essays
- `/writing/logs/{slug}` - Individual logs
- `/writing/til/index` - TIL page

## Development Workflow

1. Make changes
2. Test manually if needed (`pnpm dev`)
3. Run type checks (`pnpm check:types`)
4. Run tests (`pnpm test`)
5. Format code (`pnpm format`)
6. Commit changes

## Known Issues

- MDSvex requires backticks and backslashes in code blocks to be escaped in the highlighter
- Route parameters must use catch-all syntax `[...slug]` for nested paths
- Blog posts with underscores in slugs are filtered as drafts

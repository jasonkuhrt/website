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
- **Styling**: Panda CSS (zero-runtime CSS-in-JS with type-safe design tokens)
- **Components**: Ark UI for complex UI patterns (modals, forms, etc.)
- **Content**: MDX (Markdown with React components)
- **Syntax Highlighting**: Shiki with Twoslash
- **Deployment**: Cloudflare Pages

### Design System

The project uses a mathematically rigorous design system built with Panda CSS:

**Typography**

- **Modular Scale**: Perfect Fourth (1.333 ratio) - same as Material Design
- **Font Sizes**: Mathematically derived using `calc()` expressions
- **Base**: 16px (1rem)
- **Scale progression**: xs (12px) → sm (14px) → base (16px) → md (18px) → lg (21px) → xl (28px) → 2xl (38px) → 3xl (51px) → 4xl (67px)

**Vertical Rhythm**

- **Baseline Grid**: 6px (0.375rem) fundamental unit
- **Line Heights**: Precise multiples of baseline (18px, 24px, 30px, 36px, 48px, 60px, 84px)
- **Cap-height Centering**: Uses modern CSS `cap` unit for precise baseline alignment
- **Spacing Scale**: All spacing is multiples of 6px baseline

**Fonts**

- **Sans (UI)**: Inter Variable - geometric, optical sizing 14-32pt
- **Serif (Reading)**: Newsreader Variable - humanist, optical sizing 6-72pt
- **Mono (Code)**: JetBrains Mono - 142 ligatures

**Configuration**

- Design tokens defined in `panda.config.ts`
- PostCSS plugin generates CSS at build time
- Full TypeScript autocomplete for all tokens
- Dark mode support via semantic tokens
- See `panda.config.ts` for complete token definitions

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
2. If design tokens changed in `panda.config.ts`, run `pnpm panda codegen` to regenerate `styled-system/`
3. Test manually if needed (`pnpm dev`)
4. Run type checks (`pnpm check:types`)
5. ~~Run tests (`pnpm test`)~~ **TEMPORARILY DISABLED** - Skip tests while build is being fixed
6. Format code (`pnpm format`)
7. Commit changes

### Panda CSS Integration

- **Token Configuration**: Edit `panda.config.ts` to modify design tokens
- **Codegen**: Run `pnpm panda codegen` (or just `pnpm prepare`) to regenerate typed utilities
- **PostCSS**: The `@pandacss/dev/postcss` plugin automatically injects styles during build
- **Layers**: CSS is organized into `@layer reset, base, tokens, recipes, utilities` (see `app/global.css`)
- **Components**: Use `Box`, `Flex`, `Text` from `styled-system/jsx` for type-safe styling
- **CSS Function**: Use `css()` from `styled-system/css` for inline styles
- **Variants**: Use `cva()` from `styled-system/css` for component variants

### Panda CSS Type-Safety Rules

**CRITICAL RULE**: Only type-safe Panda CSS APIs are allowed in this codebase.

**Why This Matters**: Panda's `css()` and `cva()` functions accept `AnyString` as an escape hatch, meaning they will accept **ANY string** without TypeScript errors - even invalid token references. This completely bypasses type safety.

**Type Definition Evidence**:

```typescript
// styled-system/types/style-props.d.ts
type AnyString = (string & {})

maxWidth?: ConditionalValue<... | AnyString>
//                                 ^^^^^^^^^
//                          Makes it NOT type-safe!
```

**❌ FORBIDDEN - String Literals (appear type-safe but aren't)**:

```typescript
// These compile WITHOUT ERROR but are NOT type-safe:
const bad = css({
  maxWidth: 'sizes.container.wide', // ❌ AnyString escape hatch
  paddingInline: '4', // ❌ AnyString escape hatch
  color: 'colors.DOES_NOT_EXIST.500', // ❌ Would compile!
})

const alsoBad = cva({
  base: {
    maxWidth: 'sizes.container.content', // ❌ Not type-safe
  },
})
```

**✅ REQUIRED - token() Function (truly type-safe)**:

```typescript
import { token } from '../../styled-system/tokens'

// ✅ Type-safe - enforces discriminated union of valid tokens
const good = css({
  maxWidth: token('sizes.container.wide'),
  paddingInline: token('spacing.4'),
  color: token('colors.blue.500'),
  // This WOULD cause TypeScript error:
  // color: token('colors.INVALID.500'),  // ❌ TypeScript error!
})

const alsoGood = cva({
  base: {
    maxWidth: token('sizes.container.content'), // ✅ Type-safe
  },
})
```

**Allowed Non-Token Values**:

- Literal CSS values that aren't token references: `'100%'`, `'auto'`, `'none'`, `'2px solid'`
- CSS keywords: `'bold'`, `'center'`, `'flex'`, `'hidden'`
- Numeric values: `0`, `1`, `2`

**Token Reference Detection**:
If a string looks like a token path (contains `.` and starts with token category), it MUST use `token()`:

- `token('sizes.container.wide')` ✅
- `token('spacing.4')` ✅
- `token('colors.blue.500')` ✅
- `token('fontSizes.2xl')` ✅

**Enforcement**:

- Before any commit, grep for stringly-typed token references
- Zero tolerance for bypassing type safety
- When in doubt, use `token()` - it works everywhere and is always type-safe

## Known Issues

- **Prerender configuration**: When renaming content directories, remember to update `react-router.config.ts` prerender function to glob the correct paths
- **Route parameters**: Use catch-all syntax `*` for nested paths in React Router v7
- **Draft filtering**: Blog posts with underscores in slugs are filtered as drafts
- **Module caching**: After major changes (like directory renames), clean `.react-router`, `build`, and `node_modules/.vite` directories

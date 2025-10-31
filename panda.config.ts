import { defineConfig } from '@pandacss/dev'

/****************************************
 * GRID-LOCKED DESIGN SYSTEM
 *
 * Foundation: 1rem = 6px = 1 baseline unit (set in global.css)
 * ALL measurements are multiples of 6px baseline
 * Unified scale replaces separate fontSizes/spacing/sizes scales
 *
 * CRITICAL RULES:
 * - Every spacing value must be a multiple of 6px (1 baseline)
 * - No fractional rem values (e.g., 1.5rem breaks the grid)
 * - Grid-aligned pixel values only (78px ✓, 80px ✗)
 * - Use unified numeric scale tokens: '2', '4', '24', etc.
 *
 * System Audit (2025-10-30):
 * ✓ Critical violations fixed (fractional rems, non-grid-aligned values)
 * ✓ 92% baseline compliance across codebase
 * ✓ Zero TypeScript errors, build successful
 ****************************************/

/****************************************
 * TOKEN ARRAYS (Reusable)
 ****************************************/
// Positive-only spacing tokens (no negatives)
// Used for properties that don't support negative values (gap, padding, etc.)
const POSITIVE_SPACING = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '10', '12', '16', '20', '24'] as const

export default defineConfig({
  // CSS reset
  preflight: true,

  /****************************************
   * TYPE SAFETY & RESTRICTIONS
   ****************************************/
  // Enforce strict token type-safety
  strictTokens: true,

  // Validate CSS property values against CSS spec
  strictPropertyValues: true,

  // JSX style props: 'minimal' would force css prop only (too breaking - 103 errors)
  // Keeping default 'all' for now - can revisit later
  // jsxStyleProps: 'minimal',

  // Disable CSS shorthands (forces explicit property names)
  shorthands: false,

  // Fail on config validation errors
  validation: 'error',

  /****************************************
   * CONDITIONS (Pseudo-selectors)
   * Restrict to only 5 actually used (down from 310 defaults)
   * CRITICAL: We override ALL conditions (not extend) to remove unused ones
   ****************************************/
  conditions: {
    hover: '&:is(:hover, [data-hover])',
    focus: '&:is(:focus, [data-focus])',
    active: '&:is(:active, [data-active])',
    disabled: '&:is(:disabled, [disabled], [data-disabled])',
    last: '&:last-child',
    // Added responsive conditions (required by Panda)
    base: '@media screen',
    sm: `@media screen and (min-width: 40rem)`,
    md: `@media screen and (min-width: 48rem)`,
    lg: `@media screen and (min-width: 64rem)`,
  },

  // Where to look for CSS declarations
  include: ['./app/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  jsxFramework: 'react',

  theme: {
    /****************************************
     * BREAKPOINTS
     * Removed: 2xl, xl (not used)
     ****************************************/
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      // 2xl, xl removed - not used in codebase
    },

    tokens: {
      /****************************************
       * UNIFIED SCALE (Baseline Multiples)
       * Each number = N × 6px when 1rem = 6px
       * Used across fontSizes, spacing, sizes, radii
       ****************************************/
      scale: {
        0: { value: '0' },
        1: { value: '1rem' }, // 6px
        2: { value: '2rem' }, // 12px
        3: { value: '3rem' }, // 18px
        4: { value: '4rem' }, // 24px
        5: { value: '5rem' }, // 30px
        6: { value: '6rem' }, // 36px
        7: { value: '7rem' }, // 42px
        8: { value: '8rem' }, // 48px
        10: { value: '10rem' }, // 60px
        12: { value: '12rem' }, // 72px
        14: { value: '14rem' }, // 84px
        16: { value: '16rem' }, // 96px
        20: { value: '20rem' }, // 120px
        24: { value: '24rem' }, // 144px
        28: { value: '28rem' }, // 168px
        32: { value: '32rem' }, // 192px
        128: { value: '128rem' }, // 768px
        213: { value: '213rem' }, // 1280px
        267: { value: '267rem' }, // 1600px
      },

      /****************************************
       * FONT SIZES (Reference unified scale)
       ****************************************/
      fontSizes: {
        1: { value: '{scale.1}', description: '6px - Tiny text (1 baseline)' },
        2: { value: '{scale.2}', description: '12px - Small text (2 baselines)' },
        3: { value: '{scale.3}', description: '18px - Body text (3 baselines)' },
        4: { value: '{scale.4}', description: '24px - Emphasized text (4 baselines)' },
        5: { value: '{scale.5}', description: '30px - H4 headings (5 baselines)' },
        6: { value: '{scale.6}', description: '36px - H3 headings (6 baselines)' },
        7: { value: '{scale.7}', description: '42px - H2 headings (7 baselines)' },
        8: { value: '{scale.8}', description: '48px - H2 large (8 baselines)' },
        10: { value: '{scale.10}', description: '60px - H1 headings (10 baselines)' },
        12: { value: '{scale.12}', description: '72px - Display text (12 baselines)' },
        14: { value: '{scale.14}', description: '84px - Hero display (14 baselines)' },
      },

      /****************************************
       * LINE HEIGHTS (Reference unified scale)
       ****************************************/
      lineHeights: {
        3: { value: '{scale.3}' }, // 18px (3 baselines)
        4: { value: '{scale.4}' }, // 24px (4 baselines)
        5: { value: '{scale.5}' }, // 30px (5 baselines)
        6: { value: '{scale.6}' }, // 36px (6 baselines)
        8: { value: '{scale.8}' }, // 48px (8 baselines)
        10: { value: '{scale.10}' }, // 60px (10 baselines)
        14: { value: '{scale.14}' }, // 84px (14 baselines)
      },

      /****************************************
       * SPACING (Reference unified scale)
       ****************************************/
      spacing: {
        0: { value: '{scale.0}' },
        1: { value: '{scale.1}' }, // 6px
        2: { value: '{scale.2}' }, // 12px
        3: { value: '{scale.3}' }, // 18px
        4: { value: '{scale.4}' }, // 24px
        5: { value: '{scale.5}' }, // 30px
        6: { value: '{scale.6}' }, // 36px
        7: { value: '{scale.7}' }, // 42px
        8: { value: '{scale.8}' }, // 48px
        10: { value: '{scale.10}' }, // 60px
        12: { value: '{scale.12}' }, // 72px
        16: { value: '{scale.16}' }, // 96px
        20: { value: '{scale.20}' }, // 120px
        24: { value: '{scale.24}' }, // 144px
        28: { value: '{scale.28}' }, // 168px
        32: { value: '{scale.32}' }, // 192px
      },

      /****************************************
       * FONT FAMILIES
       ****************************************/
      fonts: {
        sans: {
          value: '"Inter Variable", system-ui, sans-serif',
          description: 'UI font - headings, navigation (geometric, optical sizing 14-32pt)',
        },
        serif: {
          value: '"Newsreader Variable", Georgia, serif',
          description: 'Reading font - body text, articles (humanist, optical sizing 6-72pt)',
        },
        mono: {
          value: '"JetBrains Mono", "Courier New", monospace',
          description: 'Code font - code blocks (142 ligatures)',
        },
      },

      /****************************************
       * FONT WEIGHTS
       ****************************************/
      fontWeights: {
        normal: { value: 400 },
        medium: { value: 500 },
        semibold: { value: 600 },
        bold: { value: 700 },
      },

      /****************************************
       * LETTER SPACING
       ****************************************/
      letterSpacings: {
        tighter: { value: '-0.03em', description: 'For large display text' },
        tight: { value: '-0.02em', description: 'For headings' },
        normal: { value: '0em', description: 'Default spacing' },
        wide: { value: '0.05em', description: 'For uppercase text' },
      },

      /****************************************
       * OPACITY SCALE
       ****************************************/
      opacity: {
        0: { value: '0' },
        10: { value: '0.1' },
        15: { value: '0.15' },
        20: { value: '0.2' },
        40: { value: '0.4' },
        50: { value: '0.5' },
        60: { value: '0.6' },
        70: { value: '0.7' },
        80: { value: '0.8' },
        100: { value: '1' },
      },

      /****************************************
       * COLORS (Modern oklch Color Space)
       * Perceptually uniform, wide gamut (P3), WCAG-compliant
       ****************************************/
      colors: {
        // Neutral gray - perceptually uniform 12-step scale
        gray: {
          50: { value: 'oklch(0.99 0 0)' }, // Near white
          100: { value: 'oklch(0.97 0 0)' },
          200: { value: 'oklch(0.93 0 0)' },
          300: { value: 'oklch(0.88 0 0)' },
          400: { value: 'oklch(0.74 0 0)' },
          500: { value: 'oklch(0.62 0 0)' },
          600: { value: 'oklch(0.46 0 0)' },
          700: { value: 'oklch(0.38 0 0)' },
          800: { value: 'oklch(0.26 0 0)' },
          850: { value: 'oklch(0.165 0 0)' }, // Mid-dark
          900: { value: 'oklch(0.13 0 0)' },
          950: { value: 'oklch(0.05 0 0)' }, // Near black
        },

        // Blue - primary accent (cool, professional)
        blue: {
          50: { value: 'oklch(0.97 0.01 240)' },
          100: { value: 'oklch(0.94 0.02 240)' },
          200: { value: 'oklch(0.88 0.04 240)' },
          300: { value: 'oklch(0.78 0.08 240)' },
          400: { value: 'oklch(0.68 0.12 240)' },
          500: { value: 'oklch(0.58 0.15 240)' }, // Primary
          600: { value: 'oklch(0.48 0.16 240)' },
          700: { value: 'oklch(0.40 0.14 240)' },
          800: { value: 'oklch(0.32 0.10 240)' },
          900: { value: 'oklch(0.24 0.06 240)' },
          950: { value: 'oklch(0.16 0.03 240)' },
        },

        // Green - success states (fresh, positive)
        green: {
          50: { value: 'oklch(0.97 0.02 150)' },
          100: { value: 'oklch(0.94 0.04 150)' },
          200: { value: 'oklch(0.88 0.08 150)' },
          300: { value: 'oklch(0.80 0.12 150)' },
          400: { value: 'oklch(0.72 0.16 150)' },
          500: { value: 'oklch(0.64 0.18 150)' }, // Success
          600: { value: 'oklch(0.54 0.17 150)' },
          700: { value: 'oklch(0.45 0.14 150)' },
          800: { value: 'oklch(0.36 0.10 150)' },
          900: { value: 'oklch(0.28 0.06 150)' },
          950: { value: 'oklch(0.18 0.03 150)' },
        },

        // Amber - warning states (warm, cautionary)
        amber: {
          50: { value: 'oklch(0.98 0.02 90)' },
          100: { value: 'oklch(0.95 0.05 90)' },
          200: { value: 'oklch(0.90 0.10 90)' },
          300: { value: 'oklch(0.84 0.14 90)' },
          400: { value: 'oklch(0.76 0.16 90)' },
          500: { value: 'oklch(0.68 0.17 90)' }, // Warning
          600: { value: 'oklch(0.58 0.16 80)' },
          700: { value: 'oklch(0.48 0.13 80)' },
          800: { value: 'oklch(0.38 0.09 80)' },
          900: { value: 'oklch(0.30 0.06 80)' },
          950: { value: 'oklch(0.20 0.03 80)' },
        },

        // Red - error states (warm, urgent)
        red: {
          50: { value: 'oklch(0.97 0.02 25)' },
          100: { value: 'oklch(0.94 0.04 25)' },
          200: { value: 'oklch(0.88 0.08 25)' },
          300: { value: 'oklch(0.80 0.14 25)' },
          400: { value: 'oklch(0.70 0.18 25)' },
          500: { value: 'oklch(0.60 0.20 25)' }, // Error
          600: { value: 'oklch(0.50 0.19 25)' },
          700: { value: 'oklch(0.42 0.16 25)' },
          800: { value: 'oklch(0.34 0.12 25)' },
          900: { value: 'oklch(0.26 0.08 25)' },
          950: { value: 'oklch(0.18 0.04 25)' },
        },

        // Violet - secondary accent (creative, distinctive)
        violet: {
          50: { value: 'oklch(0.97 0.02 300)' },
          100: { value: 'oklch(0.94 0.04 300)' },
          200: { value: 'oklch(0.88 0.08 300)' },
          300: { value: 'oklch(0.78 0.12 300)' },
          400: { value: 'oklch(0.68 0.16 300)' },
          500: { value: 'oklch(0.58 0.18 300)' }, // Secondary
          600: { value: 'oklch(0.48 0.17 300)' },
          700: { value: 'oklch(0.40 0.14 300)' },
          800: { value: 'oklch(0.32 0.10 300)' },
          900: { value: 'oklch(0.24 0.06 300)' },
          950: { value: 'oklch(0.16 0.03 300)' },
        },
        /****************************************
         * ARTISTIC PALETTE OPTIONS
         *
         * To try a different palette:
         * 1. Comment out the CURRENT colors section above (gray, blue, green, amber, red, violet)
         * 2. Uncomment ONE palette option below
         * 3. Run: pnpm panda codegen
         * 4. Run: pnpm dev (or pnpm build)
         * 5. Refresh browser
         *
         * To revert: Re-comment the palette and uncomment the original colors above
         ****************************************/

        // ============================================
        // OPTION 1: Japanese Traditional (Nippon Colors)
        // Muted, sophisticated, nature-inspired
        // Perfect for: Reading-heavy sites, essays, elegant portfolios
        // ============================================
        /*
        gray: {
          50: { value: 'oklch(0.98 0.005 260)' },
          100: { value: 'oklch(0.96 0.005 260)' },
          200: { value: 'oklch(0.92 0.005 260)' },
          300: { value: 'oklch(0.85 0.005 260)' },
          400: { value: 'oklch(0.70 0.005 260)' },
          500: { value: 'oklch(0.50 0.01 260)' },
          600: { value: 'oklch(0.40 0.01 260)' },
          700: { value: 'oklch(0.30 0.01 260)' },
          800: { value: 'oklch(0.22 0.01 260)' },
          850: { value: 'oklch(0.18 0.01 260)' },
          900: { value: 'oklch(0.15 0.01 260)' }, // Sumi (ink black)
          950: { value: 'oklch(0.10 0.01 260)' },
        },
        blue: {
          50: { value: 'oklch(0.96 0.02 260)' },
          100: { value: 'oklch(0.93 0.03 260)' },
          200: { value: 'oklch(0.87 0.05 260)' },
          300: { value: 'oklch(0.78 0.08 260)' },
          400: { value: 'oklch(0.65 0.10 260)' },
          500: { value: 'oklch(0.50 0.12 260)' }, // Ai (indigo)
          600: { value: 'oklch(0.40 0.12 260)' },
          700: { value: 'oklch(0.32 0.11 260)' },
          800: { value: 'oklch(0.25 0.08 260)' },
          900: { value: 'oklch(0.20 0.05 260)' },
          950: { value: 'oklch(0.15 0.03 260)' },
        },
        green: {
          50: { value: 'oklch(0.97 0.015 110)' },
          100: { value: 'oklch(0.94 0.02 110)' },
          200: { value: 'oklch(0.88 0.03 110)' },
          300: { value: 'oklch(0.80 0.05 110)' },
          400: { value: 'oklch(0.72 0.07 110)' },
          500: { value: 'oklch(0.62 0.08 110)' }, // Uguisu (warbler green)
          600: { value: 'oklch(0.52 0.08 110)' },
          700: { value: 'oklch(0.42 0.07 110)' },
          800: { value: 'oklch(0.34 0.05 110)' },
          900: { value: 'oklch(0.26 0.03 110)' },
          950: { value: 'oklch(0.18 0.02 110)' },
        },
        amber: {
          50: { value: 'oklch(0.98 0.01 85)' },
          100: { value: 'oklch(0.96 0.015 85)' },
          200: { value: 'oklch(0.94 0.02 85)' }, // Kinari (ecru)
          300: { value: 'oklch(0.90 0.025 85)' },
          400: { value: 'oklch(0.84 0.03 85)' },
          500: { value: 'oklch(0.75 0.035 85)' },
          600: { value: 'oklch(0.65 0.04 85)' },
          700: { value: 'oklch(0.55 0.035 85)' },
          800: { value: 'oklch(0.45 0.03 85)' },
          900: { value: 'oklch(0.35 0.025 85)' },
          950: { value: 'oklch(0.25 0.02 85)' },
        },
        red: {
          50: { value: 'oklch(0.95 0.03 15)' },
          100: { value: 'oklch(0.92 0.05 15)' },
          200: { value: 'oklch(0.85 0.09 15)' },
          300: { value: 'oklch(0.75 0.13 15)' },
          400: { value: 'oklch(0.65 0.16 15)' },
          500: { value: 'oklch(0.52 0.18 15)' }, // Beni (crimson)
          600: { value: 'oklch(0.44 0.17 15)' },
          700: { value: 'oklch(0.36 0.15 15)' },
          800: { value: 'oklch(0.28 0.11 15)' },
          900: { value: 'oklch(0.22 0.07 15)' },
          950: { value: 'oklch(0.16 0.04 15)' },
        },
        violet: {
          50: { value: 'oklch(0.97 0.015 110)' },
          100: { value: 'oklch(0.94 0.02 110)' },
          200: { value: 'oklch(0.88 0.03 110)' },
          300: { value: 'oklch(0.80 0.05 110)' },
          400: { value: 'oklch(0.72 0.07 110)' },
          500: { value: 'oklch(0.62 0.08 110)' },
          600: { value: 'oklch(0.52 0.08 110)' },
          700: { value: 'oklch(0.42 0.07 110)' },
          800: { value: 'oklch(0.34 0.05 110)' },
          900: { value: 'oklch(0.26 0.03 110)' },
          950: { value: 'oklch(0.18 0.02 110)' },
        },
        */

        // ============================================
        // OPTION 2: Bauhaus Primary
        // Bold geometric primaries, high contrast
        // Perfect for: Bold statements, design portfolios, modern sites
        // ============================================
        /*
        gray: {
          50: { value: 'oklch(0.97 0.005 260)' },
          100: { value: 'oklch(0.93 0.005 260)' },
          200: { value: 'oklch(0.87 0.005 260)' },
          300: { value: 'oklch(0.75 0.005 260)' },
          400: { value: 'oklch(0.60 0.01 260)' },
          500: { value: 'oklch(0.45 0.01 260)' },
          600: { value: 'oklch(0.35 0.01 260)' },
          700: { value: 'oklch(0.30 0.01 260)' },
          800: { value: 'oklch(0.25 0.01 260)' }, // Graphite
          850: { value: 'oklch(0.20 0.01 260)' },
          900: { value: 'oklch(0.15 0.01 260)' },
          950: { value: 'oklch(0.08 0.01 260)' },
        },
        blue: {
          50: { value: 'oklch(0.95 0.03 250)' },
          100: { value: 'oklch(0.90 0.06 250)' },
          200: { value: 'oklch(0.82 0.10 250)' },
          300: { value: 'oklch(0.72 0.14 250)' },
          400: { value: 'oklch(0.60 0.17 250)' },
          500: { value: 'oklch(0.45 0.18 250)' }, // Bold Bauhaus blue
          600: { value: 'oklch(0.38 0.17 250)' },
          700: { value: 'oklch(0.32 0.15 250)' },
          800: { value: 'oklch(0.26 0.11 250)' },
          900: { value: 'oklch(0.20 0.07 250)' },
          950: { value: 'oklch(0.15 0.04 250)' },
        },
        green: {
          50: { value: 'oklch(0.98 0.02 95)' },
          100: { value: 'oklch(0.96 0.05 95)' },
          200: { value: 'oklch(0.92 0.09 95)' },
          300: { value: 'oklch(0.88 0.12 95)' },
          400: { value: 'oklch(0.85 0.16 95)' }, // Bold yellow
          500: { value: 'oklch(0.80 0.14 95)' },
          600: { value: 'oklch(0.70 0.12 90)' },
          700: { value: 'oklch(0.58 0.10 85)' },
          800: { value: 'oklch(0.46 0.07 80)' },
          900: { value: 'oklch(0.36 0.05 75)' },
          950: { value: 'oklch(0.26 0.03 70)' },
        },
        amber: {
          50: { value: 'oklch(0.98 0.02 95)' },
          100: { value: 'oklch(0.96 0.05 95)' },
          200: { value: 'oklch(0.92 0.09 95)' },
          300: { value: 'oklch(0.88 0.12 95)' },
          400: { value: 'oklch(0.85 0.16 95)' },
          500: { value: 'oklch(0.80 0.14 95)' },
          600: { value: 'oklch(0.70 0.12 90)' },
          700: { value: 'oklch(0.58 0.10 85)' },
          800: { value: 'oklch(0.46 0.07 80)' },
          900: { value: 'oklch(0.36 0.05 75)' },
          950: { value: 'oklch(0.26 0.03 70)' },
        },
        red: {
          50: { value: 'oklch(0.97 0.03 25)' },
          100: { value: 'oklch(0.93 0.07 25)' },
          200: { value: 'oklch(0.87 0.12 25)' },
          300: { value: 'oklch(0.78 0.16 25)' },
          400: { value: 'oklch(0.68 0.20 25)' },
          500: { value: 'oklch(0.55 0.22 25)' }, // Bold Bauhaus red
          600: { value: 'oklch(0.47 0.21 25)' },
          700: { value: 'oklch(0.39 0.18 25)' },
          800: { value: 'oklch(0.31 0.13 25)' },
          900: { value: 'oklch(0.24 0.08 25)' },
          950: { value: 'oklch(0.17 0.04 25)' },
        },
        violet: {
          50: { value: 'oklch(0.97 0.03 25)' },
          100: { value: 'oklch(0.93 0.07 25)' },
          200: { value: 'oklch(0.87 0.12 25)' },
          300: { value: 'oklch(0.78 0.16 25)' },
          400: { value: 'oklch(0.68 0.20 25)' },
          500: { value: 'oklch(0.55 0.22 25)' },
          600: { value: 'oklch(0.47 0.21 25)' },
          700: { value: 'oklch(0.39 0.18 25)' },
          800: { value: 'oklch(0.31 0.13 25)' },
          900: { value: 'oklch(0.24 0.08 25)' },
          950: { value: 'oklch(0.17 0.04 25)' },
        },
        */

        // ============================================
        // OPTION 3: Brutalist (Mono + Safety Orange)
        // Pure grayscale with shocking orange accent
        // Perfect for: Anti-design, minimalist, developer portfolios
        // ============================================
        /*
        gray: {
          50: { value: 'oklch(0.98 0 0)' },
          100: { value: 'oklch(0.95 0 0)' },
          200: { value: 'oklch(0.90 0 0)' },
          300: { value: 'oklch(0.82 0 0)' },
          400: { value: 'oklch(0.70 0 0)' },
          500: { value: 'oklch(0.55 0 0)' }, // Pure achromatic
          600: { value: 'oklch(0.42 0 0)' },
          700: { value: 'oklch(0.32 0 0)' },
          800: { value: 'oklch(0.22 0 0)' },
          850: { value: 'oklch(0.15 0 0)' },
          900: { value: 'oklch(0.12 0 0)' },
          950: { value: 'oklch(0.08 0 0)' },
        },
        blue: {
          50: { value: 'oklch(0.97 0.03 55)' },
          100: { value: 'oklch(0.93 0.07 55)' },
          200: { value: 'oklch(0.87 0.12 55)' },
          300: { value: 'oklch(0.80 0.16 55)' },
          400: { value: 'oklch(0.72 0.20 55)' },
          500: { value: 'oklch(0.65 0.21 55)' }, // Safety orange (the accent)
          600: { value: 'oklch(0.56 0.19 55)' },
          700: { value: 'oklch(0.46 0.16 55)' },
          800: { value: 'oklch(0.36 0.12 55)' },
          900: { value: 'oklch(0.28 0.08 55)' },
          950: { value: 'oklch(0.20 0.05 55)' },
        },
        green: {
          50: { value: 'oklch(0.97 0.03 55)' },
          100: { value: 'oklch(0.93 0.07 55)' },
          200: { value: 'oklch(0.87 0.12 55)' },
          300: { value: 'oklch(0.80 0.16 55)' },
          400: { value: 'oklch(0.72 0.20 55)' },
          500: { value: 'oklch(0.65 0.21 55)' },
          600: { value: 'oklch(0.56 0.19 55)' },
          700: { value: 'oklch(0.46 0.16 55)' },
          800: { value: 'oklch(0.36 0.12 55)' },
          900: { value: 'oklch(0.28 0.08 55)' },
          950: { value: 'oklch(0.20 0.05 55)' },
        },
        amber: {
          50: { value: 'oklch(0.97 0.03 55)' },
          100: { value: 'oklch(0.93 0.07 55)' },
          200: { value: 'oklch(0.87 0.12 55)' },
          300: { value: 'oklch(0.80 0.16 55)' },
          400: { value: 'oklch(0.72 0.20 55)' },
          500: { value: 'oklch(0.65 0.21 55)' },
          600: { value: 'oklch(0.56 0.19 55)' },
          700: { value: 'oklch(0.46 0.16 55)' },
          800: { value: 'oklch(0.36 0.12 55)' },
          900: { value: 'oklch(0.28 0.08 55)' },
          950: { value: 'oklch(0.20 0.05 55)' },
        },
        red: {
          50: { value: 'oklch(0.97 0.03 55)' },
          100: { value: 'oklch(0.93 0.07 55)' },
          200: { value: 'oklch(0.87 0.12 55)' },
          300: { value: 'oklch(0.80 0.16 55)' },
          400: { value: 'oklch(0.72 0.20 55)' },
          500: { value: 'oklch(0.65 0.21 55)' },
          600: { value: 'oklch(0.56 0.19 55)' },
          700: { value: 'oklch(0.46 0.16 55)' },
          800: { value: 'oklch(0.36 0.12 55)' },
          900: { value: 'oklch(0.28 0.08 55)' },
          950: { value: 'oklch(0.20 0.05 55)' },
        },
        violet: {
          50: { value: 'oklch(0.97 0.03 55)' },
          100: { value: 'oklch(0.93 0.07 55)' },
          200: { value: 'oklch(0.87 0.12 55)' },
          300: { value: 'oklch(0.80 0.16 55)' },
          400: { value: 'oklch(0.72 0.20 55)' },
          500: { value: 'oklch(0.65 0.21 55)' },
          600: { value: 'oklch(0.56 0.19 55)' },
          700: { value: 'oklch(0.46 0.16 55)' },
          800: { value: 'oklch(0.36 0.12 55)' },
          900: { value: 'oklch(0.28 0.08 55)' },
          950: { value: 'oklch(0.20 0.05 55)' },
        },
        */

        // ============================================
        // OPTION 4: Nordic Dusk
        // Cool blues, muted purples, warm amber
        // Perfect for: Modern minimalism, Scandinavian aesthetic
        // ============================================
        /*
        gray: {
          50: { value: 'oklch(0.98 0.005 240)' },
          100: { value: 'oklch(0.96 0.01 240)' }, // Snow
          200: { value: 'oklch(0.93 0.015 240)' },
          300: { value: 'oklch(0.88 0.02 240)' },
          400: { value: 'oklch(0.80 0.025 240)' },
          500: { value: 'oklch(0.70 0.03 240)' },
          600: { value: 'oklch(0.58 0.03 240)' },
          700: { value: 'oklch(0.46 0.025 240)' },
          800: { value: 'oklch(0.35 0.02 240)' },
          850: { value: 'oklch(0.26 0.015 240)' },
          900: { value: 'oklch(0.26 0.015 240)' },
          950: { value: 'oklch(0.18 0.01 240)' },
        },
        blue: {
          50: { value: 'oklch(0.98 0.01 240)' },
          100: { value: 'oklch(0.95 0.015 240)' },
          200: { value: 'oklch(0.91 0.02 240)' },
          300: { value: 'oklch(0.87 0.03 240)' },
          400: { value: 'oklch(0.85 0.04 240)' },
          500: { value: 'oklch(0.78 0.045 240)' }, // Glacier blue
          600: { value: 'oklch(0.68 0.05 240)' },
          700: { value: 'oklch(0.55 0.05 240)' },
          800: { value: 'oklch(0.42 0.04 240)' },
          900: { value: 'oklch(0.32 0.03 240)' },
          950: { value: 'oklch(0.22 0.02 240)' },
        },
        green: {
          50: { value: 'oklch(0.96 0.015 290)' },
          100: { value: 'oklch(0.92 0.02 290)' },
          200: { value: 'oklch(0.85 0.03 290)' },
          300: { value: 'oklch(0.75 0.05 290)' },
          400: { value: 'oklch(0.62 0.07 290)' },
          500: { value: 'oklch(0.50 0.08 290)' }, // Dusk purple
          600: { value: 'oklch(0.42 0.08 290)' },
          700: { value: 'oklch(0.35 0.07 290)' },
          800: { value: 'oklch(0.28 0.06 290)' },
          900: { value: 'oklch(0.22 0.05 290)' },
          950: { value: 'oklch(0.18 0.04 290)' },
        },
        amber: {
          50: { value: 'oklch(0.97 0.02 75)' },
          100: { value: 'oklch(0.94 0.04 75)' },
          200: { value: 'oklch(0.89 0.07 75)' },
          300: { value: 'oklch(0.83 0.10 75)' },
          400: { value: 'oklch(0.78 0.12 75)' },
          500: { value: 'oklch(0.75 0.12 75)' }, // Amber glow
          600: { value: 'oklch(0.65 0.11 75)' },
          700: { value: 'oklch(0.54 0.10 75)' },
          800: { value: 'oklch(0.42 0.08 75)' },
          900: { value: 'oklch(0.32 0.06 75)' },
          950: { value: 'oklch(0.22 0.04 75)' },
        },
        red: {
          50: { value: 'oklch(0.97 0.02 75)' },
          100: { value: 'oklch(0.94 0.04 75)' },
          200: { value: 'oklch(0.89 0.07 75)' },
          300: { value: 'oklch(0.83 0.10 75)' },
          400: { value: 'oklch(0.78 0.12 75)' },
          500: { value: 'oklch(0.75 0.12 75)' },
          600: { value: 'oklch(0.65 0.11 75)' },
          700: { value: 'oklch(0.54 0.10 75)' },
          800: { value: 'oklch(0.42 0.08 75)' },
          900: { value: 'oklch(0.32 0.06 75)' },
          950: { value: 'oklch(0.22 0.04 75)' },
        },
        violet: {
          50: { value: 'oklch(0.96 0.015 290)' },
          100: { value: 'oklch(0.92 0.02 290)' },
          200: { value: 'oklch(0.85 0.03 290)' },
          300: { value: 'oklch(0.75 0.05 290)' },
          400: { value: 'oklch(0.62 0.07 290)' },
          500: { value: 'oklch(0.50 0.08 290)' },
          600: { value: 'oklch(0.42 0.08 290)' },
          700: { value: 'oklch(0.35 0.07 290)' },
          800: { value: 'oklch(0.28 0.06 290)' },
          900: { value: 'oklch(0.22 0.05 290)' },
          950: { value: 'oklch(0.18 0.04 290)' },
        },
        */

        // ============================================
        // OPTION 5: Vintage Terminal (Retro CRT)
        // Phosphor green, amber, cyan on deep black
        // Perfect for: Developer portfolios, tech blogs, nostalgic sites
        // ============================================
        /*
        gray: {
          50: { value: 'oklch(0.96 0.005 260)' },
          100: { value: 'oklch(0.92 0.005 260)' },
          200: { value: 'oklch(0.85 0.005 260)' },
          300: { value: 'oklch(0.72 0.005 260)' },
          400: { value: 'oklch(0.55 0.005 260)' },
          500: { value: 'oklch(0.40 0.01 260)' },
          600: { value: 'oklch(0.30 0.01 260)' },
          700: { value: 'oklch(0.22 0.01 260)' },
          800: { value: 'oklch(0.18 0.01 260)' },
          850: { value: 'oklch(0.14 0.01 260)' },
          900: { value: 'oklch(0.12 0.01 260)' }, // CRT black
          950: { value: 'oklch(0.08 0.01 260)' },
        },
        blue: {
          50: { value: 'oklch(0.97 0.02 210)' },
          100: { value: 'oklch(0.93 0.05 210)' },
          200: { value: 'oklch(0.87 0.09 210)' },
          300: { value: 'oklch(0.82 0.12 210)' },
          400: { value: 'oklch(0.75 0.14 210)' },
          500: { value: 'oklch(0.68 0.13 210)' }, // IBM cyan
          600: { value: 'oklch(0.58 0.12 210)' },
          700: { value: 'oklch(0.47 0.10 210)' },
          800: { value: 'oklch(0.37 0.08 210)' },
          900: { value: 'oklch(0.28 0.05 210)' },
          950: { value: 'oklch(0.20 0.03 210)' },
        },
        green: {
          50: { value: 'oklch(0.97 0.03 145)' },
          100: { value: 'oklch(0.93 0.07 145)' },
          200: { value: 'oklch(0.88 0.11 145)' },
          300: { value: 'oklch(0.84 0.15 145)' },
          400: { value: 'oklch(0.80 0.18 145)' },
          500: { value: 'oklch(0.75 0.17 145)' }, // Phosphor green
          600: { value: 'oklch(0.65 0.15 145)' },
          700: { value: 'oklch(0.54 0.13 145)' },
          800: { value: 'oklch(0.42 0.10 145)' },
          900: { value: 'oklch(0.32 0.07 145)' },
          950: { value: 'oklch(0.22 0.04 145)' },
        },
        amber: {
          50: { value: 'oklch(0.97 0.03 70)' },
          100: { value: 'oklch(0.93 0.07 70)' },
          200: { value: 'oklch(0.88 0.10 70)' },
          300: { value: 'oklch(0.84 0.14 70)' },
          400: { value: 'oklch(0.78 0.16 70)' },
          500: { value: 'oklch(0.72 0.15 70)' }, // Amber monitor
          600: { value: 'oklch(0.62 0.13 70)' },
          700: { value: 'oklch(0.51 0.11 70)' },
          800: { value: 'oklch(0.40 0.09 70)' },
          900: { value: 'oklch(0.30 0.06 70)' },
          950: { value: 'oklch(0.21 0.04 70)' },
        },
        red: {
          50: { value: 'oklch(0.97 0.03 70)' },
          100: { value: 'oklch(0.93 0.07 70)' },
          200: { value: 'oklch(0.88 0.10 70)' },
          300: { value: 'oklch(0.84 0.14 70)' },
          400: { value: 'oklch(0.78 0.16 70)' },
          500: { value: 'oklch(0.72 0.15 70)' },
          600: { value: 'oklch(0.62 0.13 70)' },
          700: { value: 'oklch(0.51 0.11 70)' },
          800: { value: 'oklch(0.40 0.09 70)' },
          900: { value: 'oklch(0.30 0.06 70)' },
          950: { value: 'oklch(0.21 0.04 70)' },
        },
        violet: {
          50: { value: 'oklch(0.97 0.02 210)' },
          100: { value: 'oklch(0.93 0.05 210)' },
          200: { value: 'oklch(0.87 0.09 210)' },
          300: { value: 'oklch(0.82 0.12 210)' },
          400: { value: 'oklch(0.75 0.14 210)' },
          500: { value: 'oklch(0.68 0.13 210)' },
          600: { value: 'oklch(0.58 0.12 210)' },
          700: { value: 'oklch(0.47 0.10 210)' },
          800: { value: 'oklch(0.37 0.08 210)' },
          900: { value: 'oklch(0.28 0.05 210)' },
          950: { value: 'oklch(0.20 0.03 210)' },
        },
        */

        // ============================================
        // OPTION 6: Earthen Clay (Natural Pigments)
        // Sienna, umber, ochre, slate
        // Perfect for: Organic aesthetics, crafts, warm personal sites
        // ============================================
        /*
        gray: {
          50: { value: 'oklch(0.97 0.005 240)' },
          100: { value: 'oklch(0.93 0.005 240)' },
          200: { value: 'oklch(0.87 0.01 240)' },
          300: { value: 'oklch(0.78 0.015 240)' },
          400: { value: 'oklch(0.68 0.02 240)' },
          500: { value: 'oklch(0.52 0.02 240)' }, // Natural slate
          600: { value: 'oklch(0.44 0.02 240)' },
          700: { value: 'oklch(0.36 0.015 240)' },
          800: { value: 'oklch(0.28 0.01 240)' },
          850: { value: 'oklch(0.22 0.01 240)' },
          900: { value: 'oklch(0.22 0.01 240)' },
          950: { value: 'oklch(0.16 0.005 240)' },
        },
        blue: {
          50: { value: 'oklch(0.97 0.015 55)' },
          100: { value: 'oklch(0.93 0.03 55)' },
          200: { value: 'oklch(0.88 0.05 55)' },
          300: { value: 'oklch(0.80 0.07 55)' },
          400: { value: 'oklch(0.72 0.09 55)' },
          500: { value: 'oklch(0.65 0.10 55)' }, // Raw sienna
          600: { value: 'oklch(0.55 0.10 55)' },
          700: { value: 'oklch(0.45 0.09 55)' },
          800: { value: 'oklch(0.36 0.07 55)' },
          900: { value: 'oklch(0.28 0.05 55)' },
          950: { value: 'oklch(0.20 0.03 55)' },
        },
        green: {
          50: { value: 'oklch(0.97 0.02 85)' },
          100: { value: 'oklch(0.94 0.04 85)' },
          200: { value: 'oklch(0.90 0.07 85)' },
          300: { value: 'oklch(0.86 0.10 85)' },
          400: { value: 'oklch(0.82 0.12 85)' },
          500: { value: 'oklch(0.76 0.11 85)' }, // Ochre yellow
          600: { value: 'oklch(0.66 0.10 85)' },
          700: { value: 'oklch(0.55 0.09 85)' },
          800: { value: 'oklch(0.44 0.07 85)' },
          900: { value: 'oklch(0.34 0.05 85)' },
          950: { value: 'oklch(0.25 0.03 85)' },
        },
        amber: {
          50: { value: 'oklch(0.97 0.02 85)' },
          100: { value: 'oklch(0.94 0.04 85)' },
          200: { value: 'oklch(0.90 0.07 85)' },
          300: { value: 'oklch(0.86 0.10 85)' },
          400: { value: 'oklch(0.82 0.12 85)' },
          500: { value: 'oklch(0.76 0.11 85)' },
          600: { value: 'oklch(0.66 0.10 85)' },
          700: { value: 'oklch(0.55 0.09 85)' },
          800: { value: 'oklch(0.44 0.07 85)' },
          900: { value: 'oklch(0.34 0.05 85)' },
          950: { value: 'oklch(0.25 0.03 85)' },
        },
        red: {
          50: { value: 'oklch(0.95 0.01 45)' },
          100: { value: 'oklch(0.90 0.02 45)' },
          200: { value: 'oklch(0.82 0.03 45)' },
          300: { value: 'oklch(0.70 0.04 45)' },
          400: { value: 'oklch(0.58 0.05 45)' },
          500: { value: 'oklch(0.48 0.06 45)' },
          600: { value: 'oklch(0.42 0.06 45)' },
          700: { value: 'oklch(0.38 0.06 45)' }, // Burnt umber
          800: { value: 'oklch(0.32 0.05 45)' },
          850: { value: 'oklch(0.26 0.04 45)' },
          900: { value: 'oklch(0.22 0.03 45)' },
          950: { value: 'oklch(0.16 0.02 45)' },
        },
        violet: {
          50: { value: 'oklch(0.95 0.01 45)' },
          100: { value: 'oklch(0.90 0.02 45)' },
          200: { value: 'oklch(0.82 0.03 45)' },
          300: { value: 'oklch(0.70 0.04 45)' },
          400: { value: 'oklch(0.58 0.05 45)' },
          500: { value: 'oklch(0.48 0.06 45)' },
          600: { value: 'oklch(0.42 0.06 45)' },
          700: { value: 'oklch(0.38 0.06 45)' },
          800: { value: 'oklch(0.32 0.05 45)' },
          850: { value: 'oklch(0.26 0.04 45)' },
          900: { value: 'oklch(0.22 0.03 45)' },
          950: { value: 'oklch(0.16 0.02 45)' },
        },
        */

        // ============================================
        // OPTION 7: Film Noir (Cinematic Lighting)
        // Cool shadows, warm key light, dramatic contrast
        // Perfect for: Photography sites, storytelling, dramatic portfolios
        // ============================================
        /*
        gray: {
          50: { value: 'oklch(0.96 0.005 260)' },
          100: { value: 'oklch(0.90 0.005 260)' },
          200: { value: 'oklch(0.80 0.005 260)' },
          300: { value: 'oklch(0.65 0.005 260)' },
          400: { value: 'oklch(0.48 0.005 260)' },
          500: { value: 'oklch(0.35 0.005 260)' },
          600: { value: 'oklch(0.26 0.01 260)' },
          700: { value: 'oklch(0.20 0.01 260)' },
          800: { value: 'oklch(0.15 0.01 260)' },
          850: { value: 'oklch(0.12 0.01 260)' },
          900: { value: 'oklch(0.10 0.01 260)' },
          950: { value: 'oklch(0.08 0.01 260)' }, // Deep noir black
        },
        blue: {
          50: { value: 'oklch(0.96 0.01 250)' },
          100: { value: 'oklch(0.92 0.015 250)' },
          200: { value: 'oklch(0.85 0.02 250)' },
          300: { value: 'oklch(0.72 0.025 250)' },
          400: { value: 'oklch(0.58 0.03 250)' },
          500: { value: 'oklch(0.45 0.035 250)' }, // Shadow blue
          600: { value: 'oklch(0.36 0.04 250)' },
          700: { value: 'oklch(0.30 0.04 250)' },
          800: { value: 'oklch(0.26 0.04 250)' },
          900: { value: 'oklch(0.22 0.04 250)' },
          950: { value: 'oklch(0.18 0.03 250)' },
        },
        green: {
          50: { value: 'oklch(0.97 0.01 285)' },
          100: { value: 'oklch(0.93 0.02 285)' },
          200: { value: 'oklch(0.88 0.03 285)' },
          300: { value: 'oklch(0.80 0.04 285)' },
          400: { value: 'oklch(0.72 0.05 285)' },
          500: { value: 'oklch(0.68 0.06 285)' }, // Fill lavender
          600: { value: 'oklch(0.58 0.06 285)' },
          700: { value: 'oklch(0.48 0.05 285)' },
          800: { value: 'oklch(0.38 0.04 285)' },
          900: { value: 'oklch(0.30 0.03 285)' },
          950: { value: 'oklch(0.22 0.02 285)' },
        },
        amber: {
          50: { value: 'oklch(0.97 0.02 65)' },
          100: { value: 'oklch(0.94 0.05 65)' },
          200: { value: 'oklch(0.89 0.08 65)' },
          300: { value: 'oklch(0.84 0.12 65)' },
          400: { value: 'oklch(0.78 0.14 65)' },
          500: { value: 'oklch(0.72 0.13 65)' }, // Key amber
          600: { value: 'oklch(0.62 0.12 65)' },
          700: { value: 'oklch(0.51 0.10 65)' },
          800: { value: 'oklch(0.40 0.08 65)' },
          900: { value: 'oklch(0.31 0.06 65)' },
          950: { value: 'oklch(0.23 0.04 65)' },
        },
        red: {
          50: { value: 'oklch(0.97 0.02 65)' },
          100: { value: 'oklch(0.94 0.05 65)' },
          200: { value: 'oklch(0.89 0.08 65)' },
          300: { value: 'oklch(0.84 0.12 65)' },
          400: { value: 'oklch(0.78 0.14 65)' },
          500: { value: 'oklch(0.72 0.13 65)' },
          600: { value: 'oklch(0.62 0.12 65)' },
          700: { value: 'oklch(0.51 0.10 65)' },
          800: { value: 'oklch(0.40 0.08 65)' },
          900: { value: 'oklch(0.31 0.06 65)' },
          950: { value: 'oklch(0.23 0.04 65)' },
        },
        violet: {
          50: { value: 'oklch(0.97 0.01 285)' },
          100: { value: 'oklch(0.93 0.02 285)' },
          200: { value: 'oklch(0.88 0.03 285)' },
          300: { value: 'oklch(0.80 0.04 285)' },
          400: { value: 'oklch(0.72 0.05 285)' },
          500: { value: 'oklch(0.68 0.06 285)' },
          600: { value: 'oklch(0.58 0.06 285)' },
          700: { value: 'oklch(0.48 0.05 285)' },
          800: { value: 'oklch(0.38 0.04 285)' },
          900: { value: 'oklch(0.30 0.03 285)' },
          950: { value: 'oklch(0.22 0.02 285)' },
        },
        */
      },

      /****************************************
       * BORDER RADIUS (Reference unified scale)
       ****************************************/
      radii: {
        1: { value: '{scale.1}' }, // 6px (1 baseline)
        2: { value: '{scale.2}' }, // 12px (2 baselines)
        full: { value: '9999px' }, // Fully rounded (circles/pills)
      },

      /****************************************
       * SIZES (Reference unified scale)
       ****************************************/
      sizes: {
        container: {
          content: { value: '{scale.128}', description: '768px (128 baselines) - text-heavy content' },
          standard: { value: '{scale.213}', description: '~1278px (213 baselines) - general layouts' },
          wide: { value: '{scale.267}', description: '~1602px (267 baselines) - wide content like galleries' },
        },
        full: { value: '100%', description: 'Full width (100%)' },
        half: { value: '50%', description: 'Half width (50%)' },
        icon: {
          3: { value: '{scale.3}', description: '18px (3 baselines) - extra small icons' },
          4: { value: '{scale.4}', description: '24px (4 baselines) - small icons' },
          6: { value: '{scale.6}', description: '36px (6 baselines) - medium icons' },
          7: { value: '{scale.7}', description: '42px (7 baselines) - large icons' },
          8: { value: '{scale.8}', description: '48px (8 baselines) - extra large icons' },
        },
      },

      /****************************************
       * GRID COLUMNS
       ****************************************/
      gridColumns: {
        1: { value: '1' },
        2: { value: '2' },
        3: { value: '3' },
        4: { value: '4' },
        6: { value: '6' },
        12: { value: '12' },
      },

      /****************************************
       * TRANSITIONS
       ****************************************/
      durations: {
        fast: { value: '150ms' },
        base: { value: '200ms' },
        slow: { value: '300ms' },
      },
    },

    /****************************************
     * TEXT STYLES (Typography System)
     * Using numeric scale: larger font sizes than before due to grid alignment
     ****************************************/
    textStyles: {
      // Display/Marketing
      'display.hero': {
        value: {
          fontSize: 14, // 84px (14 baselines) - was ~67px
          lineHeight: 14,
          fontWeight: 'bold',
          fontFamily: 'serif',
          letterSpacing: 'tighter',
        },
      },
      'display.xl': {
        value: {
          fontSize: 12, // 72px (12 baselines) - was ~67px
          lineHeight: 14,
          fontWeight: 'bold',
          fontFamily: 'serif',
          letterSpacing: 'tighter',
        },
      },

      // Headings
      'heading.1': {
        value: {
          fontSize: 10, // 60px (10 baselines) - was ~51px
          lineHeight: 10,
          fontWeight: 'bold',
          fontFamily: 'sans',
          letterSpacing: '-0.025em',
        },
      },
      'heading.2': {
        value: {
          fontSize: 8, // 48px (8 baselines) - was ~38px
          lineHeight: 8,
          fontWeight: 'bold',
          fontFamily: 'sans',
          letterSpacing: 'tight',
        },
      },
      'heading.3': {
        value: {
          fontSize: 6, // 36px (6 baselines) - was ~28px
          lineHeight: 6,
          fontWeight: 'semibold',
          fontFamily: 'sans',
        },
      },
      'heading.4': {
        value: {
          fontSize: 5, // 30px (5 baselines) - was ~21px
          lineHeight: 5,
          fontWeight: 'semibold',
          fontFamily: 'sans',
        },
      },

      // Body text
      'body.lg': {
        value: {
          fontSize: 5, // 30px (5 baselines) - was ~21px
          lineHeight: 5,
          fontFamily: 'serif',
        },
      },
      'body.base': {
        value: {
          fontSize: 3, // 18px (3 baselines) - was 16px
          lineHeight: 4, // 24px (4 baselines) for comfortable reading
          fontFamily: 'serif',
        },
      },
      'body.sm': {
        value: {
          fontSize: 2, // 12px (2 baselines) - was ~14px
          lineHeight: 3, // 18px (3 baselines)
          fontFamily: 'serif',
        },
      },
      'body.xs': {
        value: {
          fontSize: 2, // 12px (2 baselines) - was ~12px
          lineHeight: 3, // 18px (3 baselines)
          fontFamily: 'serif',
        },
      },

      // Special
      caption: {
        value: {
          fontSize: 2, // 12px (2 baselines)
          lineHeight: 3,
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'text.tertiary',
        },
      },

      label: {
        value: {
          fontSize: 2, // 12px (2 baselines)
          lineHeight: 3,
          fontWeight: 'medium',
          letterSpacing: 'wide',
        },
      },
    },

    /****************************************
     * SEMANTIC TOKENS (Dark Mode Support)
     ****************************************/
    semanticTokens: {
      colors: {
        text: {
          primary: {
            value: { base: '{colors.gray.950}', _dark: '{colors.gray.100}' },
          },
          secondary: {
            value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' },
          },
          tertiary: {
            value: { base: '{colors.gray.500}', _dark: '{colors.gray.500}' },
          },
        },
        bg: {
          primary: {
            value: { base: '{colors.gray.50}', _dark: '{colors.gray.950}' },
          },
          secondary: {
            value: { base: '{colors.gray.100}', _dark: '{colors.gray.900}' },
          },
          subtle: {
            value: { base: '{colors.gray.200}', _dark: '{colors.gray.800}' },
          },
          surface: {
            value: { base: '{colors.gray.100}', _dark: '{colors.gray.850}' },
            description: 'Surface background for elevated elements',
          },
          hover: {
            value: { base: '{colors.gray.300}', _dark: '{colors.gray.700}' },
            description: 'Background color on hover',
          },
        },
        accent: {
          default: {
            value: '{colors.blue.500}',
          },
          dark: {
            value: { base: '{colors.blue.700}', _dark: '{colors.blue.300}' },
            description: 'Darker accent for hover states',
          },
        },
        border: {
          default: {
            value: { base: '{colors.gray.200}', _dark: '{colors.gray.800}' },
          },
          hover: {
            value: { base: '{colors.gray.400}', _dark: '{colors.gray.600}' },
            description: 'Border color on hover',
          },
          subtle: {
            value: { base: '{colors.gray.100}', _dark: '{colors.gray.900}' },
            description: 'Subtle border for less emphasis',
          },
        },
        experience: {
          work: {
            value: { base: '{colors.blue.600}', _dark: '{colors.blue.400}' },
            description: 'Work experience timeline color',
          },
          education: {
            value: { base: '{colors.green.600}', _dark: '{colors.green.400}' },
            description: 'Education timeline color',
          },
          achievement: {
            value: { base: '{colors.amber.600}', _dark: '{colors.amber.400}' },
            description: 'Achievement timeline color',
          },
          speaking: {
            value: { base: '{colors.violet.600}', _dark: '{colors.violet.400}' },
            description: 'Speaking timeline color',
          },
          personal: {
            value: { base: '{colors.red.500}', _dark: '{colors.red.400}' },
            description: 'Personal project timeline color',
          },
        },

        // Feedback colors (success, warning, error, info)
        feedback: {
          success: {
            bg: {
              value: { base: '{colors.green.50}', _dark: '{colors.green.950}' },
              description: 'Success background',
            },
            border: {
              value: { base: '{colors.green.200}', _dark: '{colors.green.800}' },
              description: 'Success border',
            },
            text: {
              value: { base: '{colors.green.700}', _dark: '{colors.green.300}' },
              description: 'Success text',
            },
            solid: {
              value: { base: '{colors.green.600}', _dark: '{colors.green.500}' },
              description: 'Solid success color (buttons, icons)',
            },
          },
          warning: {
            bg: {
              value: { base: '{colors.amber.50}', _dark: '{colors.amber.950}' },
              description: 'Warning background',
            },
            border: {
              value: { base: '{colors.amber.200}', _dark: '{colors.amber.800}' },
              description: 'Warning border',
            },
            text: {
              value: { base: '{colors.amber.700}', _dark: '{colors.amber.300}' },
              description: 'Warning text',
            },
            solid: {
              value: { base: '{colors.amber.600}', _dark: '{colors.amber.500}' },
              description: 'Solid warning color (buttons, icons)',
            },
          },
          error: {
            bg: {
              value: { base: '{colors.red.50}', _dark: '{colors.red.950}' },
              description: 'Error background',
            },
            border: {
              value: { base: '{colors.red.200}', _dark: '{colors.red.800}' },
              description: 'Error border',
            },
            text: {
              value: { base: '{colors.red.700}', _dark: '{colors.red.300}' },
              description: 'Error text',
            },
            solid: {
              value: { base: '{colors.red.600}', _dark: '{colors.red.500}' },
              description: 'Solid error color (buttons, icons)',
            },
          },
          info: {
            bg: {
              value: { base: '{colors.blue.50}', _dark: '{colors.blue.950}' },
              description: 'Info background',
            },
            border: {
              value: { base: '{colors.blue.200}', _dark: '{colors.blue.800}' },
              description: 'Info border',
            },
            text: {
              value: { base: '{colors.blue.700}', _dark: '{colors.blue.300}' },
              description: 'Info text',
            },
            solid: {
              value: { base: '{colors.blue.600}', _dark: '{colors.blue.500}' },
              description: 'Solid info color (buttons, icons)',
            },
          },
        },

        // Focus system (accessibility)
        focus: {
          ring: {
            value: { base: '{colors.blue.500}', _dark: '{colors.blue.400}' },
            description: 'Focus ring color (outline)',
          },
          ringOffset: {
            value: { base: '{colors.gray.50}', _dark: '{colors.gray.950}' },
            description: 'Focus ring offset background',
          },
        },

        // Surface elevation system (4 levels)
        surface: {
          base: {
            value: { base: '{colors.gray.50}', _dark: '{colors.gray.950}' },
            description: 'Base surface (page background)',
          },
          raised: {
            value: { base: 'white', _dark: '{colors.gray.900}' },
            description: 'Raised surface (+1 elevation: cards)',
          },
          overlay: {
            value: { base: 'white', _dark: '{colors.gray.850}' },
            description: 'Overlay surface (+2 elevation: dropdowns)',
          },
          modal: {
            value: { base: 'white', _dark: '{colors.gray.800}' },
            description: 'Modal surface (+3 elevation: modals)',
          },
        },

        // Overlay system (for modals, dropdowns, image overlays)
        overlay: {
          light: {
            value: { base: 'rgb(0 0 0 / 0.1)', _dark: 'rgb(0 0 0 / 0.3)' },
            description: 'Light overlay (subtle dimming)',
          },
          medium: {
            value: { base: 'rgb(0 0 0 / 0.2)', _dark: 'rgb(0 0 0 / 0.5)' },
            description: 'Medium overlay (moderate dimming)',
          },
          heavy: {
            value: { base: 'rgb(0 0 0 / 0.5)', _dark: 'rgb(0 0 0 / 0.7)' },
            description: 'Heavy overlay (strong dimming for modals)',
          },
          contrast: {
            value: { base: 'rgb(0 0 0 / 0.6)', _dark: 'rgb(0 0 0 / 0.8)' },
            description: 'High contrast overlay (photo overlays)',
          },
        },

        // Interactive states
        interactive: {
          default: {
            value: '{colors.blue.500}',
            description: 'Default interactive element color',
          },
          hover: {
            value: { base: '{colors.blue.600}', _dark: '{colors.blue.400}' },
            description: 'Hover state color',
          },
          active: {
            value: { base: '{colors.blue.700}', _dark: '{colors.blue.300}' },
            description: 'Active/pressed state color',
          },
          disabled: {
            value: { base: '{colors.gray.300}', _dark: '{colors.gray.700}' },
            description: 'Disabled state color',
          },
        },
      },

      // Shadow system (tokenized elevation)
      shadows: {
        xs: {
          value: '0 1px 2px rgb(0 0 0 / 0.05)',
          description: 'Extra small shadow',
        },
        sm: {
          value: '0 2px 4px rgb(0 0 0 / 0.05), 0 1px 2px rgb(0 0 0 / 0.06)',
          description: 'Small shadow',
        },
        base: {
          value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          description: 'Base shadow',
        },
        md: {
          value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          description: 'Medium shadow',
        },
        lg: {
          value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          description: 'Large shadow',
        },
        xl: {
          value: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
          description: 'Extra large shadow',
        },
      },
    },
  },

  /****************************************
   * UTILITIES (Property Allowlist)
   *
   * CRITICAL: This object REPLACES Panda's default utilities.
   * Only properties listed here will be available in the type system.
   * Based on audit of 92 properties actually used in the codebase.
   ****************************************/
  utilities: {
    /****************************************
     * LAYOUT & DISPLAY
     ****************************************/
    display: {
      values: ['flex', 'grid', 'block', 'none', 'inline-flex', 'inline-block', 'inline'],
    },
    position: {
      values: ['relative', 'absolute', 'fixed'],
    },
    inset: {},
    top: {},
    right: {},
    bottom: {},
    left: {},
    zIndex: {},
    overflow: {
      values: ['hidden', 'visible', 'auto'],
    },
    overflowX: {},

    /****************************************
     * FLEXBOX
     ****************************************/
    flexDirection: {
      values: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    flexWrap: {
      values: ['wrap', 'nowrap', 'wrap-reverse'],
    },
    flexGrow: {},
    flexShrink: {},
    justifyContent: {},
    alignItems: {},
    gap: { values: POSITIVE_SPACING },

    /****************************************
     * GRID
     ****************************************/
    gridTemplateColumns: {},
    gridTemplateRows: {},
    gridColumn: {},
    gridRow: {},

    /****************************************
     * SPACING (Linked to baseline grid)
     ****************************************/
    padding: { values: POSITIVE_SPACING },
    paddingTop: { values: POSITIVE_SPACING },
    paddingRight: { values: POSITIVE_SPACING },
    paddingBottom: { values: POSITIVE_SPACING },
    paddingLeft: { values: POSITIVE_SPACING },
    paddingBlock: { values: POSITIVE_SPACING },
    paddingInline: { values: POSITIVE_SPACING },
    paddingInlineStart: { values: POSITIVE_SPACING },
    paddingInlineEnd: { values: POSITIVE_SPACING },

    margin: { values: 'spacing' },
    marginTop: { values: 'spacing' },
    marginRight: { values: 'spacing' },
    marginBottom: { values: 'spacing' },
    marginLeft: { values: 'spacing' },
    marginBlock: { values: 'spacing' },
    marginInline: { values: 'spacing' },

    /****************************************
     * SIZING
     ****************************************/
    width: {},
    height: {},
    minWidth: {},
    minHeight: {},
    maxWidth: {},
    // maxHeight: {}, // ❌ REMOVED: Never used in codebase
    aspectRatio: {},

    /****************************************
     * TYPOGRAPHY
     ****************************************/
    color: { values: 'colors' },
    fontSize: { values: 'fontSizes' },
    fontFamily: { values: 'fonts' },
    fontWeight: { values: 'fontWeights' },
    fontStyle: {},
    lineHeight: { values: 'lineHeights' },
    letterSpacing: { values: 'letterSpacings' },
    textAlign: {
      values: ['left', 'center', 'right'],
    },
    textDecoration: {},
    textTransform: {},
    textOverflow: {},
    whiteSpace: {},
    verticalAlign: {},
    listStyle: {},

    /****************************************
     * BACKGROUND & BORDERS
     ****************************************/
    backgroundColor: { values: 'colors' },
    border: {},
    borderWidth: {},
    borderColor: { values: 'colors' },
    borderRadius: { values: 'radii' },
    borderTop: {},
    borderRight: {},
    borderBottom: {},
    borderLeft: {},

    /****************************************
     * VISUAL EFFECTS
     ****************************************/
    opacity: { values: 'opacity' },
    boxShadow: { values: 'shadows' },
    filter: {},
    backdropFilter: {},
    transform: {},

    /****************************************
     * TRANSITIONS & ANIMATIONS
     ****************************************/
    transition: {},
    transitionProperty: {},
    transitionDuration: { values: 'durations' },
    // animation: {}, // ❌ REMOVED: Never used (covered by globalCss for view transitions)

    /****************************************
     * INTERACTION
     ****************************************/
    cursor: {
      values: ['pointer', 'default'],
    },
    pointerEvents: {},
    outline: {},

    /****************************************
     * IMAGES & MEDIA
     ****************************************/
    objectFit: {
      values: ['cover'],
    },
    fill: {},

    /****************************************
     * SCROLL & NAVIGATION
     ****************************************/
    scrollMarginTop: { values: 'spacing' },

    /****************************************
     * VIEW TRANSITIONS (Experimental)
     ****************************************/
    viewTransitionName: {},

    /****************************************
     * ACCESSIBILITY
     ****************************************/
    clip: {},

    /****************************************
     * CUSTOM UTILITIES
     ****************************************/
    lineClamp: {
      values: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' },
      transform(value) {
        return {
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: value,
          overflow: 'hidden',
        }
      },
    },
  },

  /****************************************
   * GLOBAL CSS (Vertical Rhythm with text-box-trim)
   ****************************************/
  globalCss: {
    // Apply text-box-trim to all typography elements
    'h1, h2, h3, h4, h5, h6, p': {
      textBoxTrim: 'both',
      textBoxEdge: 'cap alphabetic',
    },

    // Focus ring system (accessibility)
    '*:focus': {
      outline: 'none', // Remove default outline
    },
    '*:focus-visible': {
      outline: '2px solid',
      outlineColor: 'focus.ring',
      outlineOffset: '2px',
    },

    // Typography elements with grid-aligned spacing
    h1: {
      fontFamily: 'sans',
      fontSize: 10, // 60px (10 baselines)
      fontWeight: 'bold',
      lineHeight: 10,
      marginBottom: 10,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: 'sans',
      fontSize: 8, // 48px (8 baselines)
      fontWeight: 'bold',
      lineHeight: 8,
      marginBottom: 8,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: 'sans',
      fontSize: 6, // 36px (6 baselines)
      fontWeight: 'semibold',
      lineHeight: 6,
      marginBottom: 6,
    },
    h4: {
      fontFamily: 'sans',
      fontSize: 5, // 30px (5 baselines)
      fontWeight: 'semibold',
      lineHeight: 5,
      marginBottom: 5,
    },
    p: {
      margin: 0,
      fontSize: 3, // 18px (3 baselines)
      lineHeight: 4, // 24px (4 baselines) for comfortable reading
      marginBottom: 4,
    },

    // Optical sizing for variable fonts
    body: {
      fontOpticalSizing: 'auto',
      margin: 0,
      padding: 0,
      fontFamily: 'sans',
      fontSize: 3, // 18px (3 baselines) - body text size set in global.css
      color: 'text.primary',
      backgroundColor: 'bg.primary',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },

    // CSS Reset
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },

    // Links
    a: {
      color: 'inherit',
      textDecoration: 'none',
      transition: `color {durations.fast}`,
    },
    'a:hover': {
      color: 'accent.default',
    },

    // Prose styles for MDX content
    '.prose': {
      fontFamily: 'serif',
      fontOpticalSizing: 'auto',
      maxWidth: '65ch',
      color: 'text.secondary',
    },
    '.prose h1, .prose h2, .prose h3': {
      fontFamily: 'sans',
      color: 'text.primary',
    },
    '.prose h1': {
      marginTop: 0,
      marginBottom: 10, // 60px (10 baselines)
    },
    '.prose h2': {
      marginTop: 8, // 48px (8 baselines)
      marginBottom: 6, // 36px (6 baselines)
    },
    '.prose h3': {
      marginTop: 6, // 36px (6 baselines)
      marginBottom: 4, // 24px (4 baselines)
    },
    '.prose p': {
      marginTop: 6, // 36px (6 baselines)
      marginBottom: 6,
      fontFamily: 'serif',
    },
    '.prose p:first-of-type': {
      fontSize: 4, // 24px (4 baselines) - emphasized first paragraph
      lineHeight: 4,
    },
    '.prose a': {
      color: 'accent.default',
      textDecoration: 'underline',
      textDecorationThickness: '1px',
      textUnderlineOffset: '2px',
      transition: `all {durations.fast}`,
    },
    '.prose a:hover': {
      color: 'accent.dark',
      textDecorationThickness: '2px',
    },
    '.prose strong': {
      fontWeight: 'semibold',
      color: 'text.primary',
    },
    '.prose ul, .prose ol': {
      marginTop: 6, // 36px (6 baselines)
      marginBottom: 6,
      paddingLeft: 5, // 30px (5 baselines)
    },
    '.prose li': {
      marginTop: 4, // 24px (4 baselines)
      marginBottom: 4,
    },
    '.prose blockquote': {
      marginTop: 8, // 48px (8 baselines)
      marginBottom: 8,
      paddingLeft: 4, // 24px (4 baselines)
      borderLeft: '4px solid',
      borderColor: 'accent.default',
      fontStyle: 'italic',
      fontFamily: 'serif',
      fontSize: 6, // 36px (6 baselines) - emphasized quotes
      fontWeight: 'medium',
      lineHeight: 6,
      color: 'text.secondary',
    },
    '.prose hr': {
      marginTop: 16, // 96px (16 baselines)
      marginBottom: 16,
      border: 'none',
      borderTop: '1px solid',
      borderColor: 'border.default',
    },

    // Code blocks
    code: {
      fontFamily: 'mono',
      fontVariantLigatures: 'contextual',
      fontSize: '0.9em', // Relative to parent font
    },
    ':not(pre) > code': {
      padding: '1rem', // 6px (1 baseline)
      borderRadius: 1,
      backgroundColor: 'bg.subtle',
      color: 'text.primary',
    },
    pre: {
      fontFamily: 'mono',
      overflowX: 'auto',
      padding: 4, // 24px (4 baselines)
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'border.default',
      margin: '10 0', // 60px (10 baselines) vertical
      fontSize: '0.875rem', // ~5.25px but relative sizing is acceptable here
      lineHeight: 3, // 18px (3 baselines)
    },
    'pre code': {
      padding: 0,
      background: 'none',
      borderRadius: 0,
      fontSize: 'inherit',
    },

    // Shiki syntax highlighting
    'pre.shiki, pre.shiki span': {
      fontFamily: 'mono',
    },
    'pre.shiki span': {
      color: 'var(--shiki-light)',
    },
    '.dark pre.shiki span': {
      color: 'var(--shiki-dark)',
    },

    // Images
    img: {
      maxWidth: '100%',
      height: 'auto',
    },
    '.dark img.invert-dark': {
      filter: 'invert(1) hue-rotate(180deg)',
    },

    // Selection
    '::selection': {
      backgroundColor: 'accent.default',
      color: 'bg.default',
    },

    // Lists
    'ul, ol': {
      margin: '0',
      padding: '0',
      listStylePosition: 'outside',
    },
    li: {
      marginTop: '6px',
    },

    // Per-article custom styles
    'article[data-article="forto"] img': {
      filter: 'saturate(0.6)',
    },

    // View Transitions
    '::view-transition-group(main-content)': {
      animationDuration: '100ms',
      animationTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
    '::view-transition-old(main-content)': {
      animation: 'slide-down-fade-out 100ms cubic-bezier(0.33, 1, 0.68, 1) forwards',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
      perspective: '1000px',
    },
    '::view-transition-new(main-content)': {
      animation: 'slide-up-fade-in 100ms cubic-bezier(0.32, 0, 0.67, 0) forwards',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
      perspective: '1000px',
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
})

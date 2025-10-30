import { defineConfig } from '@pandacss/dev'

/****************************************
 * MODULAR SCALE CONSTANTS
 * Perfect Fourth (1.333) - Same as Material Design
 ****************************************/
const BASE_FONT_SIZE = '1rem' // 16px
const SCALE_RATIO = 1.333 // Perfect Fourth

export default defineConfig({
  // CSS reset
  preflight: true,

  // Where to look for CSS declarations
  include: ['./app/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  jsxFramework: 'react',

  theme: {
    tokens: {
      /****************************************
       * FONT SIZES (Mathematically Derived)
       ****************************************/
      fontSizes: {
        // Smaller sizes (divided by scale)
        xs: {
          value: `calc(${BASE_FONT_SIZE} / ${SCALE_RATIO})`,
          description: '~12px - Small text, captions',
        },
        sm: {
          value: 'calc({fontSizes.xs} * 1.167)',
          description: '~14px - Secondary text',
        },

        // Core sizes (multiplied by scale)
        base: {
          value: BASE_FONT_SIZE,
          description: '16px - Body text (Newsreader for reading)',
        },
        md: {
          value: 'calc({fontSizes.base} * 1.125)',
          description: '18px - Emphasized body text',
        },
        lg: {
          value: `calc({fontSizes.base} * ${SCALE_RATIO})`,
          description: '~21px - H4 headings',
        },
        xl: {
          value: `calc({fontSizes.lg} * ${SCALE_RATIO})`,
          description: '~28px - H3 headings',
        },
        '2xl': {
          value: `calc({fontSizes.xl} * ${SCALE_RATIO})`,
          description: '~38px - H2 headings',
        },
        '3xl': {
          value: `calc({fontSizes.2xl} * ${SCALE_RATIO})`,
          description: '~51px - H1 headings',
        },
        '4xl': {
          value: `calc({fontSizes.3xl} * ${SCALE_RATIO})`,
          description: '~67px - Display text',
        },
      },

      /****************************************
       * LINE HEIGHTS (Baseline Multiples)
       ****************************************/
      lineHeights: {
        xs: { value: 'calc(3 * {spacing.baseline})' }, // 18px (3 baselines)
        sm: { value: 'calc(3 * {spacing.baseline})' }, // 18px (3 baselines)
        base: { value: 'calc(4 * {spacing.baseline})' }, // 24px (4 baselines)
        md: { value: 'calc(4 * {spacing.baseline})' }, // 24px (4 baselines)
        lg: { value: 'calc(5 * {spacing.baseline})' }, // 30px (5 baselines)
        xl: { value: 'calc(6 * {spacing.baseline})' }, // 36px (6 baselines)
        '2xl': { value: 'calc(8 * {spacing.baseline})' }, // 48px (8 baselines)
        '3xl': { value: 'calc(10 * {spacing.baseline})' }, // 60px (10 baselines)
        '4xl': { value: 'calc(14 * {spacing.baseline})' }, // 84px (14 baselines)
      },

      /****************************************
       * SPACING SCALE (Baseline Multiples)
       ****************************************/
      spacing: {
        baseline: {
          value: '0.375rem',
          description: '6px baseline unit - fundamental vertical rhythm increment',
        },
        0: { value: '0' },
        0.5: { value: 'calc(0.5 * {spacing.baseline})' }, // 3px (0.1875rem)
        1: { value: '{spacing.baseline}' }, // 6px
        1.5: { value: 'calc(1.5 * {spacing.baseline})' }, // 9px (0.5625rem)
        2: { value: 'calc(2 * {spacing.baseline})' }, // 12px
        3: { value: 'calc(3 * {spacing.baseline})' }, // 18px
        4: { value: 'calc(4 * {spacing.baseline})' }, // 24px
        5: { value: 'calc(5 * {spacing.baseline})' }, // 30px
        6: { value: 'calc(6 * {spacing.baseline})' }, // 36px
        8: { value: 'calc(8 * {spacing.baseline})' }, // 48px
        10: { value: 'calc(10 * {spacing.baseline})' }, // 60px
        12: { value: 'calc(12 * {spacing.baseline})' }, // 72px
        16: { value: 'calc(16 * {spacing.baseline})' }, // 96px
        20: { value: 'calc(20 * {spacing.baseline})' }, // 120px
        24: { value: 'calc(24 * {spacing.baseline})' }, // 144px
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
        20: { value: '0.2' },
        40: { value: '0.4' },
        60: { value: '0.6' },
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
      },

      /****************************************
       * BORDER RADIUS
       ****************************************/
      radii: {
        sm: { value: '0.125rem' }, // 2px
        base: { value: '0.25rem' }, // 4px
        md: { value: '0.375rem' }, // 6px
        lg: { value: '0.5rem' }, // 8px
        xl: { value: '0.75rem' }, // 12px
        full: { value: '9999px' }, // Fully rounded
      },

      /****************************************
       * CONTAINER MAX WIDTHS
       ****************************************/
      sizes: {
        container: {
          content: { value: '48rem', description: '768px - for text-heavy content' },
          standard: { value: '80rem', description: '1280px - for general layouts' },
          wide: { value: '100rem', description: '1600px - for wide content like galleries' },
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
     ****************************************/
    textStyles: {
      // Display/Marketing
      'display.hero': {
        value: {
          fontSize: '4xl',
          lineHeight: '4xl',
          fontWeight: 'bold',
          fontFamily: 'serif',
          letterSpacing: 'tighter',
        },
      },
      'display.xl': {
        value: {
          fontSize: '4xl',
          lineHeight: '4xl',
          fontWeight: 'bold',
          fontFamily: 'serif',
          letterSpacing: 'tighter',
        },
      },

      // Headings
      'heading.1': {
        value: {
          fontSize: '3xl',
          lineHeight: '3xl',
          fontWeight: 'bold',
          fontFamily: 'sans',
          letterSpacing: '-0.025em',
        },
      },
      'heading.2': {
        value: {
          fontSize: '2xl',
          lineHeight: '2xl',
          fontWeight: 'bold',
          fontFamily: 'sans',
          letterSpacing: 'tight',
        },
      },
      'heading.3': {
        value: {
          fontSize: 'xl',
          lineHeight: 'xl',
          fontWeight: 'semibold',
          fontFamily: 'sans',
        },
      },
      'heading.4': {
        value: {
          fontSize: 'lg',
          lineHeight: 'lg',
          fontWeight: 'semibold',
          fontFamily: 'sans',
        },
      },

      // Body text
      'body.lg': {
        value: {
          fontSize: 'lg',
          lineHeight: 'lg',
          fontFamily: 'serif',
        },
      },
      'body.base': {
        value: {
          fontSize: 'base',
          lineHeight: 'base',
          fontFamily: 'serif',
        },
      },
      'body.sm': {
        value: {
          fontSize: 'sm',
          lineHeight: 'sm',
          fontFamily: 'serif',
        },
      },
      'body.xs': {
        value: {
          fontSize: 'xs',
          lineHeight: 'xs',
          fontFamily: 'serif',
        },
      },

      // Special
      caption: {
        value: {
          fontSize: 'sm',
          lineHeight: 'sm',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'text.tertiary',
        },
      },

      label: {
        value: {
          fontSize: 'xs',
          lineHeight: 'xs',
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
   * UTILITIES (Custom Utility Definitions)
   ****************************************/
  utilities: {
    extend: {
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

    // Typography elements with simple baseline spacing
    h1: {
      fontFamily: 'sans',
      fontSize: '3xl',
      fontWeight: 'bold',
      lineHeight: '3xl', // 60px (10 baselines)
      marginBottom: '10',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: 'sans',
      fontSize: '2xl',
      fontWeight: 'bold',
      lineHeight: '2xl', // 48px (8 baselines)
      marginBottom: '8',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: 'sans',
      fontSize: 'xl',
      fontWeight: 'semibold',
      lineHeight: 'xl', // 36px (6 baselines)
      marginBottom: '6',
    },
    h4: {
      fontFamily: 'sans',
      fontSize: 'lg',
      fontWeight: 'semibold',
      lineHeight: 'lg', // 30px (5 baselines)
      marginBottom: '5',
    },
    p: {
      margin: '0',
      fontSize: 'base',
      lineHeight: 'base', // 24px (4 baselines)
      marginBottom: '4',
    },

    // Optical sizing for variable fonts
    body: {
      fontOpticalSizing: 'auto',
      margin: '0',
      padding: '0',
      fontFamily: 'sans',
      fontSize: 'base',
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
      marginTop: '0',
      marginBottom: '60px',
    },
    '.prose h2': {
      marginTop: '48px',
      marginBottom: '36px',
    },
    '.prose h3': {
      marginTop: '36px',
      marginBottom: '24px',
    },
    '.prose p': {
      marginTop: '36px',
      marginBottom: '36px',
      fontFamily: 'serif',
    },
    '.prose p:first-of-type': {
      fontSize: 'md',
      lineHeight: 'base',
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
      marginTop: '36px',
      marginBottom: '36px',
      paddingLeft: '30px',
    },
    '.prose li': {
      marginTop: '24px',
      marginBottom: '24px',
    },
    '.prose blockquote': {
      marginTop: '48px',
      marginBottom: '48px',
      paddingLeft: '24px',
      borderLeft: '4px solid',
      borderColor: 'accent.default',
      fontStyle: 'italic',
      fontFamily: 'serif',
      fontSize: 'xl',
      fontWeight: 'medium',
      lineHeight: 'xl',
      color: 'text.secondary',
    },
    '.prose hr': {
      marginTop: '96px',
      marginBottom: '96px',
      border: 'none',
      borderTop: '1px solid',
      borderColor: 'border.default',
    },

    // Code blocks
    code: {
      fontFamily: 'mono',
      fontVariantLigatures: 'contextual',
      fontSize: '0.9em',
    },
    ':not(pre) > code': {
      padding: '0.125rem 0.25rem',
      borderRadius: 'sm',
      backgroundColor: 'bg.subtle',
      color: 'text.primary',
    },
    pre: {
      fontFamily: 'mono',
      overflowX: 'auto',
      padding: '24px',
      borderRadius: 'base',
      border: '1px solid',
      borderColor: 'border.default',
      margin: '60px 0',
      fontSize: '0.875rem',
      lineHeight: 'sm',
    },
    'pre code': {
      padding: '0',
      background: 'none',
      borderRadius: '0',
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

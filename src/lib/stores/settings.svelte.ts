/**
 * Settings Store - Conference-Quality Svelte 5 Pattern
 *
 * Features:
 * - Class-based store (Svelte 5 recommended pattern)
 * - Effect Schema runtime validation
 * - Svelte 5 runes ($state, $derived, $effect)
 * - Automatic localStorage persistence
 * - Type-safe throughout
 */

import * as S from 'effect/Schema'

// ============================================================================
// Schemas - Define valid values with runtime validation
// ============================================================================

export const ThemeMode = S.Literal('light', 'dark', 'system')
export type ThemeMode = S.Schema.Type<typeof ThemeMode>

export const CodeThemeLight = S.Literal(
  'vitesse-light',
  'github-light',
  'catppuccin-latte',
  'rose-pine-dawn',
  'min-light',
)
export type CodeThemeLight = S.Schema.Type<typeof CodeThemeLight>

export const CodeThemeDark = S.Literal(
  'tokyo-night',
  'github-dark',
  'dracula',
  'nord',
  'catppuccin-mocha',
)
export type CodeThemeDark = S.Schema.Type<typeof CodeThemeDark>

const SettingsSchema = S.Struct({
  theme: ThemeMode,
  codeThemeLight: CodeThemeLight,
  codeThemeDark: CodeThemeDark,
})
export type Settings = S.Schema.Type<typeof SettingsSchema>

// ============================================================================
// Settings Store Class - Svelte 5 Pattern
// ============================================================================

class SettingsStore {
  // State (reactive)
  theme = $state<ThemeMode>('system')
  codeThemeLight = $state<CodeThemeLight>('vitesse-light')
  codeThemeDark = $state<CodeThemeDark>('tokyo-night')

  // Derived state (computed)
  effectiveTheme = $derived.by(() => {
    // Include systemThemeChanged to make it a dependency
    void this.#systemThemeChanged

    if (this.theme === 'system') {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ?
        'dark' :
        'light'
    }
    return this.theme
  })

  // Internal state
  #isHydrated = $state(false)
  #effectsInitialized = false
  #systemThemeChanged = $state(0) // Counter to force reactivity

  /**
   * Initialize effects - MUST be called from a component context
   * This is called from +layout.svelte during component initialization
   */
  initializeEffects() {
    if (this.#effectsInitialized) return
    this.#effectsInitialized = true

    // Effect 1: Load from localStorage on mount
    $effect(() => {
      if (typeof localStorage === 'undefined') return

      const stored = localStorage.getItem('settings')
      if (!stored) {
        this.#isHydrated = true
        return
      }

      try {
        const parsed = JSON.parse(stored)
        const decoded = S.decodeUnknownSync(SettingsSchema)(parsed)

        this.theme = decoded.theme
        this.codeThemeLight = decoded.codeThemeLight
        this.codeThemeDark = decoded.codeThemeDark
      } catch (error) {
        console.warn('Failed to parse settings from localStorage', error)
      } finally {
        this.#isHydrated = true
      }
    })

    // Effect 2: Save to localStorage when settings change (after hydration)
    $effect(() => {
      if (!this.#isHydrated) return
      if (typeof localStorage === 'undefined') return

      const settings: Settings = {
        theme: this.theme,
        codeThemeLight: this.codeThemeLight,
        codeThemeDark: this.codeThemeDark,
      }

      localStorage.setItem('settings', JSON.stringify(settings))
    })

    // Effect 3: Apply theme to DOM
    $effect(() => {
      if (typeof document === 'undefined') return

      const classes = document.documentElement.classList
      classes.remove('light', 'dark', 'system')

      if (this.theme === 'system') {
        classes.add('system')
        classes.add(this.effectiveTheme)
      } else {
        classes.add(this.theme)
      }
    })

    // Effect 4: Listen for system theme changes
    $effect(() => {
      if (typeof window === 'undefined') return
      if (this.theme !== 'system') return

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => {
        // Increment counter to trigger re-computation of effectiveTheme
        this.#systemThemeChanged++
      }

      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    })
  }

  // Methods
  setTheme(theme: ThemeMode) {
    this.theme = theme
  }

  setCodeThemeLight(theme: CodeThemeLight) {
    this.codeThemeLight = theme
  }

  setCodeThemeDark(theme: CodeThemeDark) {
    this.codeThemeDark = theme
  }
}

// Export singleton instance
export const settings = new SettingsStore()

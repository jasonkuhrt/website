import * as S from 'effect/Schema'
import { useEffect, useState } from 'react'
import { useLocalStorage } from '#~/hooks/useLocalStorage'

// ============================================================================
// Schemas - Define valid values with runtime validation
// ============================================================================

export const ThemeMode = S.Literal('light', 'dark', 'system')
export type ThemeMode = typeof ThemeMode.Type

/**
 * Effective theme after resolving 'system' to actual light/dark
 */
export type EffectiveTheme = Exclude<ThemeMode, 'system'>

export const GridOverlay = S.Literal('off', 'on')
export type GridOverlay = typeof GridOverlay.Type

const SettingsSchema = S.Struct({
  theme: ThemeMode,
  gridOverlay: GridOverlay,
})
export type Settings = typeof SettingsSchema.Type

// ============================================================================
// Default Settings
// ============================================================================

const defaultSettings: Settings = {
  theme: 'system',
  gridOverlay: 'on',
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Compute effective theme based on system preference
 */
const getEffectiveTheme = (theme: ThemeMode): EffectiveTheme => {
  if (theme === 'system') {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ?
      'dark' :
      'light'
  }
  return theme
}

// ============================================================================
// Settings Hook
// ============================================================================

export const useSettings = () => {
  const { value: settings, setValue, isHydrated } = useLocalStorage({
    key: 'settings',
    schema: SettingsSchema,
    defaultValue: defaultSettings,
    policy: { onDecodeError: 'clear' },
  })

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => getEffectiveTheme(settings.theme))

  // Update effectiveTheme when settings.theme changes
  useEffect(() => {
    setEffectiveTheme(getEffectiveTheme(settings.theme))
  }, [settings.theme])

  // Apply theme to DOM
  useEffect(() => {
    if (typeof document === 'undefined') return

    const classes = document.documentElement.classList
    classes.remove('light', 'dark', 'system')

    if (settings.theme === 'system') {
      classes.add('system')
      classes.add(effectiveTheme)
    } else {
      classes.add(settings.theme)
    }
  }, [settings.theme, effectiveTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (settings.theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      setEffectiveTheme(getEffectiveTheme('system'))
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [settings.theme])

  // Methods
  const setTheme = (theme: ThemeMode) => {
    setValue((prev) => ({ ...prev, theme }))
    setEffectiveTheme(getEffectiveTheme(theme))
  }

  const setGridOverlay = (gridOverlay: GridOverlay) => {
    setValue((prev) => ({ ...prev, gridOverlay }))
  }

  return {
    settings,
    effectiveTheme,
    setTheme,
    setGridOverlay,
    isHydrated,
  }
}

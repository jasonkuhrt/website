/**
 * Settings Store - React + Effect Schema Pattern
 *
 * Features:
 * - React hooks for state management
 * - Effect Schema runtime validation
 * - Automatic localStorage persistence
 * - Type-safe throughout
 */

import * as S from 'effect/Schema'
import { useEffect, useState } from 'react'

// ============================================================================
// Schemas - Define valid values with runtime validation
// ============================================================================

export const ThemeMode = S.Literal('light', 'dark', 'system')
export type ThemeMode = S.Schema.Type<typeof ThemeMode>

const SettingsSchema = S.Struct({
  theme: ThemeMode,
})
export type Settings = S.Schema.Type<typeof SettingsSchema>

// ============================================================================
// Default Settings
// ============================================================================

const defaultSettings: Settings = {
  theme: 'system',
}

// ============================================================================
// Settings Hook
// ============================================================================

export const useSettings = () => {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings)
  const [isHydrated, setIsHydrated] = useState(false)

  // Compute effective theme based on system preference
  const getEffectiveTheme = (theme: ThemeMode): 'light' | 'dark' => {
    if (theme === 'system') {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ?
        'dark' :
        'light'
    }
    return theme
  }

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => getEffectiveTheme(defaultSettings.theme))

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof localStorage === 'undefined') {
      setIsHydrated(true)
      return
    }

    const stored = localStorage.getItem('settings')
    if (!stored) {
      setIsHydrated(true)
      return
    }

    try {
      const parsed = JSON.parse(stored)
      const decoded = S.decodeUnknownSync(SettingsSchema)(parsed)
      setSettingsState(decoded)
      setEffectiveTheme(getEffectiveTheme(decoded.theme))
    } catch (error) {
      console.warn('Failed to parse settings from localStorage', error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save to localStorage when settings change
  useEffect(() => {
    if (!isHydrated) return
    if (typeof localStorage === 'undefined') return

    localStorage.setItem('settings', JSON.stringify(settings))
  }, [settings, isHydrated])

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
    setSettingsState((prev) => ({ ...prev, theme }))
    setEffectiveTheme(getEffectiveTheme(theme))
  }

  return {
    settings,
    effectiveTheme,
    setTheme,
    isHydrated,
  }
}

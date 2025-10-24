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

export const TitleFont = S.Literal('zilla-slab', 'roboto-slab', 'bitter', 'arvo')
export type TitleFont = S.Schema.Type<typeof TitleFont>

export const FontWeight = S.Literal('400', '600', '700')
export type FontWeight = S.Schema.Type<typeof FontWeight>

const SettingsSchema = S.Struct({
  theme: ThemeMode,
  titleFont: TitleFont,
  fontWeight: FontWeight,
})
export type Settings = S.Schema.Type<typeof SettingsSchema>

// ============================================================================
// Default Settings
// ============================================================================

const defaultSettings: Settings = {
  theme: 'system',
  titleFont: 'zilla-slab',
  fontWeight: '400',
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

  // Apply title font to DOM
  useEffect(() => {
    if (typeof document === 'undefined') return

    // Remove all font classes
    const classes = document.documentElement.classList
    classes.forEach((className) => {
      if (className.startsWith('font-')) classes.remove(className)
    })

    // Add selected font class
    classes.add(`font-${settings.titleFont}`)
  }, [settings.titleFont])

  // Apply font weight to DOM
  useEffect(() => {
    if (typeof document === 'undefined') return

    // Remove all weight classes
    const classes = document.documentElement.classList
    classes.forEach((className) => {
      if (className.startsWith('weight-')) classes.remove(className)
    })

    // Add selected weight class
    classes.add(`weight-${settings.fontWeight}`)
  }, [settings.fontWeight])

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

  const setTitleFont = (titleFont: TitleFont) => {
    setSettingsState((prev) => ({ ...prev, titleFont }))
  }

  const setFontWeight = (fontWeight: FontWeight) => {
    setSettingsState((prev) => ({ ...prev, fontWeight }))
  }

  return {
    settings,
    effectiveTheme,
    setTheme,
    setTitleFont,
    setFontWeight,
    isHydrated,
  }
}

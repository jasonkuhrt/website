<script lang="ts">
  import { Sun, Moon, Monitor } from 'lucide-svelte'
  import { onMount } from 'svelte'

  type ThemeMode = 'light' | 'dark' | 'system'

  let currentMode = $state<ThemeMode>('system')

  const getSystemTheme = (): 'light' | 'dark' =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  const getStoredThemeMode = (): ThemeMode => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('themeMode')
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored
      }
    }
    return 'system'
  }

  const applyTheme = (mode: ThemeMode) => {
    document.documentElement.classList.remove('dark', 'light', 'system')

    if (mode === 'system') {
      document.documentElement.classList.add('system')
      document.documentElement.classList.add(getSystemTheme())
    } else {
      document.documentElement.classList.add(mode)
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('themeMode', mode)
    }

    currentMode = mode
  }

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(currentMode)
    const nextIndex = (currentIndex + 1) % modes.length
    const nextMode = modes[nextIndex]

    applyTheme(nextMode)
  }

  onMount(() => {
    // Initialize current mode from storage
    currentMode = getStoredThemeMode()

    // Listen for system theme changes when in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (getStoredThemeMode() === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  })
</script>

<button
  class="absolute top-5 right-5 p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
  aria-label="Toggle theme"
  title="Toggle theme (Light/Dark/System)"
  onclick={cycleTheme}
>
  <Sun class="theme-icon {currentMode === 'light' ? 'block' : 'hidden'} w-5 h-5" />
  <Moon class="theme-icon {currentMode === 'dark' ? 'block' : 'hidden'} w-5 h-5" />
  <Monitor class="theme-icon {currentMode === 'system' ? 'block' : 'hidden'} w-5 h-5" />
</button>

<style>
  button {
    opacity: 0.6;
  }
  button:hover {
    opacity: 1;
  }

  .theme-icon {
    transition: opacity 0.2s ease;
  }
</style>

<script module>
  export const meta = {
    title: 'Settings/RadioGroup',
  }
</script>

<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte'
  import RadioGroup from './RadioGroup.svelte'

  let theme = $state('system')
  let codeTheme = $state('tokyo-night')

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ] as const

  const codeThemeOptions = [
    { value: 'tokyo-night', label: 'Tokyo Night' },
    { value: 'github-dark', label: 'GitHub Dark' },
    { value: 'dracula', label: 'Dracula' },
    { value: 'nord', label: 'Nord' },
  ] as const
</script>

<Hst.Story title="Default">
  <div class="p-6 space-y-8 max-w-md">
    <RadioGroup label="Theme" options={themeOptions} value={theme} onchange={(val) => (theme = val)} />

    <div class="text-sm text-gray-600 dark:text-gray-400">
      Selected: <code>{theme}</code>
    </div>
  </div>
</Hst.Story>

<Hst.Story title="Multiple Groups">
  <div class="p-6 space-y-8 max-w-md">
    <RadioGroup label="Theme" options={themeOptions} value={theme} onchange={(val) => (theme = val)} />

    <RadioGroup
      label="Code Theme"
      options={codeThemeOptions}
      value={codeTheme}
      onchange={(val) => (codeTheme = val)}
    />

    <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
      <div>Theme: <code>{theme}</code></div>
      <div>Code Theme: <code>{codeTheme}</code></div>
    </div>
  </div>
</Hst.Story>

<Hst.Story title="Dark Mode">
  <div class="dark">
    <div class="p-6 space-y-8 max-w-md bg-gray-950 min-h-screen">
      <RadioGroup label="Theme" options={themeOptions} value={theme} onchange={(val) => (theme = val)} />
    </div>
  </div>
</Hst.Story>

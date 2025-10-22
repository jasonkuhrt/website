<script context="module">
  export const meta = {
    title: 'Settings/SettingsButton',
  }
</script>

<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte'
  import SettingsButton from './SettingsButton.svelte'
</script>

<Hst.Story title="Default">
  <div class="relative h-screen">
    <SettingsButton />
    <div class="p-6">
      <p class="text-gray-600 dark:text-gray-400">
        The settings button should appear in the top-right corner.
      </p>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Click it to open the settings modal.</p>
    </div>
  </div>
</Hst.Story>

<Hst.Story title="Dark Mode">
  <div class="dark">
    <div class="relative h-screen bg-gray-950">
      <SettingsButton />
      <div class="p-6">
        <p class="text-gray-400">The settings button should appear in the top-right corner.</p>
        <p class="text-gray-400 mt-2">Click it to open the settings modal.</p>
      </div>
    </div>
  </div>
</Hst.Story>

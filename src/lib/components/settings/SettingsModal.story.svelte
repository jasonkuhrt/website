<script module>
  export const meta = {
    title: 'Settings/SettingsModal',
  }
</script>

<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte'
  import SettingsModal from './SettingsModal.svelte'

  let open = $state(true)
</script>

<Hst.Story title="Open">
  <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onclick={() => (open = true)}>
    Open Settings
  </button>

  <SettingsModal bind:open />
</Hst.Story>

<Hst.Story title="Dark Mode">
  <div class="dark">
    <div class="bg-gray-950 min-h-screen p-6">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onclick={() => (open = true)}
      >
        Open Settings
      </button>

      <SettingsModal bind:open />
    </div>
  </div>
</Hst.Story>

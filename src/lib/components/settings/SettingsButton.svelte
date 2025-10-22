<script lang="ts">
  /**
   * Settings Button - Triggers Settings Modal
   *
   * Simple button with settings icon that opens the modal
   */

  import { Settings } from 'lucide-svelte'
  import SettingsModal from './SettingsModal.svelte'

  let open = $state(false)
</script>

<button
  class="p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 opacity-60 hover:opacity-100"
  aria-label="Settings"
  title="Settings"
  onclick={() => (open = true)}
>
  <Settings class="w-5 h-5" />
</button>

<SettingsModal bind:open />

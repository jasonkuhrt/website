<script lang="ts">
  /**
   * Settings Modal - Main Settings Interface
   *
   * Uses Bits UI Dialog for accessibility and UX
   * Features:
   * - Focus trap
   * - ESC to close
   * - Click backdrop to close
   * - Smooth animations
   */

  import { Dialog, ToggleGroup } from 'bits-ui'
  import { X, Sun, Moon, Monitor } from 'lucide-svelte'
  import { settings } from '$lib/stores/settings.svelte'
  import type { ThemeMode } from '$lib/stores/settings.svelte'

  interface Props {
    open: boolean
  }

  let { open = $bindable() }: Props = $props()
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <!-- Backdrop -->
    <Dialog.Overlay
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />

    <!-- Modal Content -->
    <Dialog.Content
      class="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded"
    >
      <!-- Header -->
      <Dialog.Title class="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
        Settings
      </Dialog.Title>

      <Dialog.Description class="sr-only">Settings dialog</Dialog.Description>

      <!-- Settings Content -->
      <div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Theme</div>
        <ToggleGroup.Root
          type="single"
          value={settings.theme}
          onValueChange={(value) => value && settings.setTheme(value as ThemeMode)}
          class="inline-flex border border-gray-200 dark:border-gray-800 rounded"
        >
          <ToggleGroup.Item
            value="light"
            class="flex items-center justify-center px-3 py-2 border-r border-gray-200 dark:border-gray-800
            data-[state=on]:bg-gray-900 data-[state=on]:text-white
            data-[state=off]:bg-white data-[state=off]:hover:bg-gray-50
            dark:data-[state=on]:bg-gray-100 dark:data-[state=on]:text-gray-900
            dark:data-[state=off]:bg-gray-950 dark:data-[state=off]:hover:bg-gray-900
            transition-colors"
            aria-label="Light"
          >
            <Sun class="w-4 h-4" />
          </ToggleGroup.Item>

          <ToggleGroup.Item
            value="dark"
            class="flex items-center justify-center px-3 py-2 border-r border-gray-200 dark:border-gray-800
            data-[state=on]:bg-gray-900 data-[state=on]:text-white
            data-[state=off]:bg-white data-[state=off]:hover:bg-gray-50
            dark:data-[state=on]:bg-gray-100 dark:data-[state=on]:text-gray-900
            dark:data-[state=off]:bg-gray-950 dark:data-[state=off]:hover:bg-gray-900
            transition-colors"
            aria-label="Dark"
          >
            <Moon class="w-4 h-4" />
          </ToggleGroup.Item>

          <ToggleGroup.Item
            value="system"
            class="flex items-center justify-center px-3 py-2
            data-[state=on]:bg-gray-900 data-[state=on]:text-white
            data-[state=off]:bg-white data-[state=off]:hover:bg-gray-50
            dark:data-[state=on]:bg-gray-100 dark:data-[state=on]:text-gray-900
            dark:data-[state=off]:bg-gray-950 dark:data-[state=off]:hover:bg-gray-900
            transition-colors"
            aria-label="System"
          >
            <Monitor class="w-4 h-4" />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      <!-- Close Button -->
      <Dialog.Close
        class="absolute right-3 top-3 rounded-sm p-2 opacity-70 bg-gray-100 dark:bg-gray-800 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-gray-950 dark:focus:ring-gray-300"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

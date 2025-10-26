/**
 * Settings Modal - Main Settings Interface
 *
 * Uses Radix UI Dialog for accessibility and UX
 * Features:
 * - Focus trap
 * - ESC to close
 * - Click backdrop to close
 * - Smooth animations
 */

import * as Dialog from '@radix-ui/react-dialog'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Monitor, Moon, Sun, Type, Weight, X } from 'lucide-react'
import type { FontWeight, ThemeMode, TitleFont } from '../../lib/settings'
import { useSettings } from '../../lib/settings'

export interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FONT_OPTIONS: Array<{ value: TitleFont; label: string; description: string }> = [
  { value: 'zilla-slab', label: 'Zilla Slab', description: 'Bold & Playful' },
  { value: 'roboto-slab', label: 'Roboto Slab', description: 'Modern & Clean' },
  { value: 'bitter', label: 'Bitter', description: 'Subtle & Refined' },
  { value: 'arvo', label: 'Arvo', description: 'Geometric & Strong' },
]

const WEIGHT_OPTIONS: Array<{ value: FontWeight; label: string }> = [
  { value: '400', label: 'Regular' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
]

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, setTheme, setTitleFont, setFontWeight } = useSettings()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />

        {/* Modal Content */}
        <Dialog.Content className='fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded'>
          {/* Header */}
          <Dialog.Title className='text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8'>
            Settings
          </Dialog.Title>

          <Dialog.Description className='sr-only'>Settings dialog</Dialog.Description>

          {/* Settings Content */}
          <div>
            <div className='text-sm text-gray-600 dark:text-gray-400 mb-2 block'>Theme</div>
            <ToggleGroup.Root
              type='single'
              value={settings.theme}
              onValueChange={(value) => value && setTheme(value as ThemeMode)}
              className='inline-flex border border-gray-200 dark:border-gray-800 rounded'
            >
              <ToggleGroup.Item
                value='light'
                className='flex items-center justify-center px-3 py-2 border-r border-gray-200 dark:border-gray-800
                data-[state=on]:bg-gray-900 data-[state=on]:text-white
                data-[state=off]:bg-white data-[state=off]:hover:bg-gray-50
                dark:data-[state=on]:bg-gray-100 dark:data-[state=on]:text-gray-900
                dark:data-[state=off]:bg-gray-950 dark:data-[state=off]:hover:bg-gray-900
                transition-colors'
                aria-label='Light'
              >
                <Sun className='w-4 h-4' />
              </ToggleGroup.Item>

              <ToggleGroup.Item
                value='dark'
                className='flex items-center justify-center px-3 py-2 border-r border-gray-200 dark:border-gray-800
                data-[state=on]:bg-gray-900 data-[state=on]:text-white
                data-[state=off]:bg-white data-[state=off]:hover:bg-gray-50
                dark:data-[state=on]:bg-gray-100 dark:data-[state=on]:text-gray-900
                dark:data-[state=off]:bg-gray-950 dark:data-[state=off]:hover:bg-gray-900
                transition-colors'
                aria-label='Dark'
              >
                <Moon className='w-4 h-4' />
              </ToggleGroup.Item>

              <ToggleGroup.Item
                value='system'
                className='flex items-center justify-center px-3 py-2
                data-[state=on]:bg-gray-900 data-[state=on]:text-white
                data-[state=off]:bg-white data-[state=off]:hover:bg-gray-50
                dark:data-[state=on]:bg-gray-100 dark:data-[state=on]:text-gray-900
                dark:data-[state=off]:bg-gray-950 dark:data-[state=off]:hover:bg-gray-900
                transition-colors'
                aria-label='System'
              >
                <Monitor className='w-4 h-4' />
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>

          {/* Title Font Setting */}
          <div className='mt-8'>
            <div className='text-sm text-gray-600 dark:text-gray-400 mb-2 block'>Title Font</div>
            <ToggleGroup.Root
              type='single'
              value={settings.titleFont}
              onValueChange={(value) => value && setTitleFont(value as TitleFont)}
              className='flex flex-col gap-2'
            >
              {FONT_OPTIONS.map((font) => (
                <ToggleGroup.Item
                  key={font.value}
                  value={font.value}
                  className='flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-800 rounded
                  data-[state=on]:bg-gray-900 data-[state=on]:text-white data-[state=on]:border-gray-900
                  data-[state=off]:bg-white data-[state=off]:hover:bg-gray-50
                  dark:data-[state=on]:bg-gray-100 dark:data-[state=on]:text-gray-900 dark:data-[state=on]:border-gray-100
                  dark:data-[state=off]:bg-gray-950 dark:data-[state=off]:hover:bg-gray-900
                  transition-colors'
                  aria-label={font.label}
                >
                  <div className='flex items-center gap-3'>
                    <Type className='w-4 h-4' />
                    <div className='text-left'>
                      <div className='font-semibold text-sm'>{font.label}</div>
                      <div className='text-xs opacity-60'>{font.description}</div>
                    </div>
                  </div>
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </div>

          {/* Font Weight Setting */}
          <div className='mt-8'>
            <div className='text-sm text-gray-600 dark:text-gray-400 mb-2 block'>Font Weight</div>
            <ToggleGroup.Root
              type='single'
              value={settings.fontWeight}
              onValueChange={(value) => value && setFontWeight(value as FontWeight)}
              className='inline-flex border border-gray-200 dark:border-gray-800 rounded'
            >
              {WEIGHT_OPTIONS.map((weight) => (
                <ToggleGroup.Item
                  key={weight.value}
                  value={weight.value}
                  className='flex items-center justify-center px-4 py-2 border-r border-gray-200 dark:border-gray-800 last:border-r-0
                  data-[state=on]:bg-gray-900 data-[state=on]:text-white
                  data-[state=off]:bg-white data-[state=off]:hover:bg-gray-50
                  dark:data-[state=on]:bg-gray-100 dark:data-[state=on]:text-gray-900
                  dark:data-[state=off]:bg-gray-950 dark:data-[state=off]:hover:bg-gray-900
                  transition-colors'
                  aria-label={weight.label}
                >
                  <div className='flex items-center gap-2'>
                    <Weight className='w-4 h-4' />
                    <span className='text-sm'>{weight.label}</span>
                  </div>
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </div>

          {/* Close Button */}
          <Dialog.Close className='absolute right-3 top-3 rounded-sm p-2 opacity-70 bg-gray-100 dark:bg-gray-800 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-gray-950 dark:focus:ring-gray-300'>
            <X className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

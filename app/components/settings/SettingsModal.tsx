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
import styles from './SettingsModal.module.css'

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
        <Dialog.Overlay className={styles.overlay} />

        {/* Modal Content */}
        <Dialog.Content className={styles.content}>
          {/* Header */}
          <Dialog.Title className={styles.title}>
            Settings
          </Dialog.Title>

          <Dialog.Description className={styles.srOnly}>Settings dialog</Dialog.Description>

          {/* Settings Content */}
          <div className={styles.section}>
            <div className={styles.label}>Theme</div>
            <ToggleGroup.Root
              type='single'
              value={settings.theme}
              onValueChange={(value) => value && setTheme(value as ThemeMode)}
              className={styles.themeToggleGroup}
            >
              <ToggleGroup.Item
                value='light'
                className={styles.themeToggleItem}
                aria-label='Light'
              >
                <Sun className={styles.icon} />
              </ToggleGroup.Item>

              <ToggleGroup.Item
                value='dark'
                className={styles.themeToggleItem}
                aria-label='Dark'
              >
                <Moon className={styles.icon} />
              </ToggleGroup.Item>

              <ToggleGroup.Item
                value='system'
                className={styles.themeToggleItem}
                aria-label='System'
              >
                <Monitor className={styles.icon} />
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>

          {/* Title Font Setting */}
          <div className={styles.section}>
            <div className={styles.label}>Title Font</div>
            <ToggleGroup.Root
              type='single'
              value={settings.titleFont}
              onValueChange={(value) => value && setTitleFont(value as TitleFont)}
              className={styles.fontToggleGroup}
            >
              {FONT_OPTIONS.map((font) => (
                <ToggleGroup.Item
                  key={font.value}
                  value={font.value}
                  className={styles.fontToggleItem}
                  aria-label={font.label}
                >
                  <div className={styles.fontContent}>
                    <Type className={styles.icon} />
                    <div className={styles.fontText}>
                      <div className={styles.fontLabel}>{font.label}</div>
                      <div className={styles.fontDescription}>{font.description}</div>
                    </div>
                  </div>
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </div>

          {/* Font Weight Setting */}
          <div className={styles.section}>
            <div className={styles.label}>Font Weight</div>
            <ToggleGroup.Root
              type='single'
              value={settings.fontWeight}
              onValueChange={(value) => value && setFontWeight(value as FontWeight)}
              className={styles.weightToggleGroup}
            >
              {WEIGHT_OPTIONS.map((weight) => (
                <ToggleGroup.Item
                  key={weight.value}
                  value={weight.value}
                  className={styles.weightToggleItem}
                  aria-label={weight.label}
                >
                  <div className={styles.weightContent}>
                    <Weight className={styles.icon} />
                    <span className={styles.weightLabel}>{weight.label}</span>
                  </div>
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </div>

          {/* Close Button */}
          <Dialog.Close className={styles.closeButton}>
            <X className={styles.icon} />
            <span className={styles.srOnly}>Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

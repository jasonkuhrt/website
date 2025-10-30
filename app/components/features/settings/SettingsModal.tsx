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
import { Monitor, Moon, Sun, X } from 'lucide-react'
import { css } from '../../../../styled-system/css'
import { token } from '../../../../styled-system/tokens'
import type { GridOverlay, ThemeMode } from '../../../lib/settings'
import { useSettings } from '../../../lib/settings'

// Keyframe animations
const fadeIn = css.raw({
  animationName: 'fadeIn',
})

const fadeOut = css.raw({
  animationName: 'fadeOut',
})

const modalIn = css.raw({
  animationName: 'modalIn',
})

const modalOut = css.raw({
  animationName: 'modalOut',
})

// Define keyframes in global styles
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  @keyframes modalOut {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.95);
    }
  }
`

// Inject keyframes into document
if (typeof document !== 'undefined') {
  const styleEl = document.getElementById('settings-modal-keyframes')
  if (!styleEl) {
    const style = document.createElement('style')
    style.id = 'settings-modal-keyframes'
    style.textContent = keyframes
    document.head.appendChild(style)
  }
}

const overlay = css({
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  backgroundColor: token('colors.overlay.heavy'),
  backdropFilter: 'blur(4px)',
  '&[data-state="open"]': {
    animation: 'fadeIn 200ms',
  },
  '&[data-state="closed"]': {
    animation: 'fadeOut 200ms',
  },
})

const content = css({
  position: 'fixed',
  left: '50%',
  top: '50%',
  zIndex: 50,
  width: '100%',
  maxWidth: '32rem',
  transform: 'translate(-50%, -50%)',
  gap: token('spacing.4'),
  border: '1px solid',
  borderColor: token('colors.border.default'),
  backgroundColor: token('colors.bg.primary'),
  padding: token('spacing.8'),
  boxShadow: token('shadows.md'),
  borderRadius: token('radii.base'),
  transitionDuration: '200ms',
  '&[data-state="open"]': {
    animation: 'modalIn 200ms',
  },
  '&[data-state="closed"]': {
    animation: 'modalOut 200ms',
  },
})

const title = css({
  fontSize: token('fontSizes.2xl'),
  fontWeight: 'bold',
  color: token('colors.text.primary'),
  textAlign: 'center',
  marginBottom: token('spacing.8'),
})

const srOnly = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
})

const section = css({
  marginTop: token('spacing.8'),
  '&:first-of-type': {
    marginTop: 0,
  },
})

const label = css({
  fontSize: token('fontSizes.sm'),
  color: token('colors.text.secondary'),
  marginBottom: token('spacing.2'),
  display: 'block',
})

const themeToggleGroup = css({
  display: 'inline-flex',
  border: '1px solid',
  borderColor: token('colors.border.default'),
  borderRadius: token('radii.base'),
})

const themeToggleItem = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${token('spacing.2')} ${token('spacing.3')}`,
  borderRight: '1px solid',
  borderColor: token('colors.border.default'),
  transition: 'all {durations.base}',
  '&:last-child': {
    borderRight: 0,
  },
  '&[data-state="on"]': {
    backgroundColor: token('colors.text.primary'),
    color: token('colors.bg.primary'),
  },
  '&[data-state="off"]': {
    backgroundColor: token('colors.bg.primary'),
    _hover: {
      backgroundColor: token('colors.bg.subtle'),
    },
  },
})

const textToggleItem = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${token('spacing.2')} ${token('spacing.4')}`,
  minWidth: token('spacing.16'),
  fontSize: token('fontSizes.sm'),
  borderRight: '1px solid',
  borderColor: token('colors.border.default'),
  transition: 'all {durations.base}',
  '&:last-child': {
    borderRight: 0,
  },
  '&[data-state="on"]': {
    backgroundColor: token('colors.text.primary'),
    color: token('colors.bg.primary'),
  },
  '&[data-state="off"]': {
    backgroundColor: token('colors.bg.primary'),
    _hover: {
      backgroundColor: token('colors.bg.subtle'),
    },
  },
})

const closeButton = css({
  position: 'absolute',
  right: token('spacing.3'),
  top: token('spacing.3'),
  borderRadius: token('radii.sm'),
  padding: token('spacing.2'),
  opacity: 0.7,
  backgroundColor: token('colors.bg.surface'),
  transition: 'opacity {durations.base}',
  _hover: {
    opacity: 1,
  },
  _focus: {
    outline: 'none',
    boxShadow: `0 0 0 2px ${token('colors.text.primary')}`,
  },
  _disabled: {
    pointerEvents: 'none',
  },
})

const icon = css({
  width: '1rem',
  height: '1rem',
})

export interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, setTheme, setGridOverlay } = useSettings()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className={overlay} />

        {/* Modal Content */}
        <Dialog.Content className={content}>
          {/* Header */}
          <Dialog.Title className={title}>
            Settings
          </Dialog.Title>

          <Dialog.Description className={srOnly}>Settings dialog</Dialog.Description>

          {/* Settings Content */}
          <div className={section}>
            <div className={label}>Theme</div>
            <ToggleGroup.Root
              type='single'
              value={settings.theme}
              onValueChange={(value) => value && setTheme(value as ThemeMode)}
              className={themeToggleGroup}
            >
              <ToggleGroup.Item
                value='light'
                className={themeToggleItem}
                aria-label='Light'
              >
                <Sun className={icon} />
              </ToggleGroup.Item>

              <ToggleGroup.Item
                value='dark'
                className={themeToggleItem}
                aria-label='Dark'
              >
                <Moon className={icon} />
              </ToggleGroup.Item>

              <ToggleGroup.Item
                value='system'
                className={themeToggleItem}
                aria-label='System'
              >
                <Monitor className={icon} />
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>

          {/* Grid Overlay */}
          <div className={section}>
            <div className={label}>Vertical Rhythm Grid</div>
            <ToggleGroup.Root
              type='single'
              value={settings.gridOverlay}
              onValueChange={(value) => value && setGridOverlay(value as GridOverlay)}
              className={themeToggleGroup}
            >
              <ToggleGroup.Item
                value='off'
                className={textToggleItem}
                aria-label='Off'
              >
                Off
              </ToggleGroup.Item>

              <ToggleGroup.Item
                value='on'
                className={textToggleItem}
                aria-label='On'
              >
                On
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>

          {/* Close Button */}
          <Dialog.Close className={closeButton}>
            <X className={icon} />
            <span className={srOnly}>Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

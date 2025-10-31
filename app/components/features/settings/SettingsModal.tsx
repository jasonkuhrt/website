/**
 * Settings Modal - Main Settings Interface
 *
 * Uses Ark UI Dialog for accessibility and UX
 * Features:
 * - Focus trap
 * - ESC to close
 * - Click backdrop to close
 * - Smooth animations
 */

import { Dialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { SegmentGroup } from '@ark-ui/react/segment-group'
import { Monitor, Moon, Sun, X } from 'lucide-react'
import { css } from '#styled-system/css'
import type { GridOverlay, ThemeMode } from '#~/lib/settings'
import { useSettings } from '#~/lib/settings'
import { L } from '../../__'

// Keyframe animations (removed - using inline animation strings instead)

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
  inset: '0',
  zIndex: '50',
  backgroundColor: 'overlay.heavy',
  backdropFilter: '[blur(4px)]',
  '&[data-state="open"]': {
    animation: 'fadeIn 200ms',
  },
  '&[data-state="closed"]': {
    animation: 'fadeOut 200ms',
  },
})

const content = css({
  position: 'fixed',
  left: '[50%]',
  top: '[50%]',
  zIndex: '50',
  width: 'full',
  maxWidth: '32',
  transform: '[translate(-50%, -50%)]',
  gap: '4',
  border: '1px solid',
  borderColor: 'border.default',
  backgroundColor: 'bg.primary',
  padding: '8',
  boxShadow: 'md',
  borderRadius: '1',
  transitionDuration: 'base',
  '&[data-state="open"]': {
    animation: 'modalIn 200ms',
  },
  '&[data-state="closed"]': {
    animation: 'modalOut 200ms',
  },
})

const title = css({
  fontSize: '8',
  fontWeight: 'bold',
  color: 'text.primary',
  textAlign: 'center',
  marginBottom: '8',
})

const srOnly = css({
  position: 'absolute',
  width: 'px',
  height: 'px',
  padding: '0',
  margin: '[-1px]',
  overflow: 'hidden',
  clip: '[rect(0, 0, 0, 0)]',
  whiteSpace: 'nowrap',
  borderWidth: '0',
})

const section = css({
  marginTop: '8',
  '&:first-of-type': {
    marginTop: '0',
  },
})

const label = css({
  fontSize: '2',
  color: 'text.secondary',
  marginBottom: '2',
  display: 'block',
})

const themeToggleGroup = css({
  display: 'inline-flex',
  border: '1px solid',
  borderColor: 'border.default',
  borderRadius: '1',
})

const themeToggleItem = css({
  paddingBlock: '2',
  paddingInline: '3',
  borderRight: '1px solid',
  borderColor: 'border.default',
  transitionProperty: '[all]',
  transitionDuration: 'base',
  '&:last-child': {
    borderRight: '0',
  },
  '&[data-state="on"]': {
    backgroundColor: 'text.primary',
    color: 'bg.primary',
  },
  '&[data-state="off"]': {
    backgroundColor: 'bg.primary',
    _hover: {
      backgroundColor: 'bg.subtle',
    },
  },
})

const textToggleItem = css({
  paddingBlock: '2',
  paddingInline: '4',
  minWidth: '6',
  fontSize: '2',
  borderRight: '1px solid',
  borderColor: 'border.default',
  transitionProperty: '[all]',
  transitionDuration: 'base',
  '&:last-child': {
    borderRight: '0',
  },
  '&[data-state="on"]': {
    backgroundColor: 'text.primary',
    color: 'bg.primary',
  },
  '&[data-state="off"]': {
    backgroundColor: 'bg.primary',
    _hover: {
      backgroundColor: 'bg.subtle',
    },
  },
})

const closeButton = css({
  position: 'absolute',
  right: '3',
  top: '3',
  borderRadius: '1',
  padding: '2',
  opacity: '70',
  backgroundColor: 'bg.surface',
  transitionProperty: '[opacity]',
  transitionDuration: 'base',
  _hover: {
    opacity: '100',
  },
  _focus: {
    outline: 'none',
    boxShadow: '[0 0 0 2px {colors.text.primary}]',
  },
  _disabled: {
    pointerEvents: 'none',
  },
})

const icon = css({
  width: '1',
  height: '1',
})

export function SettingsModal() {
  const { settings, setTheme, setGridOverlay } = useSettings()

  return (
    <Portal>
      {/* Backdrop */}
      <Dialog.Backdrop className={overlay} />

      <Dialog.Positioner>
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
            <SegmentGroup.Root
              value={settings.theme}
              onValueChange={(details) => setTheme(details.value as ThemeMode)}
              className={themeToggleGroup}
            >
              <SegmentGroup.Item
                value='light'
                className={themeToggleItem}
                aria-label='Light'
              >
                <SegmentGroup.ItemText>
                  <L.Flex.Row align='center' justify='center'>
                    <Sun className={icon} />
                  </L.Flex.Row>
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>

              <SegmentGroup.Item
                value='dark'
                className={themeToggleItem}
                aria-label='Dark'
              >
                <SegmentGroup.ItemText>
                  <L.Flex.Row align='center' justify='center'>
                    <Moon className={icon} />
                  </L.Flex.Row>
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>

              <SegmentGroup.Item
                value='system'
                className={themeToggleItem}
                aria-label='System'
              >
                <SegmentGroup.ItemText>
                  <L.Flex.Row align='center' justify='center'>
                    <Monitor className={icon} />
                  </L.Flex.Row>
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            </SegmentGroup.Root>
          </div>

          {/* Grid Overlay */}
          <div className={section}>
            <div className={label}>Vertical Rhythm Grid</div>
            <SegmentGroup.Root
              value={settings.gridOverlay}
              onValueChange={(details) => setGridOverlay(details.value as GridOverlay)}
              className={themeToggleGroup}
            >
              <SegmentGroup.Item
                value='off'
                className={textToggleItem}
                aria-label='Off'
              >
                <SegmentGroup.ItemText>
                  <L.Flex.Row align='center' justify='center'>
                    Off
                  </L.Flex.Row>
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>

              <SegmentGroup.Item
                value='on'
                className={textToggleItem}
                aria-label='On'
              >
                <SegmentGroup.ItemText>
                  <L.Flex.Row align='center' justify='center'>
                    On
                  </L.Flex.Row>
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            </SegmentGroup.Root>
          </div>

          {/* Close Button */}
          <Dialog.CloseTrigger className={closeButton}>
            <X className={icon} />
            <span className={srOnly}>Close</span>
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  )
}

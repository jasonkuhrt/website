/**
 * Settings Button - Triggers Settings Modal
 *
 * Simple button with settings icon that opens the modal
 */

import { Dialog } from '@ark-ui/react/dialog'
import { css } from '#styled-system/css'
import { UI } from '../../__'
import { SettingsModal } from './SettingsModal'

const buttonOpacity = css({
  opacity: '60',
  _hover: {
    opacity: '100',
  },
})

const buttonPadding = css({
  padding: '2',
})

export function SettingsButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <UI.Button
          variant='ghost'
          className={`${buttonPadding} ${buttonOpacity}`}
          aria-label='Settings'
          title='Settings'
        >
          <UI.Badge icon='Settings' scale='7' />
        </UI.Button>
      </Dialog.Trigger>

      <SettingsModal />
    </Dialog.Root>
  )
}

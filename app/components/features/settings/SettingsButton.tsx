/**
 * Settings Button - Triggers Settings Modal
 *
 * Simple button with settings icon that opens the modal
 */

import { Settings } from 'lucide-react'
import { useState } from 'react'
import { css } from '../../../../styled-system/css'
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
  const [open, setOpen] = useState(false)

  return (
    <>
      <UI.Button
        variant='ghost'
        className={`${buttonPadding} ${buttonOpacity}`}
        aria-label='Settings'
        title='Settings'
        onClick={() => setOpen(true)}
      >
        <UI.Icon size='lg'>
          <Settings />
        </UI.Icon>
      </UI.Button>

      <SettingsModal open={open} onOpenChange={setOpen} />
    </>
  )
}

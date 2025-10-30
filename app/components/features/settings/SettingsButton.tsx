/**
 * Settings Button - Triggers Settings Modal
 *
 * Simple button with settings icon that opens the modal
 */

import { Settings } from 'lucide-react'
import { useState } from 'react'
import { css } from '../../../../styled-system/css'
import { SettingsModal } from './SettingsModal'

const button = css({
  padding: '2',
  borderRadius: 'radii.md',
  transition: 'all {durations.base}',
  color: 'text.secondary',
  opacity: 0.6,
  _hover: {
    backgroundColor: 'bg.subtle',
    opacity: 1,
  },
})

const icon = css({
  width: '1.25rem',
  height: '1.25rem',
})

export function SettingsButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className={button}
        aria-label='Settings'
        title='Settings'
        onClick={() => setOpen(true)}
      >
        <Settings className={icon} />
      </button>

      <SettingsModal open={open} onOpenChange={setOpen} />
    </>
  )
}

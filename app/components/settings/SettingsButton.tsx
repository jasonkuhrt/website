/**
 * Settings Button - Triggers Settings Modal
 *
 * Simple button with settings icon that opens the modal
 */

import { Settings } from 'lucide-react'
import { useState } from 'react'
import { SettingsModal } from './SettingsModal'

export function SettingsButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className='p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 opacity-60 hover:opacity-100'
        aria-label='Settings'
        title='Settings'
        onClick={() => setOpen(true)}
      >
        <Settings className='w-5 h-5' />
      </button>

      <SettingsModal open={open} onOpenChange={setOpen} />
    </>
  )
}

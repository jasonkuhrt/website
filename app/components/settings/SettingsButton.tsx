/**
 * Settings Button - Triggers Settings Modal
 *
 * Simple button with settings icon that opens the modal
 */

import { Settings } from 'lucide-react'
import { useState } from 'react'
import { SettingsModal } from './SettingsModal'
import styles from './SettingsButton.module.css'

export function SettingsButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className={styles.button}
        aria-label='Settings'
        title='Settings'
        onClick={() => setOpen(true)}
      >
        <Settings className={styles.icon} />
      </button>

      <SettingsModal open={open} onOpenChange={setOpen} />
    </>
  )
}

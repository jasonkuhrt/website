import { css } from '#styled-system/css'
import { X } from 'lucide-react'
import { L, Text } from '../__'

const overlay = css({
  position: 'fixed',
  inset: '[0]',
  backgroundColor: 'overlay.medium',
  zIndex: '[40]',
})

const content = css({
  position: 'fixed',
  top: '[50%]',
  left: '[50%]',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'bg.primary',
  borderRadius: '1',
  boxShadow: 'lg',
  padding: '6',
  maxWidth: '28',
  zIndex: '[50]',
  border: '1px solid',
  borderColor: 'border.default',
})

const header = css({
  marginBottom: '4',
})

const closeIconSize = css({
  width: '2',
  height: '2',
})

interface Props {
  /**
   * Whether the modal is open
   */
  open: boolean
  /**
   * Callback when modal should close
   */
  onClose: () => void
  /**
   * Modal content
   */
  children: React.ReactNode
  /**
   * Optional title
   */
  title?: string
  /**
   * Maximum width (CSS value)
   * @default '28rem'
   */
  maxWidth?: string
}

/**
 * Modal overlay component with centered content.
 * Includes close button and click-outside-to-close behavior.
 */
export const Modal: React.FC<Props> = ({ open, onClose, children, title, maxWidth }) => {
  if (!open) return null

  return (
    <div className={overlay} onClick={onClose}>
      <div
        className={content}
        style={maxWidth ? { maxWidth } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <L.Flex.Row justify='between' align='start' className={header}>
            <Text.H3 fontSize='5' fontWeight='semibold' color='text.primary'>
              {title}
            </Text.H3>
            <button type='button' onClick={onClose} aria-label='Close modal'>
              <Text.Text
                color='text.tertiary'
                transitionProperty='colors'
                transitionDuration='base'
                _hover={{ color: 'text.secondary' }}
              >
                <X className={closeIconSize} />
              </Text.Text>
            </button>
          </L.Flex.Row>
        )}
        {children}
      </div>
    </div>
  )
}

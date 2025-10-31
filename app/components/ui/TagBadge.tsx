import { css } from '../../../styled-system/css'
import { T, UI } from '../__'

const badge = css({
  paddingInline: '1',
  borderRadius: 'full',
  backgroundColor: 'bg.subtle',
  transitionProperty: '[background-color]',
  transitionDuration: 'fast',
  _hover: {
    backgroundColor: 'bg.hover',
  },
})

interface Props {
  /**
   * The label text to display inside the badge
   */
  label: string
  /**
   * Optional URL to link to. Creates an anchor element.
   */
  href?: string
  /**
   * Optional click handler. Creates a button element.
   */
  onClick?: () => void
}

/**
 * A pill-shaped badge component, typically used for tags and categories.
 * Can be rendered as a link (with href) or button (with onClick), or plain text (neither).
 */
export const TagBadge: React.FC<Props> = ({ label, href, onClick }) => {
  if (href) {
    return (
      <UI.Link href={href} external className={badge}>
        <T.Text fontSize='2'>{label}</T.Text>
      </UI.Link>
    )
  }

  if (onClick) {
    return (
      <button
        type='button'
        onClick={onClick}
        className={badge}
        aria-label={label}
      >
        <T.Text fontSize='2'>{label}</T.Text>
      </button>
    )
  }

  return (
    <span className={badge}>
      <T.Text fontSize='2'>{label}</T.Text>
    </span>
  )
}

import { format } from 'date-fns'
import { css } from '#styled-system/css'
import { UI } from '../__'

const scribbleLink = css({
  display: 'block',
  fontSize: '2',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  _hover: {
    color: 'accent.dark',
  },
})

interface Props {
  /**
   * Post date
   */
  date: Date
  /**
   * Post slug for link href
   */
  slug: string
  /**
   * Date format string
   * @default 'yyyy-MM-dd'
   */
  dateFormat?: string
}

/**
 * Scribble date link component.
 * Displays formatted date with hover effects for scribbles index.
 */
export const ScribbleLink: React.FC<Props> = ({ date, slug, dateFormat = 'yyyy-MM-dd' }) => {
  return (
    <UI.Link.Nav href={`/writing/${slug}`} variant='accent' className={scribbleLink}>
      {format(date, dateFormat)}
    </UI.Link.Nav>
  )
}

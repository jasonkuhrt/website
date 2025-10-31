import { format } from 'date-fns'
import { css } from '../../../styled-system/css'
import { T, UI } from '../__'

const postCard = css({
  /* Article wrapper */
})

const postLink = css({
  display: 'block',
  borderBottom: '2px solid',
  borderColor: 'border.default',
  paddingBottom: '6',
  transitionProperty: '[all]',
  transitionDuration: 'base',
  _hover: {
    borderColor: 'accent.default',
    '& .post-title': {
      color: 'accent.dark',
    },
  },
})

interface Post {
  slug: string
  date: Date
  title: string
}

interface Props {
  /**
   * The post data to display
   */
  post: Post
  /**
   * Date format string (date-fns format)
   * @default 'LLL dd yyyy'
   */
  dateFormat?: string
  /**
   * Base path for the post link
   * @default '/writing/'
   */
  basePath?: string
}

/**
 * A blog post card with date, title, and hover effects.
 * Used in post listing pages.
 */
export const PostCard: React.FC<Props> = ({
  post,
  dateFormat = 'LLL dd yyyy',
  basePath = '/writing/',
}) => {
  return (
    <article className={postCard}>
      <a
        href={`${basePath}${post.slug}`}
        className={postLink}
      >
        <T.Text marginBottom='3' fontSize='2' textTransform='uppercase' letterSpacing='wide' color='text.tertiary'>
          {format(post.date, dateFormat)}
        </T.Text>
        <T.H3 className={`${UI.transitions.colorTransition} post-title`} marginBottom='4'>
          {post.title}
        </T.H3>
      </a>
    </article>
  )
}

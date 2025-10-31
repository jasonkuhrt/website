import { L, Text, UI } from '../__'

interface Props {
  /**
   * The main article title
   */
  title: string
  /**
   * Optional subtitle or description
   */
  subtitle?: string
  /**
   * Optional list of tags/categories to display
   */
  tags?: string[]
  /**
   * Title variant to use
   * @default 'display-xl'
   */
  titleVariant?: 'display-xl' | 'h1-large'
}

/**
 * A centered article header with title, optional description, and optional tags.
 * Used for blog posts, essays, and portfolio projects.
 */
export const ArticleHeader: React.FC<Props> = ({
  title,
  subtitle,
  tags,
  titleVariant = 'display-xl',
}) => {
  return (
    <L.Box as='header' textAlign='center' marginBottom='8'>
      {titleVariant === 'display-xl' ?
        <Text.DisplayXL>{title}</Text.DisplayXL> :
        (
          <Text.H1 fontSize='14' fontWeight='bold' marginBottom='2'>
            {title}
          </Text.H1>
        )}

      {tags && tags.length > 0 && (
        <L.Flex.Row wrap justify='center' gap='2' marginBottom='4'>
          {tags.map(($tag) => <UI.TagBadge key={$tag} label={$tag} />)}
        </L.Flex.Row>
      )}

      {subtitle && <Text.P color='text.secondary'>{subtitle}</Text.P>}
    </L.Box>
  )
}

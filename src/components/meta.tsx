import { getRequestUrl } from '../lib/request.js'

interface MetaProps {
  /**
   * Page title (will have "| Jason Kuhrt" appended)
   */
  title: string
  /**
   * Page description for SEO
   */
  description?: string
  /**
   * OpenGraph type - use 'article' for blog posts
   */
  type?: 'website' | 'article'
  /**
   * OpenGraph image URL
   */
  image?: string
  /**
   * ISO date string for article publication date
   */
  publishedAt?: string
}

/**
 * Meta component for consistent page metadata
 * Automatically hoisted to <head> by Waku
 * Auto-fetches canonical URL from server request context
 */
export const Meta: React.FC<MetaProps> = ({
  title,
  description,
  type = 'website',
  image,
  publishedAt,
}) => {
  const { full: canonicalUrl } = getRequestUrl()
  const fullTitle = `${title} | Jason Kuhrt`

  return (
    <>
      <title>{fullTitle}</title>
      <link rel='canonical' href={canonicalUrl} />

      {/* OpenGraph */}
      <meta property='og:title' content={fullTitle} />
      <meta property='og:url' content={canonicalUrl} />
      <meta property='og:type' content={type} />
      {description && <meta name='description' content={description} />}
      {description && <meta property='og:description' content={description} />}
      {image && <meta property='og:image' content={image} />}

      {/* Article-specific */}
      {publishedAt && <meta property='article:published_time' content={publishedAt} />}

      {/* Twitter */}
      <meta name='twitter:card' content={image ? 'summary_large_image' : 'summary'} />
      <meta name='twitter:title' content={fullTitle} />
      {description && <meta name='twitter:description' content={description} />}
    </>
  )
}

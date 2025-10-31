import { format } from 'date-fns'

/**
 * Format a date string as a relative time description (e.g., "2 days ago", "3 months ago")
 *
 * @param dateString - ISO date string to format
 * @returns Human-readable relative time string
 *
 * @example
 * formatRelativeDate('2024-01-15') // => "2 weeks ago"
 * formatRelativeDate(new Date().toISOString()) // => "today"
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffInDays === 0) return 'today'
  if (diffInDays === 1) return 'yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

/**
 * Format a date string as an abbreviated date (e.g., "Jan 15, 2024")
 *
 * @param dateString - ISO date string to format
 * @returns Abbreviated date string
 *
 * @example
 * formatAbbreviatedDate('2024-01-15T00:00:00Z') // => "Jan 15, 2024"
 */
export const formatAbbreviatedDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy')
}

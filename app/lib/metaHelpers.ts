/**
 * Create standardized page metadata for consistent SEO across the site.
 *
 * @param title - Page title (e.g., "Bio", "Writing", "Crafting")
 * @param description - Page description for meta tags
 * @returns Array of meta objects for React Router meta function
 *
 * @example
 * export const meta: Route.MetaFunction = () =>
 *   createPageMeta('Bio', 'About Jason Kuhrt')
 */
export const createPageMeta = (
  title: string,
  description: string,
) => {
  return [
    { title: `${title} | Jason Kuhrt` },
    { name: 'description', content: description },
  ]
}

/**
 * Create metadata for the home page (no suffix)
 *
 * @param description - Page description for meta tags
 * @returns Array of meta objects for React Router meta function
 */
export const createHomePageMeta = (description: string) => {
  return [
    { title: 'Jason Kuhrt' },
    { name: 'description', content: description },
  ]
}

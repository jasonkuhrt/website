import { SiteMetadata } from '../../src/content/site.js'

/**
 * Site Metadata
 *
 * Core site configuration and metadata.
 */
export const site = SiteMetadata.make({
  title: 'KUHRT',
  description: 'Personal website of Jason Kuhrt',
})

export const siteTitle = site.title
export const siteDescription = site.description

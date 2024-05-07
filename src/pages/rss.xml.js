import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { siteTitle, siteDescription } from '../consts'

export async function GET(context) {
  const posts = await getCollection('writing')
  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/writing/${post.slug}/`,
    })),
  })
}

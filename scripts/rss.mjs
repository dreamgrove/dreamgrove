import { writeFileSync } from 'fs'
import { escape } from '../lib/utils/htmlEscaper.mjs'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

const byDateDesc = (a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0)

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
    ${post.date ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : ''}
    ${config.email ? `<author>${config.email} (${config.author})</author>` : ''}
    ${post.tags ? post.tags.map((t) => `<category>${t}</category>`).join('') : ''}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      ${config.email ? `<managingEditor>${config.email} (${config.author})</managingEditor>` : ''}
      ${config.email ? `<webMaster>${config.email} (${config.author})</webMaster>` : ''}
      <lastBuildDate>${new Date(posts[0].date || Date.now()).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true)
  if (publishPosts.length > 0) {
    const rss = generateRss(config, [...publishPosts].sort(byDateDesc), page)
    writeFileSync(`./public/${page}`, rss)
  }
}

const rss = () => {
  generateRSS(siteMetadata, allBlogs)
  console.log('RSS feed generated...')
}
export default rss

import { MetadataRoute } from 'next'
import { allBlogs, allDungeons, allRaids } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft && !post.slug.startsWith('test/'))
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date || new Date().toISOString().split('T')[0],
    }))

  const dungeonRoutes = allDungeons
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: new Date().toISOString().split('T')[0],
    }))

  const raidRoutes = allRaids
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: new Date().toISOString().split('T')[0],
    }))

  const routes = ['', 'blog', 'dungeons', 'raids', 'changelog', 'about', 'planner'].map(
    (route) => ({
      url: `${siteUrl}/${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    })
  )

  return [...routes, ...blogRoutes, ...dungeonRoutes, ...raidRoutes]
}

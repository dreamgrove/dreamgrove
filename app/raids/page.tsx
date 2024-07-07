import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs, allDungeons, allRaids } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import DungeonListLayout from '@/layouts/DungeonListLayout'
import RaidListLayout from '@/layouts/RaidListLayout'

const POSTS_PER_PAGE = 8

export const metadata = genPageMetadata({ title: 'Raids' })

export default function BlogPage() {
  const posts = allCoreContent(allRaids)
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <RaidListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Raids"
    />
  )
}

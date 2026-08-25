import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent } from '@/lib/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/(root)/seo'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({
  title: 'Blog',
  description:
    'Druid guides and compendiums for World of Warcraft — Balance, Feral, Guardian, and Restoration theorycrafting kept up to date by the Dreamgrove community.',
})

export default function BlogPage() {
  const posts = allCoreContent(allBlogs)
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
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}

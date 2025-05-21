import { allCoreContent } from 'pliny/utils/contentlayer'
import { allDungeons } from 'contentlayer/generated'
import DungeonListLayout from '@/layouts/DungeonListLayout'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allDungeons.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const posts = allCoreContent(allDungeons)
  const pageNumber = parseInt(params.page as string)
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <DungeonListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Dungeons"
    />
  )
}

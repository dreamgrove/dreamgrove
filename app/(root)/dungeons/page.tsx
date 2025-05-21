import { allCoreContent } from 'pliny/utils/contentlayer'
import { allDungeons } from 'contentlayer/generated'
import { genPageMetadata } from 'app/(root)/seo'
import DungeonListLayout from '@/layouts/DungeonListLayout'
import PageWrapper from '@/components/PageWrapper'

const POSTS_PER_PAGE = 8

export const metadata = genPageMetadata({ title: 'Dungeons' })

export default function DungeonPage() {
  const posts = allCoreContent(allDungeons)
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
    <PageWrapper>
      <DungeonListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="Dungeons"
      />
    </PageWrapper>
  )
}

import { allCoreContent } from 'pliny/utils/contentlayer'
import { allRaids } from 'contentlayer/generated'
import { genPageMetadata } from 'app/(root)/seo'
import RaidListLayout from '@/layouts/RaidListLayout'
import PageWrapper from '@/components/PageWrapper'

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
    <PageWrapper>
      <RaidListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="Raids"
      />
    </PageWrapper>
  )
}

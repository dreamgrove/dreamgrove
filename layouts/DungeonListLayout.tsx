import { CoreContent } from 'pliny/utils/contentlayer'
import type { Dungeons } from 'contentlayer/generated'
import InstanceCard from '@/components/custom/Dungeons/InstanceCard'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface DungeonLayoutProps {
  posts: CoreContent<Dungeons>[]
  title: string
  initialDisplayPosts?: CoreContent<Dungeons>[]
  pagination?: PaginationProps
}

export default function DungeonListLayout({
  posts,
  title,
  initialDisplayPosts = [],
}: DungeonLayoutProps) {
  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-6 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            {title}
          </h1>
        </div>
        <ul className="grid grid-cols-1 gap-4 pt-8 md:grid-cols-2">
          {!posts.length && 'No posts found.'}
          {displayPosts.map((post) => {
            const { path, title, headerImage } = post
            return (
              <li key={path}>
                <InstanceCard title={title} headerImage={`${headerImage}`} path={path} />
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

import { CoreContent } from '@/lib/utils/contentlayer'
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
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="px-3 sm:px-6 md:px-6 lg:px-6 xl:px-3">
      {!posts.length && (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400">No posts found.</div>
      )}

      <ul className="grid grid-cols-1 gap-5 pb-16 md:grid-cols-2 md:gap-6">
        {displayPosts.map((post, i) => {
          const { path, title, headerImage } = post
          return (
            <li key={path}>
              <InstanceCard
                title={title}
                headerImage={`${headerImage}`}
                path={path}
                index={i + 1}
                variant="dungeon"
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

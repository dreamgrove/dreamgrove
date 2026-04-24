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
      <header className="flex flex-col items-center pt-6 pb-10 text-center">
        <h1 className="instance-index__title text-4xl text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
          {title}
        </h1>
        <div className="instance-index__rule mt-6">
          <span className="line" />
          <span className="diamond" />
          <span className="line" />
        </div>
      </header>

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

import { CoreContent } from 'pliny/utils/contentlayer'
import type { Raids } from 'contentlayer/generated'
import InstanceCard from '@/components/custom/Dungeons/InstanceCard'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface RaidLayoutProps {
  posts: CoreContent<Raids>[]
  title: string
  initialDisplayPosts?: CoreContent<Raids>[]
  pagination?: PaginationProps
}

export default function RaidListLayout({
  posts,
  title,
  initialDisplayPosts = [],
}: RaidLayoutProps) {
  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="divide-y divide-gray-200 px-4 dark:divide-gray-700 sm:px-6 md:px-6 lg:px-6 xl:px-3">
        <div className="space-y-2 pb-6 pt-0 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
            {title}
          </h1>
        </div>
        <ul className="grid grid-cols-1 gap-8 pt-10 md:grid-cols-1">
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

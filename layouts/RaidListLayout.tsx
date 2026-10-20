import { CoreContent } from '@/lib/utils/contentlayer'
import type { Raids } from 'contentlayer/generated'
import InstanceCard from '@/components/custom/Dungeons/InstanceCard'
import InstanceListLayout from './InstanceListLayout'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface RaidListLayoutProps {
  posts: CoreContent<Raids>[]
  title: string
  initialDisplayPosts?: CoreContent<Raids>[]
  pagination?: PaginationProps
}

export default function RaidListLayout({ posts, initialDisplayPosts = [] }: RaidListLayoutProps) {
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <InstanceListLayout title="Raids" empty={!posts.length}>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0">
        {displayPosts.map((post) => (
          <li key={post.path}>
            <InstanceCard
              title={post.title}
              headerImage={`${post.headerImage}`}
              path={post.path}
              variant="raid"
            />
          </li>
        ))}
      </ul>
    </InstanceListLayout>
  )
}

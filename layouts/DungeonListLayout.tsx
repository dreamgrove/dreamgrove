import { CoreContent } from '@/lib/utils/contentlayer'
import type { Dungeons } from 'contentlayer/generated'
import InstanceCard from '@/components/custom/Dungeons/InstanceCard'
import InstanceListLayout from './InstanceListLayout'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface DungeonListLayoutProps {
  posts: CoreContent<Dungeons>[]
  title: string
  initialDisplayPosts?: CoreContent<Dungeons>[]
  pagination?: PaginationProps
}

export default function DungeonListLayout({
  posts,
  initialDisplayPosts = [],
}: DungeonListLayoutProps) {
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <InstanceListLayout title="Mythic+ dungeons" empty={!posts.length}>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
        {displayPosts.map((post) => (
          <li key={post.path}>
            <InstanceCard
              title={post.title}
              headerImage={`${post.headerImage}`}
              path={post.path}
              variant="dungeon"
            />
          </li>
        ))}
      </ul>
    </InstanceListLayout>
  )
}

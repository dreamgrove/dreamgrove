import { CoreContent } from '@/lib/utils/contentlayer'
import type { Dungeons } from 'contentlayer/generated'
import InstanceCard from '@/components/custom/Dungeons/InstanceCard'
import InstanceListLayout from './InstanceListLayout'

interface DungeonListLayoutProps {
  posts: CoreContent<Dungeons>[]
}

export default function DungeonListLayout({ posts }: DungeonListLayoutProps) {
  return (
    <InstanceListLayout title="Mythic+ dungeons" empty={!posts.length}>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
        {posts.map((post) => (
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

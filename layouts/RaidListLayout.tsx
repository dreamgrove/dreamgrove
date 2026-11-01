import { CoreContent } from '@/lib/utils/contentlayer'
import type { Raids } from 'contentlayer/generated'
import InstanceCard from '@/components/custom/Dungeons/InstanceCard'
import InstanceListLayout from './InstanceListLayout'

interface RaidListLayoutProps {
  posts: CoreContent<Raids>[]
}

export default function RaidListLayout({ posts }: RaidListLayoutProps) {
  return (
    <InstanceListLayout title="Raids" empty={!posts.length}>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0">
        {posts.map((post) => (
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

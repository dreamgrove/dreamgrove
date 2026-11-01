import { allCoreContent } from '@/lib/utils/contentlayer'
import { allDungeons } from 'contentlayer/generated'
import { genPageMetadata } from '@/lib/seo'
import DungeonListLayout from '@/layouts/DungeonListLayout'
import PageWrapper from '@/components/PageWrapper'

export const metadata = genPageMetadata({
  title: 'Dungeons',
  description:
    'Mythic+ dungeon guides for World of Warcraft Druids — boss mechanics, routes, and spec-specific tips for every dungeon in the rotation.',
})

export default function DungeonPage() {
  return (
    <PageWrapper variant="redesign">
      <DungeonListLayout posts={allCoreContent(allDungeons)} />
    </PageWrapper>
  )
}

import { allCoreContent } from '@/lib/utils/contentlayer'
import { allRaids } from 'contentlayer/generated'
import { genPageMetadata } from '@/lib/seo'
import RaidListLayout from '@/layouts/RaidListLayout'
import PageWrapper from '@/components/PageWrapper'

export const metadata = genPageMetadata({
  title: 'Raids',
  description:
    'Raid guides for World of Warcraft Druids — boss-by-boss mechanics, cooldown planning, and spec-specific advice for current raid tiers.',
})

export default function RaidPage() {
  return (
    <PageWrapper variant="redesign">
      <RaidListLayout posts={allCoreContent(allRaids)} />
    </PageWrapper>
  )
}

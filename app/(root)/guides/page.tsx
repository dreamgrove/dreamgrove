import Icon from '@/components/Icon'
import Link from '@/components/Link'
import PageWrapper from '@/components/PageWrapper'
import GuideList from '@/components/spec/GuideList'
import InstanceCard from '@/components/custom/Dungeons/InstanceCard'
import { genPageMetadata } from 'app/(root)/seo'
import { getLatestHeaderImage, getOtherGuides } from '@/lib/guides'
import { allDungeons, allRaids } from 'contentlayer/generated'

export const dynamic = 'force-static'

export const metadata = genPageMetadata({
  title: 'Other Guides',
  description: 'Dungeon, raid and general Druid guides that are not specific to one spec.',
})

const indexes = [
  { title: 'Raids', path: 'raids', headerImage: getLatestHeaderImage(allRaids) },
  { title: 'Mythic+ dungeons', path: 'dungeons', headerImage: getLatestHeaderImage(allDungeons) },
]

export default function OtherGuidesPage() {
  const articles = getOtherGuides()

  return (
    <PageWrapper
      title="Other guides"
      showTitle={false}
      variant="redesign"
      crumb={{ label: 'Other guides', href: '/guides', color: '#ffffff' }}
    >
      <section className="dg-container pt-7 pb-16 sm:pb-[72px]">
        <Link href="/" className="dg-back">
          <Icon name="arrowLeftThin" size={14} />
          All specs
        </Link>
        {/* Visually hidden; the header crumb already names the page */}
        <h1 className="sr-only">Other guides</h1>
        <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
          {indexes.map((i) => (
            <li key={i.path}>
              <InstanceCard title={i.title} headerImage={i.headerImage ?? ''} path={i.path} />
            </li>
          ))}
        </ul>
        {articles.length > 0 && <GuideList guides={articles} title="Articles" color="#d57f43" />}
      </section>
    </PageWrapper>
  )
}

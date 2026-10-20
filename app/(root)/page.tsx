import PageWrapper from '@/components/PageWrapper'
import siteMetadata from '@/data/siteMetadata'
import { SPECS } from '@/data/specs'
import { getSpecArt } from '@/lib/specArt'
import Main from './Main'

// Force static generation
export const dynamic = 'force-static'

export const metadata = {
  title: { absolute: 'Dreamgrove – World of Warcraft Druid Guides & Theorycrafting' },
  description: siteMetadata.description,
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteMetadata.title,
  url: siteMetadata.siteUrl,
  description: siteMetadata.description,
}

export default function Page() {
  const tiles = SPECS.map(({ id, name, color, artPosition }) => ({
    id,
    name,
    color,
    artPosition,
    art: getSpecArt(id),
  }))

  return (
    <PageWrapper title="Main" showTitle={false} variant="redesign">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Main tiles={tiles} />
    </PageWrapper>
  )
}

import PageWrapper from '@/components/PageWrapper'
import siteMetadata from '@/data/siteMetadata'
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
  return (
    <PageWrapper title="Main" showTitle={false}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Main />
    </PageWrapper>
  )
}

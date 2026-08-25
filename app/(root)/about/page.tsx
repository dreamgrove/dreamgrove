import { About, allAbouts } from 'contentlayer/generated'
import { MDXLayoutRenderer } from '@/components/MDXLayoutRenderer'
import AboutLayout from '@/layouts/AboutLayout'
import { coreContent } from '@/lib/utils/contentlayer'
import { genPageMetadata } from 'app/(root)/seo'
import PageWrapper from '@/components/PageWrapper'
export const metadata = genPageMetadata({
  title: 'About',
  description:
    'About Dreamgrove — the community hub for World of Warcraft Druid guides, theorycrafting, and discussion.',
})

export default function Page() {
  const about = allAbouts.find((p) => p.slug === 'about') as About
  const mainContent = coreContent(about)

  return (
    <PageWrapper title="About" showTitle={false}>
      <AboutLayout content={mainContent}>
        <MDXLayoutRenderer code={about.body.code} />
      </AboutLayout>
    </PageWrapper>
  )
}

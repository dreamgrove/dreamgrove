import { About, allAbouts } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AboutLayout from '@/layouts/AboutLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/(root)/seo'
import PageWrapper from '@/components/PageWrapper'
import { components } from '@/components/MDXComponents'
export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const about = allAbouts.find((p) => p.slug === 'about') as About
  const mainContent = coreContent(about)

  return (
    <PageWrapper title="About" showTitle={false}>
      <AboutLayout content={mainContent}>
        <MDXLayoutRenderer components={components} code={about.body.code} />
      </AboutLayout>
    </PageWrapper>
  )
}

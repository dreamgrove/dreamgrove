import { Changelog, allChangelogs } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import ChangelogLayout from '@/layouts/ChangelogLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/(root)/seo'
import { components } from '@/components/MDXComponents'
import PageWrapper from '@/components/PageWrapper'

export const metadata = genPageMetadata({ title: 'Druid Changelog' })

export default function Page() {
  const about = allChangelogs.find((p) => p.slug === 'changelog') as Changelog
  const mainContent = coreContent(about)

  return (
    <PageWrapper title="Druid Changelog">
      <ChangelogLayout content={mainContent}>
        <MDXLayoutRenderer code={about.body.code} components={components} />
      </ChangelogLayout>
    </PageWrapper>
  )
}

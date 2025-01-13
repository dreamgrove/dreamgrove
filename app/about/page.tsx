import { About, allAbouts } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AboutLayout from '@/layouts/AboutLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const about = allAbouts.find((p) => p.slug === 'about') as About
  const mainContent = coreContent(about)

  return (
    <>
      <AboutLayout content={mainContent}>
        <MDXLayoutRenderer code={about.body.code} />
      </AboutLayout>
    </>
  )
}

import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allRaids } from 'contentlayer/generated'
import type { Raids } from 'contentlayer/generated'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import DungeonLayout from '@/layouts/DungeonLayout'
import PageWrapper from '@/components/PageWrapper'

const defaultLayout = 'DungeonLayout'
const layouts = {
  DungeonLayout,
}

// Define a type for our layout keys
type LayoutKey = keyof typeof layouts

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  if (process.env.NODE_ENV === 'development') {
    return undefined
  }

  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allRaids.find((p) => p.slug === slug)

  if (!post) {
    return
  }

  const imageList = [siteMetadata.socialBanner]
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      url: './',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  return allRaids.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}
export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const sortedCoreContents = allCoreContent(allRaids)
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)

  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allRaids.find((p) => p.slug === slug) as Raids

  const mainContent = coreContent(post)
  const jsonLd = post.structuredData

  const Layout = layouts[(post.layout || defaultLayout) as LayoutKey]
  const pageTitle = post.title || `Raid: ${slug}`

  return (
    <PageWrapper title={pageTitle} showTitle={false}>
      <Layout content={mainContent} next={next} prev={prev} showTitle={false} authorDetails={[]}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </PageWrapper>
  )
}

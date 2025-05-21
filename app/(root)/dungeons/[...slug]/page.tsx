import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allDungeons } from 'contentlayer/generated'
import type { Dungeons } from 'contentlayer/generated'
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

// Add static generation option with ISR to prevent build failures
export const dynamic = 'force-static'

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allDungeons.find((p) => p.slug === slug)

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
  try {
    return allDungeons.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
  } catch (error) {
    console.error('Error generating static params for dungeons:', error)
    return []
  }
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  try {
    const params = await props.params
    const slug = decodeURI(params.slug.join('/'))
    const sortedCoreContents = allCoreContent(allDungeons)
    const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)

    if (postIndex === -1) {
      return notFound()
    }

    const prev = sortedCoreContents[postIndex + 1]
    const next = sortedCoreContents[postIndex - 1]
    const post = allDungeons.find((p) => p.slug === slug) as Dungeons

    const mainContent = coreContent(post)
    const jsonLd = post.structuredData

    const Layout = layouts[(post.layout || defaultLayout) as LayoutKey]
    const pageTitle = post.title || `Dungeon: ${slug}`

    return (
      <PageWrapper title={pageTitle} showTitle={false}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Layout content={mainContent} next={next} prev={prev} authorDetails={[]}>
          <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
        </Layout>
      </PageWrapper>
    )
  } catch (error) {
    console.error(`Error rendering dungeon page for slug: ${props.params}`, error)
    return (
      <PageWrapper title="Error Loading Dungeon Page" showTitle={true}>
        <div className="prose dark:prose-invert max-w-none pt-8 pb-8">
          <p>There was an error loading this dungeon page. Please try again later.</p>
        </div>
      </PageWrapper>
    )
  }
}

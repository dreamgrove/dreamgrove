import 'katex/dist/katex.css'

import { MDXLayoutRenderer } from '@/components/MDXLayoutRenderer'
import { coreContent, allCoreContent } from '@/lib/utils/contentlayer'
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
  if (process.env.NODE_ENV === 'development') {
    return undefined
  }

  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allDungeons.find((p) => p.slug === slug)

  if (!post) {
    return
  }

  const imageList = post.headerImage
    ? [`/static/images/${post.headerImage}`]
    : [siteMetadata.socialBanner]
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

function getDungeonPageData(slug: string) {
  const sortedCoreContents = allCoreContent(allDungeons)
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)

  if (postIndex === -1) {
    return null
  }

  const post = allDungeons.find((p) => p.slug === slug) as Dungeons

  return {
    post,
    prev: sortedCoreContents[postIndex + 1],
    next: sortedCoreContents[postIndex - 1],
    mainContent: coreContent(post),
    jsonLd: post.structuredData,
    pageTitle: post.title || `Dungeon: ${slug}`,
  }
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))

  let pageData: ReturnType<typeof getDungeonPageData> = null
  let loadFailed = false

  try {
    pageData = getDungeonPageData(slug)
  } catch (error) {
    console.error(`Error loading dungeon page for slug: ${slug}`, error)
    loadFailed = true
  }

  if (loadFailed) {
    return (
      <PageWrapper title="Error Loading Dungeon Page" showTitle={true}>
        <div className="prose dark:prose-invert max-w-none pt-8 pb-8">
          <p>There was an error loading this dungeon page. Please try again later.</p>
        </div>
      </PageWrapper>
    )
  }

  if (!pageData) {
    return notFound()
  }

  const { post, prev, next, mainContent, jsonLd, pageTitle } = pageData
  const Layout = layouts[(post.layout || defaultLayout) as LayoutKey]

  return (
    <PageWrapper title={pageTitle} showTitle={false}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">{pageTitle}</h1>
      <Layout content={mainContent} next={next} prev={prev} authorDetails={[]}>
        <MDXLayoutRenderer code={post.body.code} toc={post.toc} />
      </Layout>
    </PageWrapper>
  )
}

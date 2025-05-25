import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import type { Blog } from 'contentlayer/generated'
import PostLayout from '@/layouts/PostLayout'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import PageWrapper from '@/components/PageWrapper'

const defaultLayout = 'PostLayout'
const layouts: Record<string, React.ComponentType<any>> = {
  PostLayout,
}

interface Chapter {
  value: string
  depth: number
  url: string
}

type Params = Promise<{ slug: string[] }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata | undefined> {
  if (process.env.NODE_ENV === 'development') {
    return undefined
  }

  const props = await params
  const slug = decodeURI(props.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)

  const authorList = post?.authors || ['default']
  if (!post) {
    return
  }

  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
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
      authors: authorList.length > 0 ? authorList : [siteMetadata.author],
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
  return allBlogs.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}
export default async function Page(props: { params: Promise<Params> }): Promise<React.ReactNode> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))

  const sortedCoreContents = allCoreContent(allBlogs)

  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)

  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]

  const post = allBlogs.find((p) => p.slug === slug) as Blog

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => author)

  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((name) => {
    return {
      '@type': 'Person',
      name,
    }
  })

  const Layout = layouts[post.layout || defaultLayout]
  const pageTitle =
    typeof post.title === 'string' && post.title.trim() !== ''
      ? post.title.trim()
      : `Blog Post: ${slug}`

  const result = (
    <PageWrapper toc={post.toc as unknown as Chapter[]} title={pageTitle} isBlog={true}>
      <Layout
        content={mainContent}
        toc={post.toc}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
        translator={post.translator}
      >
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </PageWrapper>
  )

  return result
}

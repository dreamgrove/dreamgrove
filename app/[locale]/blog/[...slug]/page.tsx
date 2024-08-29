import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import type { Blog } from 'contentlayer/generated'
import { useRouter } from 'next/navigation' // Import the useRouter hook
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
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
  // Filter to generate static paths only for specific locales
  return allBlogs
    .filter((p) => ['en', 'kr'].includes(p.locale)) // Adjust based on your supported locales
    .map((p) => ({
      locale: p.locale,
      slug: p.slug.split('/').map((name) => decodeURI(name)),
    }))
}

export default function Page({ params }: { params: { locale: string; slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))

  const blogPath = params.locale === 'en' ? `/blog/${slug}` : `/${params.locale}/blog/${slug}`

  const post = allBlogs.find((p) => p.url_path === blogPath && p.locale === params.locale)

  if (!post) {
    return notFound()
  }

  // Handle previous and next posts for navigation
  const sortedCoreContents = allCoreContent(allBlogs)
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => author)

  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((name) => ({
    '@type': 'Person',
    name,
  }))

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}

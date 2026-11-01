import { MDXLayoutRenderer } from '@/components/MDXLayoutRenderer'
import { coreContent, findPublished, slugParams } from '@/lib/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import PostLayout from '@/layouts/PostLayout'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import PageWrapper from '@/components/PageWrapper'
import { getCheckboxDefaults } from '@/lib/utils/checkboxDefaults'
import { localeFromPath } from '@/lib/pageLocale'
import { jsonLdHtml } from '@/lib/utils/jsonLd'
import { genArticleMetadata } from '@/lib/seo'

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
  const { slug: slugSegments } = await params
  const post = findPublished(allBlogs, slugSegments)
  if (!post) {
    return
  }
  const slug = post.slug
  const authorList = post.authors || ['default']

  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const article = genArticleMetadata({
    title: post.title,
    summary: post.summary,
    images: imageList,
    authors: authorList.length > 0 ? authorList : [siteMetadata.author],
  })

  // Link the English and Korean versions of the same guide via hreflang
  const isKorean = slug.includes('kr/')
  const englishSlug = isKorean ? slug.replace('kr/', '') : slug
  const koreanSlug = isKorean ? slug : slug.replace(/([^/]+)$/, 'kr/$1')
  const hasEnglish = allBlogs.some((p) => p.slug === englishSlug && !p.draft)
  const hasKorean = allBlogs.some((p) => p.slug === koreanSlug && !p.draft)
  const languages: Record<string, string> = {}
  if (hasEnglish && hasKorean) {
    languages['en'] = `${siteMetadata.siteUrl}/blog/${englishSlug}`
    languages['ko'] = `${siteMetadata.siteUrl}/blog/${koreanSlug}`
    languages['x-default'] = languages['en']
  }

  // Keep the test compendium out of search engines
  const isTestPage = slug.startsWith('test/')

  return {
    ...article,
    ...(isTestPage && { robots: { index: false, follow: false } }),
    alternates: {
      canonical: './',
      ...(Object.keys(languages).length > 0 && { languages }),
    },
  }
}

export const generateStaticParams = () => slugParams(allBlogs)

export default async function Page({ params }: { params: Params }): Promise<React.ReactNode> {
  const post = findPublished(allBlogs, (await params).slug)
  if (!post) {
    return notFound()
  }
  const slug = post.slug

  const authorDetails = post.authors || ['default']
  const jsonLd = {
    ...post.structuredData,
    author: authorDetails.map((name) => ({ '@type': 'Person', name })),
  }

  const pageTitle =
    typeof post.title === 'string' && post.title.trim() !== ''
      ? post.title.trim()
      : `Blog Post: ${slug}`

  // English stays undefined: it is also the page's lang attribute, which English pages never set
  const contentLang = localeFromPath(slug) === 'ko' ? 'ko' : undefined

  return (
    <PageWrapper
      toc={post.toc as unknown as Chapter[]}
      title={pageTitle}
      isBlog={post.kind === 'compendium'}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />
      <div lang={contentLang}>
        <PostLayout
          content={coreContent(post)}
          toc={post.toc}
          authorDetails={authorDetails}
          checkboxDefaults={getCheckboxDefaults(post.body.raw)}
        >
          <MDXLayoutRenderer code={post.body.code} toc={post.toc} locale={contentLang} />
        </PostLayout>
      </div>
    </PageWrapper>
  )
}

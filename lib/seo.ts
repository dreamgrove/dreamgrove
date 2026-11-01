import type { Metadata, Viewport } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string

  [key: string]: any
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  return {
    title,
    description: description || siteMetadata.description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  }
}

const absoluteUrl = (img: string) => (img.includes('http') ? img : siteMetadata.siteUrl + img)

interface ArticleMetadataInput {
  title: string
  summary?: string
  /** Site-relative or absolute image URLs; defaults to the social banner. */
  images?: string[]
  authors?: string[]
}

/** Title, description, Open Graph and Twitter card for a guide or blog post page. */
export function genArticleMetadata({
  title,
  summary,
  images,
  authors,
}: ArticleMetadataInput): Metadata {
  const imageList = images?.length ? images : [siteMetadata.socialBanner]
  return {
    title,
    description: summary,
    openGraph: {
      title,
      description: summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      url: './',
      images: imageList.map((img) => ({ url: absoluteUrl(img) })),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: summary,
      images: imageList,
    },
  }
}

/** Site-wide defaults shared by the (root) and (planner) root layouts. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
  icons: {
    icon: [
      { url: '/static/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/static/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/static/favicons/apple-touch-icon.png', sizes: '76x76' },
    other: { rel: 'mask-icon', url: '/static/favicons/safari-pinned-tab.svg', color: '#5bbad5' },
  },
  manifest: '/static/favicons/site.webmanifest',
  other: { 'msapplication-TileColor': '#000000' },
}

export const rootViewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
}

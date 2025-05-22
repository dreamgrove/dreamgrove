import 'css/tailwind.css'
import 'css/april-fools.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Space_Grotesk } from 'next/font/google'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { Providers } from '../(root)/providers'
import ThemeProviders from '../(root)/theme-providers'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
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
}

interface LayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  const scriptSrc = 'https://wow.zamimg.com/js/tooltips.js'

  return (
    <html
      lang={siteMetadata.language}
      className={`${space_grotesk.variable} w-screen overflow-clip`}
      style={{ scrollbarGutter: 'auto' }}
      suppressHydrationWarning
    >
      <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/static/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <body
        className="flex h-full w-screen overflow-hidden bg-[#F2F3F4] text-black antialiased dark:bg-[#282828] dark:text-white"
        suppressHydrationWarning
      >
        <div className="flex h-full flex-col" style={{ paddingLeft: 0 }}>
          <Providers>
            <ThemeProviders>
              <main className="max-h-screen">{children}</main>
            </ThemeProviders>
          </Providers>
        </div>
        <Script src="/static/scripts/tooltip.js" strategy="afterInteractive" />
        <Script src={scriptSrc} strategy="beforeInteractive" />
      </body>
    </html>
  )
}

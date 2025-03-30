import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import SectionContainer from '@/components/SectionContainer'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from '../theme-providers'
import { PageTitleProvider } from '@/components/custom/PageTitleContext'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Footer from '@/components/Footer'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: siteMetadata.title,
  description: siteMetadata.description,
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const scriptSrc = 'https://wow.zamimg.com/js/tooltips.js'

  return (
    <>
      <ThemeProviders>
        <Analytics />
        <SectionContainer>
          <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
            <main className="mb-auto">{children}</main>
          </SearchProvider>
          <Footer />
        </SectionContainer>
      </ThemeProviders>
      <Script src="/static/scripts/tooltip.js" strategy="afterInteractive" />
      <Script src={scriptSrc} strategy="beforeInteractive" />
    </>
  )
}

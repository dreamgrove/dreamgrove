import 'css/tailwind.css'
import 'remark-github-blockquote-alert/alert.css'

import { Geist } from 'next/font/google'
import Footer from '@/components/Footer'
import FooterGate from '@/components/FooterGate'
import siteMetadata from '@/data/siteMetadata'
import ThemeProviders from './theme-providers'
import { rootMetadata, rootViewport } from '@/lib/seo'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
})

export const metadata = rootMetadata
export const viewport = rootViewport

interface LayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  const scriptSrc = 'https://wow.zamimg.com/js/tooltips.js'

  return (
    <html lang={siteMetadata.language} className={geist.variable} suppressHydrationWarning>
      <body className="flex h-full bg-[#F2F3F4] text-black antialiased dark:bg-[#282828] dark:text-white">
        <div className="flex min-h-screen w-full flex-col" style={{ paddingLeft: 0 }}>
          <ThemeProviders>
            <Analytics />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black dark:focus:bg-black dark:focus:text-white"
            >
              Skip to main content
            </a>
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <FooterGate>
              <Footer />
            </FooterGate>
          </ThemeProviders>
        </div>
        <Script src="/static/scripts/tooltip.js" strategy="beforeInteractive" />
        <Script src={scriptSrc} strategy="lazyOnload" />
      </body>
    </html>
  )
}

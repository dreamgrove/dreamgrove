import 'css/tailwind.css'
import 'remark-github-blockquote-alert/alert.css'

import siteMetadata from '@/data/siteMetadata'
import { rootMetadata, rootViewport } from '@/lib/seo'
import Script from 'next/script'
import ThemeProviders from '../(root)/theme-providers'
import ScreenWidthWarning from '@/components/ScreenWidthWarning'
import TimelineHeader from '@/components/TimelinePlanner/TimelineHeader'

export const metadata = rootMetadata
export const viewport = rootViewport

interface LayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  const scriptSrc = 'https://wow.zamimg.com/js/tooltips.js'

  return (
    <html
      lang={siteMetadata.language}
      className="w-screen overflow-clip"
      style={{ paddingLeft: 0, paddingRight: 0, scrollbarGutter: 'auto' }}
      suppressHydrationWarning
    >
      <body className="bg-[#F2F3F4] text-black antialiased dark:bg-dg-panel dark:text-white">
        <div
          className="flex h-screen flex-col overflow-y-auto"
          style={{ paddingLeft: 0, scrollbarGutter: 'stable' }}
        >
          <ThemeProviders>
            <TimelineHeader />
            <main className="flex-1">{children}</main>
            <ScreenWidthWarning />
          </ThemeProviders>
        </div>
        <Script src="/static/scripts/tooltip.js" strategy="beforeInteractive" />
        <Script src={scriptSrc} strategy="afterInteractive" />
      </body>
    </html>
  )
}

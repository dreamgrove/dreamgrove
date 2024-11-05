import { NextRequest, NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

const locales = ['en-US', 'ko-KR']
const defaultLocale = 'en-US'

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the path is within /blog and ends with /compendium
  const isCompendiumPage =
    pathname.startsWith('/blog') &&
    (pathname.endsWith('/compendium') || pathname.includes('/compendium/'))

  if (isCompendiumPage) {
    const locale = getLocale(request)
    const pathnameIsMissingLocale = locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/blog/compendium`) &&
        !pathname.includes(`/${locale}/blog/compendium/`)
    )

    if (pathnameIsMissingLocale) {
      return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
    }
  }
}

export const config = {
  matcher: ['/blog', '/blog/**'], // Apply middleware only to /blog and its sub-paths
}

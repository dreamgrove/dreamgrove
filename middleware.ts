import { NextRequest, NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

const locales = ['en-US', 'fr', 'nl-NL']
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
  const isCompendiumPage = pathname.startsWith('/blog') && pathname.endsWith('/compendium')

  // Check if the pathname already has a locale prefix
  const hasLocalePrefix = locales.some((locale) => pathname.startsWith(`/${locale}/`))

  if (isCompendiumPage && !hasLocalePrefix) {
    const locale = getLocale(request)
    const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Return NextResponse.next() for paths that don't match or already have a locale
  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*/compendium', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

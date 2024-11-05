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
  const isCompendiumPage = pathname.endsWith('/compendium') || pathname.includes('/compendium/')

  if (isCompendiumPage) {
    const locale = getLocale(request)
    const pathnameIsMissingLocale = locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/compendium`) &&
        !pathname.includes(`/${locale}/compendium/`)
    )

    if (pathnameIsMissingLocale) {
      return NextResponse.redirect(new URL(`/${locale}/compendium`, request.url))
    }
  }
}

export const config = {
  matcher: ['**/compendium', '**/compendium/**'], // Match any path ending in /compendium or nested under it
}

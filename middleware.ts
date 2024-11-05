import { NextRequest, NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

const locales = ['en-US', 'fr', 'nl-NL']
const defaultLocale = 'en-US'

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const matchedLocale = match(languages, locales, defaultLocale)
  console.log('Detected locale:', matchedLocale)
  return matchedLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log('Requested pathname:', pathname)

  // Check if the path is within /blog and ends with /compendium
  const isCompendiumPage = pathname.startsWith('/blog') && pathname.endsWith('/compendium')
  console.log('Is Compendium Page:', isCompendiumPage)

  // Check if the pathname already has a locale prefix
  const hasLocalePrefix = locales.some((locale) => pathname.startsWith(`/${locale}/`))
  console.log('Has Locale Prefix:', hasLocalePrefix)

  if (isCompendiumPage && !hasLocalePrefix) {
    const locale = getLocale(request)
    const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
    console.log('Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }

  // Log if no redirect is necessary and proceed normally
  console.log('No redirect needed, continuing to:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*/compendium', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

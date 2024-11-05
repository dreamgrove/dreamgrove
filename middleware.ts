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
  const fullPath = request.url // Use the full URL instead of pathname
  console.log('Full URL:', fullPath)

  // Extract the path from the full URL
  const urlPath = new URL(fullPath).pathname
  console.log('URL Path:', urlPath)

  // Check if the path is within /blog and ends with /compendium
  const isCompendiumPage = urlPath.includes('/blog') && urlPath.endsWith('/compendium')
  console.log('Is Compendium Page:', isCompendiumPage)

  // Use a regular expression to check if the urlPath has a locale prefix
  const localePrefixRegex = new RegExp(`^/(${locales.join('|')})`)
  const hasLocalePrefix = localePrefixRegex.test(urlPath)
  console.log('Has Locale Prefix:', hasLocalePrefix)

  // Check if this is a prefetch request
  const isPrefetch = request.headers.get('x-middleware-prefetch') === '1'

  if (isCompendiumPage && !hasLocalePrefix && !isPrefetch) {
    const locale = getLocale(request)
    const redirectUrl = new URL(`/${locale}${urlPath}`, request.url)
    console.log('Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }

  // Log if no redirect is necessary and proceed normally
  console.log('No redirect needed, continuing to:', urlPath)
  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*/compendium', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

import { NextRequest, NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

const locales = ['en-US', 'ko-KR']
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
  const fullPath = request.url
  console.log('Full URL:', fullPath)

  const urlPath = new URL(fullPath).pathname
  console.log('URL Path:', urlPath)

  const isCompendiumPage = urlPath.endsWith('/compendium')
  console.log('Is Compendium Page:', isCompendiumPage)

  const localePrefixRegex = new RegExp(`/(en-US|ko-KR|kr)/`)
  const hasLocalePrefix = localePrefixRegex.test(urlPath)
  console.log('Has Locale Prefix:', hasLocalePrefix)

  const isPrefetch = request.headers.get('x-middleware-prefetch') === '1'

  if (isCompendiumPage && !hasLocalePrefix && !isPrefetch) {
    const locale = getLocale(request)

    if (locale === 'ko-KR') {
      const redirectUrl = new URL(
        `${urlPath.replace('/compendium', '/kr/compendium')}`,
        request.url
      )
      console.log('Redirecting to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    } else {
      console.log('Locale is not ko-KR, no redirect needed')
      return NextResponse.next()
    }
  }

  console.log('No redirect needed, continuing to:', urlPath)
  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*/compendium', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

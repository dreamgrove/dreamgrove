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

  if (pathname.endsWith('/compendium')) {
    const pathnameIsMissingLocale = locales.every((locale) => !pathname.startsWith(`/${locale}/`))

    if (pathnameIsMissingLocale) {
      const locale = getLocale(request)
      const newPath = `/${locale}${pathname}`

      // Only redirect if the path does not already contain the locale
      if (!pathname.startsWith(`/${locale}/`)) {
        return NextResponse.redirect(new URL(newPath, request.url))
      }
    }
  }

  // Your existing middleware logic for other routes
}

export const config = {
  matcher: ['/:path*/compendium', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

import { NextRequest, NextResponse } from 'next/server'

const supportedLocales = ['en', 'kr']
const defaultLocale = 'en'

function getPreferredLocale(acceptLanguage: string | null) {
  if (!acceptLanguage) return defaultLocale

  const languages = acceptLanguage.split(',').map((lang) => lang.split(';')[0].trim())

  for (const locale of languages) {
    if (supportedLocales.includes(locale)) {
      return locale
    }
  }

  return defaultLocale
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const localePattern = new RegExp(`^/(${supportedLocales.join('|')})/`)

  if (!localePattern.test(pathname)) {
    const preferredLocale = getPreferredLocale(req.headers.get('accept-language'))
    const redirectUrl = new URL(`/${preferredLocale}${pathname}`, req.url)

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/blog/:path*'],
}

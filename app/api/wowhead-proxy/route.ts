import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const targetUrl = searchParams.get('url')

    if (!targetUrl) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
    }

    // Only allow requests to wowhead.com domains
    if (!targetUrl.includes('wowhead.com')) {
      return NextResponse.json({ error: 'Only wowhead.com URLs are allowed' }, { status: 403 })
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    })

    const contentType = response.headers.get('content-type') || ''
    const isHtml = contentType.includes('text/html')

    if (isHtml) {
      const html = await response.text()
      return NextResponse.json({
        url: response.url,
        html,
      })
    } else {
      const data = await response.json()
      return NextResponse.json({
        url: response.url,
        data,
      })
    }
  } catch (error: any) {
    console.error('Wowhead proxy error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import spellData from '../../../spellData.json'
import { fetchWowheadData } from './utils'

export const runtime = 'nodejs'

// Server-side cache to reduce Wowhead requests
const cache = new Map<
  string,
  {
    icon?: string
    quality?: number
    display: string
    timestamp: number
  }
>()

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

// Quality colors for reference
const qualityToColor = {
  1: '#ffffff',
  2: '#1eff00',
  3: '#0070dd',
  4: '#a335ee',
  5: '#ff8000',
}

function formatUrl(url: string): string {
  const parts = url.split('/')
  const lastPart = parts.pop() || ''
  const formatted = lastPart
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  return formatted
}

function extractIdFromUrl(url: string): string {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  const id = lastPart.split('-')[0]
  return id
}

// Check if the request is coming from our own site
function isValidRequest(request: NextRequest): boolean {
  // In development, we'll allow localhost
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  // Get the referer header from the request
  const referer = request.headers.get('referer')

  if (!referer) {
    return false
  }

  try {
    const refererUrl = new URL(referer)
    const hostname = refererUrl.hostname

    // Allow requests from our domain or our other domains
    return (
      hostname === 'dreamgrove.gg' ||
      hostname.endsWith('.dreamgrove.gg') ||
      hostname === 'localhost'
    )
  } catch (error) {
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if this is a valid request from our frontend
    if (!isValidRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized: This API is for internal use only' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    const name = searchParams.get('name')
    const beta = searchParams.get('beta') === 'true'
    const customUrl = searchParams.get('url')

    if (!type) {
      return NextResponse.json({ error: 'Missing type parameter' }, { status: 400 })
    }

    // Handle cases where id is missing but we can find it
    let displayId = id
    const url = customUrl || ''

    if (!id && type === 'spell' && name) {
      // Try to find the spell in spellData
      const spellId = spellData[name]
      if (spellId) {
        displayId = spellId
      } else {
        return NextResponse.json({ error: 'Could not find spell ID' }, { status: 404 })
      }
    } else if (!id && !url) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    try {
      // Use the shared function to fetch Wowhead data
      const result = await fetchWowheadData({
        id: displayId || undefined,
        type,
        name: name || undefined,
        beta,
        url,
      })

      return NextResponse.json(result)
    } catch (fetchError: any) {
      console.error(`Error fetching Wowhead data:`, fetchError)
      return NextResponse.json(
        { error: `Failed to fetch from Wowhead: ${fetchError.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Wowhead data API error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}

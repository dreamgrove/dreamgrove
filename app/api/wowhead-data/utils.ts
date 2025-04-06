import fetch from 'node-fetch'

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
export const qualityToColor = {
  1: '#ffffff',
  2: '#1eff00',
  3: '#0070dd',
  4: '#a335ee',
  5: '#ff8000',
}

export function formatUrl(url: string): string {
  const parts = url.split('/')
  const lastPart = parts.pop() || ''
  const formatted = lastPart
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  return formatted
}

export function extractIdFromUrl(url: string): string {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  const id = lastPart.split('-')[0]
  return id
}

interface WowheadDataParams {
  id?: string
  type: string
  name?: string
  beta?: boolean
  url?: string
}

export async function fetchWowheadData({
  id,
  type,
  name,
  beta = false,
  url = '',
}: WowheadDataParams) {
  try {
    // Build the Wowhead URL
    let displayId = id
    let wowheadUrl = ''

    if (url) {
      wowheadUrl = url
      if (!displayId) {
        displayId = extractIdFromUrl(url)
      }
    } else {
      wowheadUrl = `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${displayId}`
    }

    // Generate cache key
    const cacheKey = `${type}-${displayId}${beta ? '-beta' : ''}`

    // Check cache first
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey)
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
        return cachedData
      }
    }

    // Fetch data from Wowhead
    const response = await fetch(wowheadUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`Wowhead returned status ${response.status}`)
    }

    const html = await response.text()

    // Prepare result
    const result: {
      icon?: string
      quality?: number
      display: string
      timestamp: number
    } = {
      display: name || formatUrl(response.url),
      timestamp: Date.now(),
    }

    // Extract icon
    const iconRegex = new RegExp(`"${displayId}":\\{"name_enus":"[^"]+".*?,"icon":"([^"]+)"`)
    const iconMatch = iconRegex.exec(html)
    if (iconMatch && iconMatch[1]) {
      result.icon = iconMatch[1]
    }

    // Extract quality for items
    if (type === 'item') {
      const qualityRegex = /<b class=\\"q(\d+)\\"/
      const qualityMatch = html.match(qualityRegex)
      if (qualityMatch && qualityMatch[1]) {
        result.quality = parseInt(qualityMatch[1])
      }
    }

    // Cache the result
    cache.set(cacheKey, result)

    return result
  } catch (error: any) {
    throw new Error(`Failed to fetch from Wowhead: ${error.message}`)
  }
}

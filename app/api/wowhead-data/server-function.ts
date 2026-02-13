import { extractIdFromUrl, formatUrl } from './utils'

// Dynamic require to avoid webpack bundling fs/path for client
function getCacheFile(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require('path')
  return path.join(process.cwd(), 'data', 'wowhead-cache.json')
}

interface CacheEntry {
  icon?: string
  quality?: number
  display: string
  timestamp: number
}

// In-memory cache, loaded from disk on first access
const cache = new Map<string, CacheEntry>()
let cacheLoaded = false

// Request deduplication: concurrent fetches for the same key share one Promise
const inflight = new Map<string, Promise<CacheEntry>>()

function loadCache() {
  if (cacheLoaded) return
  cacheLoaded = true
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs')
    const cacheFile = getCacheFile()
    if (fs.existsSync(cacheFile)) {
      const raw = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'))
      for (const [key, value] of Object.entries(raw)) {
        cache.set(key, value as CacheEntry)
      }
      console.log(`[wowhead-cache] Loaded ${cache.size} entries from disk`)
    }
  } catch (e) {
    console.warn('[wowhead-cache] Failed to load cache file, starting fresh:', e)
  }
}

function saveCache() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs')
    const obj: Record<string, CacheEntry> = Object.fromEntries(cache)
    fs.writeFileSync(getCacheFile(), JSON.stringify(obj, null, 2))
  } catch (e) {
    console.warn('[wowhead-cache] Failed to write cache file:', e)
  }
}

interface WowheadDataParams {
  id: string
  type: string
  name: string
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
  loadCache()

  // Build the Wowhead URL and determine displayId
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

  // Return from cache if available
  const cached = cache.get(cacheKey)
  if (cached) {
    return {
      ...cached,
      // Use caller-provided name if available, otherwise cached display
      display: name || cached.display,
    }
  }

  // Deduplicate concurrent requests for the same key
  const existing = inflight.get(cacheKey)
  if (existing) {
    const result = await existing
    return { ...result, display: name || result.display }
  }

  const promise = (async (): Promise<CacheEntry> => {
    try {
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

      const result: CacheEntry = {
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

      // Store in cache and persist
      cache.set(cacheKey, result)
      saveCache()
      console.log(`[wowhead-cache] Fetched and cached: ${cacheKey}`)

      return result
    } finally {
      inflight.delete(cacheKey)
    }
  })()

  inflight.set(cacheKey, promise)

  try {
    const result = await promise
    return { ...result, display: name || result.display }
  } catch (error: any) {
    throw new Error(`Failed to fetch from Wowhead: ${error.message}`)
  }
}

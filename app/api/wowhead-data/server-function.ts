'use server'

import fs from 'fs'
import path from 'path'
import { extractIdFromUrl, formatUrl } from './utils'

function getCacheFile(): string {
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
      const tooltipUrl = `https://nether.wowhead.com/tooltip/${type}/${displayId}`
      const response = await fetch(tooltipUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Wowhead returned status ${response.status}`)
      }

      const data = (await response.json()) as {
        name?: string | null
        icon?: string | null
        quality?: number | null
      }

      const result: CacheEntry = {
        display: name || data.name || formatUrl(wowheadUrl),
        timestamp: Date.now(),
      }

      if (data.icon) {
        result.icon = data.icon
      }

      if (type === 'item' && typeof data.quality === 'number' && data.quality >= 0) {
        result.quality = data.quality
      }

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

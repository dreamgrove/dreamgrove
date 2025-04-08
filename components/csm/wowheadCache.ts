// Client-side cache for Wowhead data
interface CachedWowheadData {
  url: string
  html?: string
  data?: any
  quality?: number
  linkColor?: string
  display?: string
  timestamp: number
}

type WowheadCacheEntry = {
  data: CachedWowheadData
  timestamp: number
}

// Cache TTL in milliseconds (1 hour)
const CACHE_TTL = 60 * 60 * 1000

// Use a global cache that persists across component remounts
// This needs to be outside React component lifecycle to persist across renders
const globalWowheadCache: Record<string, WowheadCacheEntry> = {}

// If we're in a browser environment, we can use localStorage as a fallback
const saveToLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      // Store only the entries that aren't expired
      const now = Date.now()
      const validEntries = Object.entries(globalWowheadCache).filter(
        ([_, entry]) => now - entry.timestamp < CACHE_TTL
      )

      const cacheToStore = Object.fromEntries(validEntries)
      localStorage.setItem('wowhead-cache', JSON.stringify(cacheToStore))
    } catch (error) {
      console.warn('Failed to save Wowhead cache to localStorage:', error)
    }
  }
}

// Load cache from localStorage on initial load
const loadFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('wowhead-cache')
      if (cached) {
        const parsedCache = JSON.parse(cached)

        // Only load entries that aren't expired
        const now = Date.now()
        Object.entries(parsedCache).forEach(([key, entry]: [string, any]) => {
          if (now - entry.timestamp < CACHE_TTL) {
            globalWowheadCache[key] = entry as WowheadCacheEntry
          }
        })
      }
    } catch (error) {
      console.warn('Failed to load Wowhead cache from localStorage:', error)
    }
  }
}

// Initialize cache from localStorage if available
if (typeof window !== 'undefined') {
  loadFromLocalStorage()
}

export const wowheadCache = {
  // Get data from cache, returns undefined if not found or expired
  get: (key: string): CachedWowheadData | undefined => {
    const entry = globalWowheadCache[key]

    // Return undefined if not in cache or expired
    if (!entry || Date.now() - entry.timestamp > CACHE_TTL) {
      return undefined
    }

    return entry.data
  },

  // Set data in cache
  set: (key: string, data: CachedWowheadData): void => {
    globalWowheadCache[key] = {
      data,
      timestamp: Date.now(),
    }

    // Save to localStorage as backup
    saveToLocalStorage()
  },

  // Generate consistent cache key for a URL
  generateKey: (url: string): string => {
    // Simple hash function for consistent keys
    let hash = 0
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return `wh-${hash}`
  },

  // Clear expired entries
  cleanup: (): void => {
    const now = Date.now()
    Object.keys(globalWowheadCache).forEach((key) => {
      if (now - globalWowheadCache[key].timestamp > CACHE_TTL) {
        delete globalWowheadCache[key]
      }
    })

    // Update localStorage
    saveToLocalStorage()
  },
}

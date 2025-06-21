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

import { WowheadApiParams, WowheadApiResponse } from '@/types/index'

const resultCache = new Map<string, WowheadApiResponse>()
const inflight = new Map<string, Promise<WowheadApiResponse>>()

function cacheKey({
  id,
  type,
  beta,
  url,
}: {
  id: string
  type: string
  beta: boolean
  url: string
}) {
  if (id) return `${type}-${id}${beta ? '-beta' : ''}`
  return `url:${url}${beta ? '-beta' : ''}`
}

function applyName(data: WowheadApiResponse, name: string): WowheadApiResponse {
  return name ? { ...data, display: name } : data
}

/**
 * Fetches Wowhead information via the API
 */
export async function getWowheadInfo({
  id = '',
  type = '',
  name = '',
  beta = false,
  url = '',
}: WowheadApiParams): Promise<WowheadApiResponse> {
  const key = cacheKey({ id, type, beta, url })

  const cached = resultCache.get(key)
  if (cached) return applyName(cached, name)

  const existing = inflight.get(key)
  if (existing) return applyName(await existing, name)

  const params = new URLSearchParams()
  if (id) params.append('id', id)
  if (type) params.append('type', type)
  if (name) params.append('name', name)
  if (beta) params.append('beta', 'true')
  if (url) params.append('url', url)

  const promise = (async (): Promise<WowheadApiResponse> => {
    try {
      const response = await fetch(`/api/get-wowhead-info?${params.toString()}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API returned status ${response.status}`)
      }
      const data = (await response.json()) as WowheadApiResponse
      resultCache.set(key, data)
      return data
    } finally {
      inflight.delete(key)
    }
  })()

  inflight.set(key, promise)
  return applyName(await promise, name)
}

// Quality colors mapping for convenience
export const qualityToColor = {
  1: '#ffffff', // Common/White
  2: '#1eff00', // Uncommon/Green
  3: '#0070dd', // Rare/Blue
  4: '#a335ee', // Epic/Purple
  5: '#ff8000', // Legendary/Orange
}

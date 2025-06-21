import { WowheadApiParams, WowheadApiResponse } from '@/types/index'

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
  // Build query parameters
  const params = new URLSearchParams()
  if (id) params.append('id', id)
  if (type) params.append('type', type)
  if (name) params.append('name', name)
  if (beta) params.append('beta', 'true')
  if (url) params.append('url', url)

  // Make the API request
  const response = await fetch(`/api/get-wowhead-info?${params.toString()}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `API returned status ${response.status}`)
  }

  return response.json()
}

// Quality colors mapping for convenience
export const qualityToColor = {
  1: '#ffffff', // Common/White
  2: '#1eff00', // Uncommon/Green
  3: '#0070dd', // Rare/Blue
  4: '#a335ee', // Epic/Purple
  5: '#ff8000', // Legendary/Orange
}

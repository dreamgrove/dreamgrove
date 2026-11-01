export interface WowheadApiParams {
  id?: string
  type?: string
  name?: string
  beta?: boolean
  url?: string
}

/** One Wowhead tooltip lookup, as cached on the server and returned by /api/get-wowhead-info. */
export interface WowheadApiResponse {
  icon?: string
  quality?: number
  display: string
  timestamp: number
}

export interface WowheadDataParams {
  id?: string
  type: string
  name?: string
  beta?: boolean
  url?: string
}

export interface WowheadApiParams {
  id?: string
  type?: string
  name?: string
  beta?: boolean
  url?: string
}

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

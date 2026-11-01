import 'server-only'

const TOKEN_URL = 'https://www.warcraftlogs.com/oauth/token'
const API_URL = 'https://www.warcraftlogs.com/api/v2/client'
// Refresh a little before the token actually expires.
const TOKEN_EXPIRY_MARGIN_MS = 60_000

/** A failed Warcraft Logs call, tagged with the step that failed for logging. */
export class WclError extends Error {
  constructor(
    public step: string,
    public status: number | null,
    public detail: string
  ) {
    super(`[${step}] ${status ?? '?'} ${detail}`)
  }
}

export function hasWarcraftLogsCredentials(): boolean {
  return !!process.env.WARCRAFT_LOGS_CLIENT_ID && !!process.env.WARCRAFT_LOGS_CLIENT_SECRET
}

async function failure(step: string, response: Response): Promise<WclError> {
  const body = await response.text().catch(() => '')
  return new WclError(step, response.status, body.slice(0, 400) || response.statusText)
}

let cachedToken: { value: string; expiresAt: number } | null = null

/** Client-credentials token, reused across requests until it is about to expire. */
async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value
  }

  const clientId = process.env.WARCRAFT_LOGS_CLIENT_ID
  const clientSecret = process.env.WARCRAFT_LOGS_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('Warcraft Logs API credentials are not configured')
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
    cache: 'no-store',
  })
  if (!response.ok) {
    throw await failure('oauth/token', response)
  }

  const data = (await response.json()) as { access_token: string; expires_in: number }
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - TOKEN_EXPIRY_MARGIN_MS,
  }
  return data.access_token
}

/** Runs a GraphQL query against the v2 client API. `step` names the call in errors. */
export async function queryWarcraftLogs(
  step: string,
  query: string,
  variables: Record<string, unknown> = {}
) {
  const token = await getToken()
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })
  if (!response.ok) {
    if (response.status === 401) cachedToken = null
    throw await failure(step, response)
  }

  const data = await response.json()
  if (data?.errors?.length) {
    throw new WclError(step, 200, `GraphQL error: ${JSON.stringify(data.errors).slice(0, 400)}`)
  }
  return data
}

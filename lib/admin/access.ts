// What the signed-in user may do in the CMS. Server only.
import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { getToken } from 'next-auth/jwt'
import { Octokit } from 'octokit'
import { canManageContent } from './github'

/**
 * The signed-in user's GitHub OAuth token, read from the encrypted session cookie.
 * It's kept out of the session object so it never reaches the browser.
 */
async function getAccessToken(): Promise<string | null> {
  // Only the cookie: getToken would also accept an `Authorization: Bearer` header
  const token = await getToken({ req: { cookies: await cookies(), headers: {} } as never })
  return token?.accessToken ?? null
}

interface GitHubContext {
  octokit: Octokit
  username: string
  canPush: boolean
  /** Write access or org membership: unlocks /cms and new pages */
  canManage: boolean
}

type Access = Omit<GitHubContext, 'octokit'>

// Resolving access costs three GitHub API calls, and one editor page load makes
// several requests, so the answer is kept briefly per token (by hash). A revoked
// token keeps its access for at most this long; GitHub rejects its writes anyway.
const ACCESS_TTL_MS = 5 * 60 * 1000
const accessCache = new Map<string, { access: Access; expires: number }>()

async function resolveAccess(octokit: Octokit, token: string): Promise<Access | null> {
  const key = createHash('sha256').update(token).digest('hex')
  const now = Date.now()
  const hit = accessCache.get(key)
  if (hit && hit.expires > now) return hit.access

  const user = await octokit.rest.users.getAuthenticated().catch(() => null)
  if (!user) return null
  const username = user.data.login
  const access = { username, ...(await canManageContent(octokit, username)) }

  for (const [k, entry] of accessCache) if (entry.expires <= now) accessCache.delete(k)
  accessCache.set(key, { access, expires: now + ACCESS_TTL_MS })
  return access
}

/**
 * null when signed out or when GitHub rejects the token (revoked, expired), so
 * callers answer 401 and the editor prompts for a fresh sign-in.
 */
export async function getGitHubContext(): Promise<GitHubContext | null> {
  const accessToken = await getAccessToken()
  if (!accessToken) return null
  const octokit = new Octokit({ auth: accessToken })
  const access = await resolveAccess(octokit, accessToken)
  return access && { octokit, ...access }
}

/** getGitHubContext without the client, for pages and routes that only check access */
export async function getContentAccess() {
  const context = await getGitHubContext()
  if (!context) return null
  const { username, canPush, canManage } = context
  return { username, canPush, canManage }
}

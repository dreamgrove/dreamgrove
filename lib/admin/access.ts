// What the signed-in user may do in the CMS. Server only.
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

export interface GitHubContext {
  octokit: Octokit
  username: string
  canPush: boolean
  /** Write access or org membership: unlocks /cms and new pages */
  canManage: boolean
}

/**
 * null when signed out or when GitHub rejects the token (revoked, expired), so
 * callers answer 401 and the editor prompts for a fresh sign-in.
 */
export async function getGitHubContext(): Promise<GitHubContext | null> {
  const accessToken = await getAccessToken()
  if (!accessToken) return null
  const octokit = new Octokit({ auth: accessToken })
  const user = await octokit.rest.users.getAuthenticated().catch(() => null)
  if (!user) return null
  const username = user.data.login
  return { octokit, username, ...(await canManageContent(octokit, username)) }
}

/** getGitHubContext without the client, for pages and routes that only check access */
export async function getContentAccess() {
  const context = await getGitHubContext()
  if (!context) return null
  const { username, canPush, canManage } = context
  return { username, canPush, canManage }
}

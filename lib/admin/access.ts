// What the signed-in user may do in the CMS. Server only.
import { getServerSession } from 'next-auth/next'
import { Octokit } from 'octokit'
import authOptions from 'app/api/auth/[...nextauth]/options'
import { canManageContent } from './github'

/**
 * null when signed out. canManage (write access or org membership) unlocks /cms
 * and new pages; anyone else can only edit an existing page, saved through a fork.
 */
export async function getContentAccess(): Promise<{
  username: string
  canPush: boolean
  canManage: boolean
} | null> {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) return null
  const octokit = new Octokit({ auth: session.accessToken })
  const { data: user } = await octokit.rest.users.getAuthenticated()
  return { username: user.login, ...(await canManageContent(octokit, user.login)) }
}

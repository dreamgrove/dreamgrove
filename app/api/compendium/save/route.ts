import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { Octokit } from 'octokit'
import fs from 'fs'
import path from 'path'
import { authOptions } from '../../auth/[...nextauth]/route'

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'dreamgrove'
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'dreamgrove'
const BRANCH = process.env.GITHUB_BRANCH || 'next-15'

export async function POST(request: Request) {
  // Check if the user is authenticated
  const session = await getServerSession(authOptions)
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Initialize Octokit with the user's access token
    const octokit = new Octokit({
      auth: session.accessToken,
    })

    // Get the authenticated user's username
    const { data: userData } = await octokit.rest.users.getAuthenticated()
    const username = userData.login

    // Check repository permissions directly
    try {
      // This checks if the user has permissions on the repository
      const { data: repoPermission } = await octokit.rest.repos.getCollaboratorPermissionLevel({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        username: username,
      })

      console.log('User repository permission:', repoPermission.permission)

      // Allow access for users with push (write) or admin permissions
      if (!['admin', 'write', 'maintain'].includes(repoPermission.permission)) {
        return NextResponse.json(
          { error: 'You do not have write permission to the dreamgrove repository' },
          { status: 403 }
        )
      }
    } catch (error) {
      console.error('Error checking repository permissions:', error)
      return NextResponse.json(
        { error: 'You do not have permission to edit this repository' },
        { status: 403 }
      )
    }

    // Parse the request body
    const { slug, content } = await request.json()

    if (!slug || !content) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Construct the file path
    const filePath = `data/blog/${slug}/compendium.mdx`

    // First, get the current file to obtain its SHA
    const currentFile = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      ref: BRANCH,
    })

    // @ts-ignore - The GitHub API returns an array for directories and an object for files
    const fileSha = currentFile.data.sha

    // Create a commit with the updated content
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `Update ${slug} compendium`,
      content: Buffer.from(content).toString('base64'),
      sha: fileSha,
      branch: BRANCH,
    })

    return NextResponse.json({ success: true, commit: response.data.commit })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}

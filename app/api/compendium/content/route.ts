import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { Octokit } from 'octokit'
import fs from 'fs'
import path from 'path'
import authOptions from 'app/api/auth/[...nextauth]/options'

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'dreamgrove'
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'dreamgrove'

export async function GET(request: Request) {
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

    // Check repository permissions directly instead of organization membership
    try {
      // This checks if the user has permissions on the repository
      const { data: repoPermission } = await octokit.rest.repos.getCollaboratorPermissionLevel({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        username: username,
      })

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

    // Get the slug from the request URL
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('filePath')

    if (!filePath) {
      return NextResponse.json({ error: 'Missing filePath parameter' }, { status: 400 })
    }

    // Construct the path to the MDX file
    const fullFilePath = path.join(process.cwd(), 'data', filePath)

    // Check if the file exists
    if (!fs.existsSync(fullFilePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read the file content
    const content = fs.readFileSync(fullFilePath, 'utf8')

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

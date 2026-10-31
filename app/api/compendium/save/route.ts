import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { Octokit } from 'octokit'
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import authOptions from 'app/api/auth/[...nextauth]/options'
import { MAX_IMAGE_BYTES, UPLOAD_PATH_RE } from '@/lib/admin/imageUploads'

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'dreamgrove'
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'dreamgrove'
const BRANCH = process.env.GITHUB_BRANCH || 'master'
const IS_LOCAL = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development'
const PROJECT_ROOT = process.cwd()

const execPromise = promisify(exec)

export async function POST(request: Request) {
  // Check if the user is authenticated
  const session = await getServerSession(authOptions)
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Parse the request body
    const {
      filePath,
      content,
      images = [],
      commitTitle,
      commitMessage,
      createPr = false,
    } = await request.json()

    if (!filePath || !content) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // only allow plain data/ paths
    if (
      typeof filePath !== 'string' ||
      !/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.mdx$/.test(filePath)
    ) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: 'Invalid images' }, { status: 400 })
    }
    const uploads: { path: string; data: Buffer }[] = []
    for (const img of images) {
      if (
        typeof img?.path !== 'string' ||
        typeof img?.content !== 'string' ||
        !UPLOAD_PATH_RE.test(img.path)
      ) {
        return NextResponse.json({ error: 'Invalid image upload' }, { status: 400 })
      }
      const data = Buffer.from(img.content, 'base64')
      if (!data.length || data.length > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: 'Images must be 2 MB or smaller' }, { status: 400 })
      }
      uploads.push({ path: `public${img.path}`, data })
    }

    // Use provided commit message or fallback to default
    const fileName = path.basename(filePath, '.mdx')
    const commitTitleToUse = commitTitle || `Update ${fileName}`
    const commitMessageToUse = commitMessage || ''

    // Construct the file path
    const fullFilePath = path.join(PROJECT_ROOT, 'data', filePath)

    if (IS_LOCAL) {
      // Local environment - use git directly on filesystem
      try {
        // Create a branch name based on file path and timestamp
        const branchName = `local-edit-${path.basename(filePath, '.mdx')}-${Date.now()}`

        // Ensure the directory exists
        const dirPath = path.dirname(fullFilePath)
        await fs.mkdir(dirPath, { recursive: true })

        // Write file content
        await fs.writeFile(fullFilePath, content)
        for (const upload of uploads) {
          const uploadPath = path.join(PROJECT_ROOT, upload.path)
          await fs.mkdir(path.dirname(uploadPath), { recursive: true })
          await fs.writeFile(uploadPath, upload.data)
        }

        await execPromise(`git checkout -b ${branchName}`)
        await execPromise(`git add data/${filePath} ${uploads.map((u) => u.path).join(' ')}`)

        // Use the provided commit message if available
        const fullCommitMessage = commitMessageToUse
          ? `${commitTitleToUse}\n\n${commitMessageToUse}`
          : commitTitleToUse

        await execPromise(`git commit -m "${fullCommitMessage.replace(/"/g, '\\"')}"`)

        return NextResponse.json({
          success: true,
          message: `Changes saved locally on branch: ${branchName}`,
        })
      } catch (error) {
        console.error('Error saving content locally:', error)
        return NextResponse.json({ error: 'Failed to save content locally' }, { status: 500 })
      }
    } else {
      // Online environment - use GitHub API
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

      // Create a unique branch name for this edit
      const newBranchName = `${username}-${fileName}-${Date.now()}`

      try {
        // Get the current commit SHA from the main branch to branch from
        const { data: refData } = await octokit.rest.git.getRef({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          ref: `heads/${BRANCH}`,
        })

        const baseSha = refData.object.sha

        // Create a new branch for this edit
        await octokit.rest.git.createRef({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          ref: `refs/heads/${newBranchName}`,
          sha: baseSha,
        })

        for (const upload of uploads) {
          await octokit.rest.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: upload.path,
            message: `Add ${path.posix.basename(upload.path)}`,
            content: upload.data.toString('base64'),
            branch: newBranchName,
          })
        }

        // First, try to get the current file to obtain its SHA
        try {
          const currentFile = await octokit.rest.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: `data/${filePath}`,
            ref: newBranchName,
          })

          // @ts-ignore - The GitHub API returns an array for directories and an object for files
          const fileSha = currentFile.data.sha

          // Update existing file
          await octokit.rest.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: `data/${filePath}`,
            message: commitTitleToUse,
            content: Buffer.from(content).toString('base64'),
            sha: fileSha,
            branch: newBranchName,
          })
        } catch (_) {
          // File doesn't exist yet, create it
          await octokit.rest.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: `data/${filePath}`,
            message: commitTitleToUse,
            content: Buffer.from(content).toString('base64'),
            branch: newBranchName,
          })
        }

        let prUrl: string | null = null

        // Create a PR if requested
        if (createPr) {
          const prBody = commitMessageToUse || `Updates to ${fileName}`

          const { data: pullRequest } = await octokit.rest.pulls.create({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            title: commitTitleToUse,
            body: prBody,
            head: newBranchName,
            base: BRANCH,
          })

          prUrl = pullRequest.html_url
        }

        return NextResponse.json({
          success: true,
          message: `Changes committed to branch: ${newBranchName}`,
          branch: newBranchName,
          prUrl,
        })
      } catch (error) {
        console.error('Error creating branch or committing to GitHub:', error)
        return NextResponse.json({ error: 'Failed to save content to GitHub' }, { status: 500 })
      }
    }
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}

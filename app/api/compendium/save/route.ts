import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { Octokit } from 'octokit'
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import authOptions from 'app/api/auth/[...nextauth]/options'
import { MAX_IMAGE_BYTES, UPLOAD_PATH_RE } from '@/lib/admin/imageUploads'
import { CONTENT_PATH_RE } from '@/lib/admin/content'
import {
  BRANCH,
  EDIT_BRANCH_PREFIX,
  MAX_OPEN_PRS,
  REPO_NAME,
  REPO_OWNER,
  canPush,
  countOpenEditPrs,
  ensureFork,
  isOrgMember,
} from '@/lib/admin/github'

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
    if (typeof filePath !== 'string' || !CONTENT_PATH_RE.test(filePath)) {
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

      const { data: userData } = await octokit.rest.users.getAuthenticated()
      const username = userData.login
      const isCollaborator = await canPush(octokit, username)

      // Contributors without write access get their own branch on a fork, with a
      // few limits since anyone with a GitHub account can get this far
      if (!isCollaborator) {
        // New pages come from /cms, which is for org members; everyone else edits existing ones
        const isNewPage = !(await fs.stat(fullFilePath).catch(() => null))
        if (isNewPage && !(await isOrgMember(octokit, username))) {
          return NextResponse.json(
            { error: 'Only dreamgrove members can create new pages' },
            { status: 403 }
          )
        }
        if ((await countOpenEditPrs(octokit, username)) >= MAX_OPEN_PRS) {
          return NextResponse.json(
            {
              error: `You already have ${MAX_OPEN_PRS} open edit PRs; wait for one to be reviewed before opening another`,
            },
            { status: 429 }
          )
        }
      }

      const newBranchName = `${EDIT_BRANCH_PREFIX}${fileName}-${Date.now()}`

      try {
        // Where the branch is pushed: upstream itself, or the user's fork
        let target = { owner: REPO_OWNER, repo: REPO_NAME }
        if (!isCollaborator) {
          const fork = await ensureFork(octokit)
          target = { owner: fork.owner, repo: fork.repo }
          // Keeps the fork's default branch current; the edit branch is cut from
          // upstream's commit below either way, so a failure here is harmless
          await octokit.rest.repos
            .mergeUpstream({ ...target, branch: fork.defaultBranch })
            .catch(() => {})
        }

        // Branch from the tip of upstream's main branch
        const { data: refData } = await octokit.rest.git.getRef({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          ref: `heads/${BRANCH}`,
        })

        await octokit.rest.git.createRef({
          ...target,
          ref: `refs/heads/${newBranchName}`,
          sha: refData.object.sha,
        })

        for (const upload of uploads) {
          await octokit.rest.repos.createOrUpdateFileContents({
            ...target,
            path: upload.path,
            message: `Add ${path.posix.basename(upload.path)}`,
            content: upload.data.toString('base64'),
            branch: newBranchName,
          })
        }

        // An existing file needs its SHA to be updated
        let fileSha: string | undefined
        try {
          const currentFile = await octokit.rest.repos.getContent({
            ...target,
            path: `data/${filePath}`,
            ref: newBranchName,
          })
          if (!Array.isArray(currentFile.data)) fileSha = currentFile.data.sha
        } catch (_) {
          // File doesn't exist yet, create it
        }

        await octokit.rest.repos.createOrUpdateFileContents({
          ...target,
          path: `data/${filePath}`,
          message: commitTitleToUse,
          content: Buffer.from(content).toString('base64'),
          sha: fileSha,
          branch: newBranchName,
        })

        let prUrl: string | null = null

        // Create a PR if requested
        if (createPr) {
          const prBody = commitMessageToUse || `Updates to ${fileName}`

          const { data: pullRequest } = await octokit.rest.pulls.create({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            title: commitTitleToUse,
            body: prBody,
            head: isCollaborator ? newBranchName : `${target.owner}:${newBranchName}`,
            base: BRANCH,
            // Lets maintainers fix up a fork PR before merging it
            maintainer_can_modify: !isCollaborator,
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
        return NextResponse.json(
          {
            error:
              error instanceof Error && error.message.startsWith('Your fork')
                ? error.message
                : 'Failed to save content to GitHub',
          },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}

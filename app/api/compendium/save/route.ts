import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'
import {
  MAX_IMAGES,
  MAX_IMAGE_BYTES,
  MAX_TOTAL_BYTES,
  UPLOAD_PATH_RE,
  matchesImageType,
} from '@/lib/admin/imageUploads'
import { CONTENT_PATH_RE, kindOf } from '@/lib/admin/content'
import { withLastmod } from '@/lib/admin/document'
import { getGitHubContext } from '@/lib/admin/access'
import {
  BRANCH,
  EDIT_BRANCH_PREFIX,
  ForkNotReadyError,
  MAX_OPEN_PRS,
  REPO_NAME,
  REPO_OWNER,
  countOpenEditPrs,
  ensureFork,
  isOrgMember,
} from '@/lib/admin/github'

const IS_LOCAL = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development'
const PROJECT_ROOT = process.cwd()

// Anyone with a GitHub account can reach this route, so every input is capped.
// The largest guide is ~115 KB; images arrive base64-encoded (4/3 of MAX_TOTAL_BYTES).
const MAX_CONTENT_CHARS = 512 * 1024
const MAX_BODY_BYTES = 6 * 1024 * 1024
const MAX_TITLE_CHARS = 200
const MAX_MESSAGE_CHARS = 5000

const execFileAsync = promisify(execFile)
const git = (...args: string[]) => execFileAsync('git', args, { cwd: PROJECT_ROOT })

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

class BodyTooLargeError extends Error {}

/** request.json(), but stops reading once the body passes `limit` bytes */
async function readJsonCapped(request: Request, limit: number): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > limit) throw new BodyTooLargeError()
  const reader = request.body?.getReader()
  if (!reader) return null
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.length
    if (size > limit) {
      await reader.cancel()
      throw new BodyTooLargeError()
    }
    chunks.push(value)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const optionalString = (value: unknown, max: number) =>
  value === undefined || (typeof value === 'string' && value.length <= max)

export async function POST(request: Request) {
  const github = await getGitHubContext()
  if (!github) return fail('Unauthorized', 401)

  try {
    let body: Record<string, unknown> | null
    try {
      body = (await readJsonCapped(request, MAX_BODY_BYTES)) as Record<string, unknown> | null
    } catch (error) {
      if (error instanceof BodyTooLargeError) return fail('Request is too large', 413)
      return fail('Invalid request body')
    }
    const { filePath, content: submitted, images = [], commitTitle, commitMessage } = body ?? {}

    if (!filePath || !submitted) return fail('Missing required parameters')

    // only allow plain data/ paths
    if (typeof filePath !== 'string' || !CONTENT_PATH_RE.test(filePath)) {
      return fail('Invalid file path')
    }
    if (typeof submitted !== 'string' || submitted.length > MAX_CONTENT_CHARS) {
      return fail('Page content is too large')
    }
    // Pages (about.mdx) have no lastmod field; guides and posts show it as "Updated"
    const content =
      kindOf(filePath) === 'page'
        ? submitted
        : withLastmod(submitted, new Date().toISOString().slice(0, 10))
    if (
      !optionalString(commitTitle, MAX_TITLE_CHARS) ||
      !optionalString(commitMessage, MAX_MESSAGE_CHARS)
    ) {
      return fail(
        `Titles are limited to ${MAX_TITLE_CHARS} characters and descriptions to ${MAX_MESSAGE_CHARS}`
      )
    }

    if (!Array.isArray(images)) return fail('Invalid images')
    if (images.length > MAX_IMAGES) return fail(`A PR can add at most ${MAX_IMAGES} images`)
    const uploads: { path: string; data: Buffer }[] = []
    for (const img of images) {
      if (
        typeof img?.path !== 'string' ||
        typeof img?.content !== 'string' ||
        !UPLOAD_PATH_RE.test(img.path)
      ) {
        return fail('Invalid image upload')
      }
      const data = Buffer.from(img.content, 'base64')
      if (!data.length || data.length > MAX_IMAGE_BYTES) {
        return fail('Images must be 2 MB or smaller')
      }
      if (!matchesImageType(img.path, data)) {
        return fail('Uploads must be PNG, JPG, WebP or GIF images')
      }
      uploads.push({ path: `public${img.path}`, data })
    }
    if (uploads.reduce((sum, u) => sum + u.data.length, 0) > MAX_TOTAL_BYTES) {
      return fail('Uploaded images add up to more than 3 MB')
    }

    const fileName = path.basename(filePath, '.mdx')
    const commitTitleToUse = (commitTitle as string | undefined) || `Update ${fileName}`
    const commitMessageToUse = (commitMessage as string | undefined) || ''
    const fullCommitMessage = commitMessageToUse
      ? `${commitTitleToUse}\n\n${commitMessageToUse}`
      : commitTitleToUse

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

        // execFile passes arguments as-is, so nothing in them reaches a shell
        await git('checkout', '-b', branchName)
        await git('add', '--', `data/${filePath}`, ...uploads.map((u) => u.path))
        await git('commit', '-m', fullCommitMessage)

        return NextResponse.json({
          success: true,
          message: `Changes saved locally on branch: ${branchName}`,
        })
      } catch (error) {
        console.error('Error saving content locally:', error)
        return fail('Failed to save content locally', 500)
      }
    } else {
      // Online environment - use GitHub API
      const { octokit, username, canPush: isCollaborator } = github

      // Contributors without write access get their own branch on a fork, with a
      // few limits since anyone with a GitHub account can get this far
      if (!isCollaborator) {
        // New pages come from /cms, which is for org members; everyone else edits existing ones
        const isNewPage = !(await fs.stat(fullFilePath).catch(() => null))
        if (isNewPage && !(await isOrgMember(octokit, username))) {
          return fail('Only dreamgrove members can create new pages', 403)
        }
        if ((await countOpenEditPrs(octokit, username)) >= MAX_OPEN_PRS) {
          return fail(
            `You already have ${MAX_OPEN_PRS} open edit PRs; wait for one to be reviewed before opening another`,
            429
          )
        }
      }

      const newBranchName = `${EDIT_BRANCH_PREFIX}${fileName}-${Date.now()}`

      try {
        // Where the branch is pushed: upstream itself, or the user's fork
        const target = isCollaborator
          ? { owner: REPO_OWNER, repo: REPO_NAME }
          : await ensureFork(octokit)

        // One commit on top of upstream's main branch (forks share its objects), with
        // the page and its images together. The branch ref is created last, so a
        // failed upload never leaves a half-written branch behind.
        const { data: base } = await octokit.rest.git.getRef({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          ref: `heads/${BRANCH}`,
        })
        const { data: baseCommit } = await octokit.rest.git.getCommit({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          commit_sha: base.object.sha,
        })

        const files = [...uploads, { path: `data/${filePath}`, data: Buffer.from(content) }]
        const blobs = await Promise.all(
          files.map((file) =>
            octokit.rest.git.createBlob({
              ...target,
              content: file.data.toString('base64'),
              encoding: 'base64',
            })
          )
        )
        const { data: tree } = await octokit.rest.git.createTree({
          ...target,
          base_tree: baseCommit.tree.sha,
          tree: files.map((file, i) => ({
            path: file.path,
            mode: '100644' as const,
            type: 'blob' as const,
            sha: blobs[i].data.sha,
          })),
        })
        const { data: commit } = await octokit.rest.git.createCommit({
          ...target,
          message: fullCommitMessage,
          tree: tree.sha,
          parents: [base.object.sha],
        })
        await octokit.rest.git.createRef({
          ...target,
          ref: `refs/heads/${newBranchName}`,
          sha: commit.sha,
        })

        const { data: pullRequest } = await octokit.rest.pulls.create({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          title: commitTitleToUse,
          body: commitMessageToUse || `Updates to ${fileName}`,
          head: isCollaborator ? newBranchName : `${target.owner}:${newBranchName}`,
          base: BRANCH,
          // Lets maintainers fix up a fork PR before merging it
          maintainer_can_modify: !isCollaborator,
        })
        const prUrl = pullRequest.html_url

        return NextResponse.json({
          success: true,
          message: `Changes committed to branch: ${newBranchName}`,
          branch: newBranchName,
          prUrl,
        })
      } catch (error) {
        console.error('Error creating branch or committing to GitHub:', error)
        return fail(
          error instanceof ForkNotReadyError ? error.message : 'Failed to save content to GitHub',
          500
        )
      }
    }
  } catch (error) {
    console.error('Error saving content:', error)
    return fail('Failed to save content', 500)
  }
}

// GitHub plumbing for /api/compendium/*. Server only: every call runs with the
// signed-in user's OAuth token.
import type { Octokit } from 'octokit'

export const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'dreamgrove'
export const REPO_NAME = process.env.GITHUB_REPO_NAME || 'dreamgrove'
export const BRANCH = process.env.GITHUB_BRANCH || 'master'

/** Every editor branch starts with this, so CI and the PR cap can tell them apart */
export const EDIT_BRANCH_PREFIX = 'dg-edit/'

/** Open editor PRs allowed per contributor without write access */
export const MAX_OPEN_PRS = 3

const FORK_READY_TIMEOUT_MS = 30_000
const FORK_POLL_MS = 1500

/** Whether the user can push branches to the upstream repository */
export async function hasPushAccess(octokit: Octokit, username: string) {
  try {
    const { data } = await octokit.rest.repos.getCollaboratorPermissionLevel({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      username,
    })
    return ['admin', 'write', 'maintain'].includes(data.permission)
  } catch {
    // Non-collaborators get a 403/404 here
    return false
  }
}

/**
 * Whether the user belongs to the organization that owns the repository. GitHub
 * answers 204 for members; non-members get a redirect to the public member check,
 * which ends in a 404 that Octokit throws.
 */
export async function isOrgMember(octokit: Octokit, username: string) {
  try {
    const { status } = await octokit.rest.orgs.checkMembershipForUser({
      org: REPO_OWNER,
      username,
    })
    return (status as number) === 204
  } catch {
    return false
  }
}

/** Who may browse every page and create new ones on /cms */
export async function canManageContent(octokit: Octokit, username: string) {
  const [push, member] = await Promise.all([
    hasPushAccess(octokit, username),
    isOrgMember(octokit, username),
  ])
  return { canPush: push, canManage: push || member }
}

/**
 * Open PRs this user has opened from the editor. Search finds the user's open PRs
 * without listing the whole repository's; it can't match a branch prefix, so each
 * hit (normally a handful) is checked for its head branch.
 */
export async function countOpenEditPrs(octokit: Octokit, username: string) {
  const { data } = await octokit.rest.search.issuesAndPullRequests({
    q: `repo:${REPO_OWNER}/${REPO_NAME} is:pr is:open author:${username}`,
    per_page: 100,
  })
  const heads = await Promise.all(
    data.items.map(({ number }) =>
      octokit.rest.pulls
        .get({ owner: REPO_OWNER, repo: REPO_NAME, pull_number: number })
        .then(({ data: pr }) => pr.head.ref)
    )
  )
  return heads.filter((ref) => ref.startsWith(EDIT_BRANCH_PREFIX)).length
}

/** Thrown while a newly created fork isn't usable yet; its message is shown to the user */
export class ForkNotReadyError extends Error {
  constructor() {
    super('Your fork is still being created, try saving again in a minute')
  }
}

/**
 * The user's fork of the upstream repository, created if they don't have one.
 * Forking is asynchronous on GitHub's side, so this waits until the fork answers.
 */
export async function ensureFork(octokit: Octokit) {
  const { data: fork } = await octokit.rest.repos.createFork({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    default_branch_only: true,
  })
  // An existing fork is returned as is, and may have been renamed
  const target = { owner: fork.owner.login, repo: fork.name }

  const deadline = Date.now() + FORK_READY_TIMEOUT_MS
  for (;;) {
    try {
      const { data } = await octokit.rest.repos.get(target)
      // A fresh fork can answer before its branches exist
      await octokit.rest.repos.getBranch({ ...target, branch: data.default_branch })
      return target
    } catch (error) {
      // 404/409 mean the fork is still being set up; anything else (SSO, rate limits) won't fix itself
      const status = (error as { status?: number }).status
      if (status !== 404 && status !== 409) throw error
      if (Date.now() > deadline) throw new ForkNotReadyError()
      await new Promise((resolve) => setTimeout(resolve, FORK_POLL_MS))
    }
  }
}

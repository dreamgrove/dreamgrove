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
export async function canPush(octokit: Octokit, username: string) {
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
    canPush(octokit, username),
    isOrgMember(octokit, username),
  ])
  return { canPush: push, canManage: push || member }
}

/** Open PRs this user has opened from the editor */
export async function countOpenEditPrs(octokit: Octokit, username: string) {
  const prs = await octokit.paginate(octokit.rest.pulls.list, {
    owner: REPO_OWNER,
    repo: REPO_NAME,
    state: 'open',
    per_page: 100,
  })
  return prs.filter(
    (pr) => pr.user?.login === username && pr.head.ref.startsWith(EDIT_BRANCH_PREFIX)
  ).length
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
      return { ...target, defaultBranch: data.default_branch }
    } catch {
      if (Date.now() > deadline) {
        throw new Error('Your fork is still being created, try saving again in a minute')
      }
      await new Promise((resolve) => setTimeout(resolve, FORK_POLL_MS))
    }
  }
}

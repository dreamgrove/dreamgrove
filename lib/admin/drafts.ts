// Crash recovery for the admin editor.
//
// Every keystroke is eventually mirrored into localStorage under a per-file key,
// so a tab crash / accidental close / dead laptop battery doesn't lose work that
// was never committed. Drafts are only *offered* on load, never auto-applied —
// the file on GitHub may have moved on since, and silently replaying a stale
// draft over it would be worse than losing it.

const PREFIX = 'dreamgrove:editor-draft:v1:'
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000

export interface EditorDraft {
  filePath: string
  body: string
  frontmatter: Record<string, any>
  authorsInput: string
  // The document as it was fetched when this draft started. Lets the recovery
  // banner tell "you have unsaved work" apart from "…and the file also changed
  // upstream in the meantime".
  baseline: string
  savedAt: number
}

const keyFor = (filePath: string) => `${PREFIX}${filePath}`

function storage(): Storage | null {
  // Private-mode Safari and hardened profiles throw on access, not just on use.
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

function isDraft(value: unknown): value is EditorDraft {
  if (!value || typeof value !== 'object') return false
  const d = value as Record<string, unknown>
  return typeof d.body === 'string' && typeof d.savedAt === 'number'
}

/** Drop drafts we'll never offer again, so one long-lived profile can't fill the quota. */
function pruneExpired(store: Storage, now: number): void {
  for (const key of Object.keys(store)) {
    if (!key.startsWith(PREFIX)) continue
    try {
      const parsed = JSON.parse(store.getItem(key) ?? '')
      if (isDraft(parsed) && now - parsed.savedAt <= MAX_AGE_MS) continue
    } catch {
      // Unparseable entry — it can never be restored, so it's only taking space.
    }
    store.removeItem(key)
  }
}

export function readDraft(filePath: string): EditorDraft | null {
  const store = storage()
  if (!store) return null

  const now = Date.now()
  pruneExpired(store, now)

  try {
    const raw = store.getItem(keyFor(filePath))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!isDraft(parsed) || now - parsed.savedAt > MAX_AGE_MS) return null
    return {
      ...parsed,
      frontmatter: parsed.frontmatter ?? {},
      authorsInput: typeof parsed.authorsInput === 'string' ? parsed.authorsInput : '',
      baseline: typeof parsed.baseline === 'string' ? parsed.baseline : '',
    }
  } catch {
    return null
  }
}

/** Returns the timestamp actually stored, or null if the write couldn't happen. */
export function writeDraft(draft: Omit<EditorDraft, 'savedAt'>): number | null {
  const store = storage()
  if (!store) return null

  const savedAt = Date.now()
  const payload = JSON.stringify({ ...draft, savedAt })

  try {
    store.setItem(keyFor(draft.filePath), payload)
    return savedAt
  } catch {
    // Almost always QuotaExceededError. Clear out every *other* file's draft and
    // retry once — the document being edited right now is the one worth keeping.
    try {
      for (const key of Object.keys(store)) {
        if (key.startsWith(PREFIX) && key !== keyFor(draft.filePath)) store.removeItem(key)
      }
      store.setItem(keyFor(draft.filePath), payload)
      return savedAt
    } catch {
      return null
    }
  }
}

export function clearDraft(filePath: string): void {
  storage()?.removeItem(keyFor(filePath))
}

export function formatDraftAge(savedAt: number, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - savedAt) / 1000))
  if (seconds < 60) return 'moments ago'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

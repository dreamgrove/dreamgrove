import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { clearDraft, readDraft, type EditorDraft } from '@/lib/admin/drafts'
import {
  parseDocument,
  serializeDocument,
  type EditorDocument,
  type Frontmatter,
} from '@/lib/admin/document'
import { readNewPage } from '@/lib/admin/newPageStash'
import { useDraftAutosave } from './useDraftAutosave'

export type FileStatus = 'loading' | 'ready' | 'error'

const EMPTY: EditorDocument = { body: '', frontmatter: {}, authorsInput: '' }

/**
 * The file being edited: fetched once signed in, held as an EditorDocument,
 * autosaved as a local draft, and recovered from one when a previous session
 * left unsaved edits.
 */
export function useEditorFile(filePath: string, isNew: boolean) {
  const { status: authStatus } = useSession()
  const [status, setStatus] = useState<FileStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [isNewFile, setIsNewFile] = useState(false)
  // Without write access, saving forks the repository and opens the PR from there
  const [canPush, setCanPush] = useState(false)
  const [doc, setDoc] = useState<EditorDocument>(EMPTY)
  // The document as last fetched/saved
  const [baseline, setBaseline] = useState('')
  // A recovered draft awaiting the user's restore/discard decision
  const [pendingDraft, setPendingDraft] = useState<EditorDraft | null>(null)

  const { draftSavedAt, setDraftSavedAt } = useDraftAutosave(
    filePath,
    doc,
    baseline,
    status !== 'ready' || !!pendingDraft
  )

  useEffect(() => {
    if (authStatus !== 'authenticated') return
    fetch(`/api/compendium/content?filePath=${encodeURIComponent(filePath)}`)
      .then(async (res) => {
        if (res.status === 404 && isNew) {
          const { canPush, canManage } = await res.json().catch(() => ({}))
          if (!canManage) throw new Error('Only dreamgrove members can create new pages')
          return { content: readNewPage(filePath) ?? '', isNew: true, canPush }
        }
        if (!res.ok) throw new Error(`Error fetching content: ${res.statusText}`)
        return res.json()
      })
      .then((data) => {
        const loaded = parseDocument(data.content || '')
        const loadedBaseline = serializeDocument(loaded)
        setIsNewFile(!!data.isNew)
        setCanPush(!!data.canPush)
        setDoc(loaded)
        setBaseline(loadedBaseline)

        const draft = readDraft(filePath)
        if (draft) {
          // A draft identical to the file has nothing left to recover
          if (serializeDocument(draft) === loadedBaseline) clearDraft(filePath)
          else setPendingDraft(draft)
        }
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [authStatus, filePath, isNew])

  const setBody = useCallback((body: string) => setDoc((d) => ({ ...d, body })), [])
  const setAuthors = useCallback(
    (authorsInput: string) => setDoc((d) => ({ ...d, authorsInput })),
    []
  )
  /** Sets or removes a frontmatter field */
  const setField = useCallback(
    (key: string, value: unknown) =>
      setDoc((d) => {
        const frontmatter: Frontmatter = { ...d.frontmatter }
        if (value === undefined) delete frontmatter[key]
        else frontmatter[key] = value
        return { ...d, frontmatter }
      }),
    []
  )

  const restoreDraft = () => {
    if (!pendingDraft) return
    const { body, frontmatter, authorsInput } = pendingDraft
    setDoc({ body, frontmatter, authorsInput })
    setDraftSavedAt(pendingDraft.savedAt)
    setPendingDraft(null)
  }

  const discardDraft = () => {
    clearDraft(filePath)
    setDraftSavedAt(null)
    setPendingDraft(null)
  }

  /** The document as committed upstream */
  const markSaved = (saved: string) => {
    // The server may have stamped lastmod, so adopt its version as the document too
    const committed = parseDocument(saved)
    setDoc(committed)
    setBaseline(serializeDocument(committed))
    clearDraft(filePath)
    setDraftSavedAt(null)
  }

  const serialized = serializeDocument(doc)

  return {
    authStatus,
    status,
    error,
    isNewFile,
    canPush,
    doc,
    serialized,
    isDirty: serialized !== baseline,
    baseline,
    setBody,
    setAuthors,
    setField,
    pendingDraft,
    draftSavedAt,
    restoreDraft,
    discardDraft,
    markSaved,
  }
}

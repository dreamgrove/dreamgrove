import { useCallback, useEffect, useState } from 'react'
import { clearDraft, writeDraft } from '@/lib/admin/drafts'
import { serializeDocument, type EditorDocument } from '@/lib/admin/document'

const DEBOUNCE_MS = 600

/**
 * Mirrors the in-progress document to localStorage shortly after typing stops.
 *
 * `paused` while the file is still loading (state is empty then, which would
 * look like "the user deleted everything") or while a recovered draft is
 * still on screen awaiting a decision (writing would overwrite it).
 */
export function useDraftAutosave(
  filePath: string,
  doc: EditorDocument,
  baseline: string,
  paused: boolean
) {
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null)

  const persist = useCallback(
    (doc: EditorDocument, baseline: string) => {
      if (serializeDocument(doc) === baseline) {
        // Back to the file's own contents since there is nothing to recover#
        clearDraft(filePath)
        setDraftSavedAt(null)
        return
      }
      const savedAt = writeDraft({ filePath, ...doc, baseline })
      if (savedAt) setDraftSavedAt(savedAt)
    },
    [filePath]
  )

  useEffect(() => {
    if (paused) return
    const timer = setTimeout(() => persist(doc, baseline), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [doc, baseline, paused, persist])

  // Navigating away or backgrounding the tab can outrun the debounce, so flush
  // synchronously on the way out. pagehide covers the bfcache/mobile paths that
  // beforeunload misses.
  useEffect(() => {
    if (paused) return
    const flush = () => persist(doc, baseline)
    const onHidden = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    window.addEventListener('beforeunload', flush)
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      window.removeEventListener('pagehide', flush)
      window.removeEventListener('beforeunload', flush)
      document.removeEventListener('visibilitychange', onHidden)
    }
  }, [doc, baseline, paused, persist])

  return { draftSavedAt, setDraftSavedAt }
}

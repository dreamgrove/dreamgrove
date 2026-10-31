import { useEffect, type RefObject } from 'react'
import type { EditorView } from '@codemirror/view'
import { buildAnchors, mapScroll } from '@/lib/admin/editor/scrollSync'

/** Keeps the editor and the preview scrolled to the same section while `enabled` */
export function useScrollSync(
  enabled: boolean,
  view: EditorView | null,
  previewRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const editorEl = view?.scrollDOM
    const previewEl = previewRef.current
    if (!enabled || !view || !editorEl || !previewEl) return

    let locked = false
    const syncFrom = (source: 'editor' | 'preview') => () => {
      if (locked) return
      locked = true
      const { editor, preview } = buildAnchors(view, previewEl)
      const editorMax = editorEl.scrollHeight - editorEl.clientHeight
      const previewMax = previewEl.scrollHeight - previewEl.clientHeight
      if (source === 'editor') {
        previewEl.scrollTop = mapScroll(editorEl.scrollTop, editor, editorMax, preview, previewMax)
      } else {
        editorEl.scrollTop = mapScroll(previewEl.scrollTop, preview, previewMax, editor, editorMax)
      }
      requestAnimationFrame(() => {
        locked = false
      })
    }

    const onEditorScroll = syncFrom('editor')
    const onPreviewScroll = syncFrom('preview')
    editorEl.addEventListener('scroll', onEditorScroll, { passive: true })
    previewEl.addEventListener('scroll', onPreviewScroll, { passive: true })
    return () => {
      editorEl.removeEventListener('scroll', onEditorScroll)
      previewEl.removeEventListener('scroll', onPreviewScroll)
    }
  }, [enabled, view, previewRef])
}

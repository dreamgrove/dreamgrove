import { useMemo, useState } from 'react'
import { EditorView } from '@codemirror/view'
import { tagAtPos, type TagMatch } from '@/lib/admin/editor/blocks/tags'
import { headingLevel } from '@/lib/admin/editor/commands'

export interface CursorInfo {
  line: number
  col: number
  /** Heading level of the cursor's line, 0 for body text */
  heading: number
  /** Component whose opening tag holds the cursor */
  tag: TagMatch | null
}

const same = (a: CursorInfo, b: CursorInfo) =>
  a.line === b.line &&
  a.col === b.col &&
  a.heading === b.heading &&
  a.tag?.from === b.tag?.from &&
  a.tag?.to === b.tag?.to

/** Position of the cursor used by the toolbar and the status bar (updated once per frame) */
export function useCursorInfo() {
  const [cursor, setCursor] = useState<CursorInfo>({ line: 1, col: 1, heading: 0, tag: null })
  const extension = useMemo(() => {
    const pending = { frame: 0 }
    return EditorView.updateListener.of((update) => {
      if (!update.selectionSet && !update.docChanged) return
      cancelAnimationFrame(pending.frame)
      pending.frame = requestAnimationFrame(() => {
        const { state } = update.view
        const head = state.selection.main.head
        const line = state.doc.lineAt(head)
        const next = {
          line: line.number,
          col: head - line.from + 1,
          heading: headingLevel(state),
          tag: tagAtPos(state, head),
        }
        setCursor((prev) => (same(prev, next) ? prev : next))
      })
    })
  }, [])

  return { cursor, extension }
}

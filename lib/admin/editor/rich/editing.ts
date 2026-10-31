import type { EditorView } from '@codemirror/view'
import { findAllTags } from '../blocks/tags'
import { CONDITION_PREFIX } from './conditions'
import { scanHtml } from './html'

export function removeRange(view: EditorView, from: number, to: number) {
  const doc = view.state.doc
  if (doc.sliceString(to, to + 1) === '\n') to++
  view.dispatch({ changes: { from, to }, userEvent: 'delete', scrollIntoView: true })
  view.focus()
}

/** Removes a wrapper's opening and closing tags. */
export function unwrap(view: EditorView, openFrom: number) {
  const text = view.state.doc.toString()
  let close: { from: number; to: number } | undefined
  let openTo = -1
  const tag = findAllTags(text).find((t) => t.from === openFrom)
  if (tag) {
    openTo = tag.to
    close = tag.close
  } else {
    const pair = scanHtml(text, () => false).pairs.find((p) => p.open.from === openFrom)
    if (pair) {
      openTo = pair.open.to
      close = pair.close
      // A conditional block's `[*id]` goes with its <div>
      const cond = /^\[\*[^\]\n]+\]/.exec(text.slice(openTo))
      if (cond) openTo += cond[0].length
    }
  }
  if (openTo < 0) return
  // So does a `[*…]` written before the tag
  const openLine = view.state.doc.lineAt(openFrom)
  const start = CONDITION_PREFIX.test(text.slice(openLine.from, openFrom))
    ? openLine.from
    : openFrom
  const span = (from: number, to: number) => {
    const doc = view.state.doc
    const a = doc.lineAt(from)
    const b = doc.lineAt(to)
    const alone = !doc.sliceString(a.from, from).trim() && !doc.sliceString(to, b.to).trim()
    return alone ? { from: a.from, to: Math.min(doc.length, b.to + 1) } : { from, to }
  }
  const changes = [span(start, openTo)]
  if (close) changes.push(span(close.from, close.to))
  view.dispatch({ changes, userEvent: 'delete' })
  view.focus()
}

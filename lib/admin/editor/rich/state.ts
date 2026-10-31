import { StateEffect, StateField } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import { caretRange } from '../caretRange'

// --- Reveal ------------------------------------------------------------------

/** Source shown raw (Alt+click) until the caret leaves it */
const { set: setReveal, field: revealField } = caretRange()
export { revealField }

// --- Folding -------------------------------------------------------------------

export const toggleFold = StateEffect.define<number>()

/** Opening-tag positions of collapsed sections */
export const foldField = StateField.define<readonly number[]>({
  create: () => [],
  update(value, tr) {
    if (tr.docChanged) value = value.map((pos) => tr.changes.mapPos(pos, 1))
    for (const e of tr.effects) {
      if (!e.is(toggleFold)) continue
      value = value.includes(e.value) ? value.filter((p) => p !== e.value) : [...value, e.value]
    }
    return value
  },
})

// --- Toggle links --------------------------------------------------------------

export const toggleLink = StateEffect.define<string>()

export const linkField = StateField.define<readonly string[]>({
  create: () => [],
  update(value, tr) {
    for (const e of tr.effects) {
      if (!e.is(toggleLink)) continue
      value = value.includes(e.value) ? value.filter((id) => id !== e.value) : [...value, e.value]
    }
    return value
  },
})

export function reveal(view: EditorView, from: number, to: number) {
  view.dispatch({ selection: { anchor: from }, effects: setReveal.of({ from, to }) })
  view.focus()
}

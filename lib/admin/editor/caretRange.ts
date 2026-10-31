import { StateEffect, StateField } from '@codemirror/state'

export type Span = { from: number; to: number } | null

/**
 * A range of the document that follows edits inside it and clears itself once
 * the caret leaves it. Used for source shown raw while it's being edited (a
 * spell token, a revealed rich-mode widget).
 */
export function caretRange() {
  const set = StateEffect.define<Span>()
  const field = StateField.define<Span>({
    create: () => null,
    update(value, tr) {
      for (const e of tr.effects) if (e.is(set)) value = e.value
      if (value && tr.docChanged) {
        value = { from: tr.changes.mapPos(value.from, -1), to: tr.changes.mapPos(value.to, 1) }
      }
      if (value && tr.selection) {
        const head = tr.selection.main.head
        if (head < value.from || head > value.to) value = null
      }
      return value
    },
  })
  return { set, field }
}

export function spansEqual(a: Span, b: Span) {
  return a === b || (!!a && !!b && a.from === b.from && a.to === b.to)
}

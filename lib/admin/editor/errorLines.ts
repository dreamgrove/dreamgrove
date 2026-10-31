import { EditorView, Decoration, type DecorationSet } from '@codemirror/view'
import { StateField, StateEffect } from '@codemirror/state'

// Highlights the line the MDX preview failed to compile at.

const setErrorLine = StateEffect.define<number | null>()

const errorLineDecoration = Decoration.line({
  attributes: { class: 'bg-red-100 dark:bg-red-900/40' },
})

export const errorLineField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(decorations, tr) {
    decorations = decorations.map(tr.changes)
    for (const effect of tr.effects) {
      if (!effect.is(setErrorLine)) continue
      if (effect.value === null) {
        decorations = Decoration.none
        continue
      }
      const doc = tr.state.doc
      const line = doc.line(Math.max(1, Math.min(effect.value, doc.lines)))
      decorations = Decoration.set([errorLineDecoration.range(line.from)])
    }
    return decorations
  },
  provide: (field) => EditorView.decorations.from(field),
})

/** Marks 1-based `line` as the error line, or clears it with null */
export function showErrorLine(view: EditorView, line: number | null) {
  view.dispatch({ effects: setErrorLine.of(line) })
}

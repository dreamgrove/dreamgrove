import { Decoration, EditorView, keymap } from '@codemirror/view'
import { EditorState, Prec, StateField, type Extension } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import type { SyntaxNode } from '@lezer/common'
import { build, type Built } from './build'
import { gapCursorExtension } from './gap'
import { linkLines } from './linkLines'
import { spellLoader, spellsLoaded } from './spellNames'
import { foldField, linkField, reveal, revealField } from './state'
import { richTheme } from './theme'
import type { HandlersRef } from './types'

export function richModeExtension(h: HandlersRef): Extension {
  const field = StateField.define<Built>({
    create: (state) => build(state, null, h),
    update(value, tr) {
      const prev = tr.startState.field(revealField, false) ?? null
      const cur = tr.state.field(revealField, false) ?? null
      if (
        tr.docChanged ||
        prev !== cur ||
        tr.startState.field(foldField, false) !== tr.state.field(foldField, false) ||
        syntaxTree(tr.startState) !== syntaxTree(tr.state) ||
        tr.reconfigured ||
        tr.effects.some((e) => e.is(spellsLoaded))
      ) {
        return build(tr.state, cur, h)
      }
      return value
    },
    provide: (f) => [
      EditorView.decorations.from(f, (v) => v.deco),
      EditorView.atomicRanges.of((view) => view.state.field(f, false)?.atomic ?? Decoration.none),
    ],
  })

  // Typing at a line start that has a hidden marker (a heading's `## `) would
  // otherwise land before the marker and break it; move it after.
  const leadFilter = EditorState.transactionFilter.of((tr) => {
    if (!tr.docChanged || !tr.isUserEvent('input.type')) return tr
    const built = tr.startState.field(field, false)
    if (!built) return tr
    const changes: { from: number; to: number; insert: string }[] = []
    tr.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) =>
      changes.push({ from: fromA, to: toA, insert: inserted.toString() })
    )
    if (changes.length !== 1) return tr
    const c = changes[0]
    const end = built.leads.get(c.from)
    if (c.from !== c.to || end === undefined) return tr
    if (tr.startState.doc.lineAt(c.from).from !== c.from) return tr
    return {
      changes: { from: end, insert: c.insert },
      selection: { anchor: end + c.insert.length },
      userEvent: 'input.type',
    }
  })

  const events = EditorView.domEventHandlers({
    mousedown(e, view) {
      if (e.altKey) {
        const pos = view.posAtCoords(e)
        if (pos == null) return false
        const line = view.state.doc.lineAt(pos)
        reveal(view, line.from, line.to)
        return true
      }
      const link = (e.target as HTMLElement).closest('.cm-rt-link')
      if (!link) return false
      const pos = view.posAtDOM(link)
      let node: SyntaxNode | null = syntaxTree(view.state).resolveInner(pos, 1)
      while (node && node.name !== 'Link') node = node.parent
      if (!node) return false
      const { from, to } = node
      if (e.ctrlKey || e.metaKey) {
        const url = node.getChild('URL')
        if (url) window.open(view.state.sliceDoc(url.from, url.to), '_blank', 'noopener')
        return true
      }
      setTimeout(() => h.current.openLink(from, to))
      return false
    },
  })

  // Backspace right after a quote/callout line's `>` markup joins the line onto
  // the quoted line above, instead of the markdown keymap stripping the `>` and
  // splitting the callout in two.
  const backspaceQuote = (view: EditorView) => {
    const { state } = view
    const sel = state.selection
    if (sel.ranges.length > 1 || !sel.main.empty) return false
    const head = sel.main.head
    const line = state.doc.lineAt(head)
    if (line.number === 1 || !/^\s*(?:>\s?)+$/.test(line.text.slice(0, head - line.from)))
      return false
    const prev = state.doc.line(line.number - 1)
    if (!/^\s*>/.test(prev.text)) return false
    view.dispatch({
      changes: { from: prev.to, to: head },
      selection: { anchor: prev.to },
      userEvent: 'delete.backward',
      scrollIntoView: true,
    })
    return true
  }

  // Must beat the markdown keymap, which is also Prec.high and registered first
  const quoteKeys = Prec.highest(keymap.of([{ key: 'Backspace', run: backspaceQuote }]))

  return [
    revealField,
    foldField,
    linkField,
    field,
    leadFilter,
    events,
    ...gapCursorExtension(field),
    quoteKeys,
    linkLines,
    spellLoader,
    richTheme,
  ]
}

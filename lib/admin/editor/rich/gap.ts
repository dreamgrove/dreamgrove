import { EditorState, Prec, type StateField } from '@codemirror/state'
import { EditorView, ViewPlugin, keymap, type ViewUpdate } from '@codemirror/view'
import type { Built } from './build'
import { el } from './dom'

/** Gap cursor, arrow stepping, and Enter/Backspace around the block cards in `field` */
export function gapCursorExtension(field: StateField<Built>) {
  // Block cards leave no text beside them, so the browser can't hold a caret at
  // their edges and typed text lands on the next text line. A cursor at a card
  // edge is a gap cursor instead: arrows step over the card, and typing or
  // Enter opens a fresh line on that side of it.
  const gapAt = (state: EditorState, pos: number) => {
    for (const [from, to] of state.field(field, false)?.blocks ?? []) {
      if (pos === from) return { at: from, before: true, card: from }
      if (pos === to) return { at: to, before: false, card: from }
      if (from > pos) break
    }
    return null
  }
  const emptyGap = (state: EditorState) => {
    const sel = state.selection
    return sel.ranges.length === 1 && sel.main.empty ? gapAt(state, sel.main.head) : null
  }

  // Arrows step over a card to its far edge, and on past that edge when text
  // lies beyond it; the edge itself is a stop only between two cards.
  const gapStep = EditorState.transactionFilter.of((tr) => {
    if (
      tr.docChanged ||
      !tr.selection ||
      !tr.isUserEvent('select') ||
      tr.isUserEvent('select.pointer')
    )
      return tr
    const sel = tr.selection.main
    const prev = tr.startState.selection.main.head
    if (!sel.empty || sel.head === prev || tr.selection.ranges.length > 1) return tr
    const blocks = tr.startState.field(field, false)?.blocks ?? []
    const len = tr.startState.doc.length
    const fwd = sel.head > prev
    let head = sel.head
    const card = blocks.find(([from, to]) => (fwd ? from === head : to === head))
    if (card) head = fwd ? card[1] : card[0]
    const edge = blocks.find(([from, to]) => (fwd ? to === head : from === head))
    if (edge) {
      const beyond = fwd ? head + 1 : head - 1
      const isCard = blocks.some(([from, to]) => (fwd ? from === beyond : to === beyond))
      if (beyond >= 0 && beyond <= len && !isCard) head = beyond
    }
    if (head === sel.head) return tr
    return [tr, { selection: { anchor: head }, scrollIntoView: true, sequential: true }]
  })

  const openGapLine = (view: EditorView, text: string) => {
    const gap = emptyGap(view.state)
    if (!gap) return false
    view.dispatch({
      changes: { from: gap.at, insert: gap.before ? `${text}\n` : `\n${text}` },
      selection: { anchor: gap.at + text.length + (gap.before ? 0 : 1) },
      userEvent: 'input.type',
      scrollIntoView: true,
    })
    return true
  }
  const gapInput = EditorView.inputHandler.of((view, _from, _to, text) => openGapLine(view, text))
  // Backspace never splices a card's source into a neighbouring line. Right
  // after a card it removes the card, and after a wrapper's closing edge the
  // whole wrapper; from the text line below a card it first steps onto it.
  const backspaceCard = (view: EditorView) => {
    const { state } = view
    const built = state.field(field, false)
    const sel = state.selection
    if (!built || sel.ranges.length > 1 || !sel.main.empty) return false
    const head = sel.main.head
    const line = state.doc.lineAt(head)
    const atEdge = built.blocks.find(([, to]) => to === head)
    const above = head === line.from ? built.blocks.find(([, to]) => to === head - 1) : undefined
    const card = atEdge ?? above
    if (!card) return false
    const whole = built.wrappers.get(card[0]) ?? card
    // A wrapper's opening edge: removing it alone would orphan the closing tag
    if (whole[0] === card[0] && whole[1] !== card[1]) return true
    const onCard = built.blocks.some(([from]) => from === head)
    if (!atEdge && !onCard) {
      // An empty line goes as usual; a text line steps onto the card first
      if (!line.text) return false
      view.dispatch({ selection: { anchor: head - 1 }, scrollIntoView: true })
      return true
    }
    const [from, to] = whole
    const cut = from > 0 ? { from: from - 1, to } : { from, to: Math.min(to + 1, state.doc.length) }
    view.dispatch({
      changes: cut,
      selection: { anchor: cut.from },
      userEvent: 'delete',
      scrollIntoView: true,
    })
    return true
  }

  const gapKeys = Prec.high(
    keymap.of([
      { key: 'Enter', run: (view) => openGapLine(view, '') },
      { key: 'Backspace', run: backspaceCard },
    ])
  )

  const gapCursor = ViewPlugin.fromClass(
    class {
      dom: HTMLElement

      constructor(readonly view: EditorView) {
        this.dom = el('div', 'cm-rt-gapcursor')
        view.scrollDOM.append(this.dom)
        this.schedule()
      }

      update(u: ViewUpdate) {
        if (u.selectionSet || u.docChanged || u.geometryChanged || u.focusChanged) this.schedule()
      }

      schedule() {
        this.view.requestMeasure<{ top: number; left: number; width: number } | null>({
          key: this,
          read: (view) => {
            const gap = view.hasFocus ? emptyGap(view.state) : null
            if (!gap) return null
            // Match the card itself
            const widget = Array.from(view.contentDOM.children).find(
              (c) => c.classList.contains('cm-rt-frame') && view.posAtDOM(c) === gap.card
            )
            if (!widget) return null
            const card = widget.firstElementChild ?? widget
            const rect = card.getBoundingClientRect()
            const scroller = view.scrollDOM.getBoundingClientRect()
            return {
              top: (gap.before ? rect.top : rect.bottom) - scroller.top + view.scrollDOM.scrollTop,
              left: rect.left - scroller.left + view.scrollDOM.scrollLeft,
              width: rect.width,
            }
          },
          write: (m) => {
            this.dom.style.display = m ? '' : 'none'
            this.view.scrollDOM.classList.toggle('cm-rt-gap', !!m)
            if (!m) return
            this.dom.style.top = `${m.top - 1}px`
            this.dom.style.left = `${m.left}px`
            this.dom.style.width = `${m.width}px`
          },
        })
      }

      destroy() {
        this.dom.remove()
        this.view.scrollDOM.classList.remove('cm-rt-gap')
      }
    }
  )

  return [gapStep, gapInput, gapKeys, gapCursor]
}

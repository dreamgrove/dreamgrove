import { EditorSelection, type EditorState, type Line } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import { formatCell } from './rich/table/cells'

// Text transforms behind the editor toolbar.

/** Wraps the selection in `before`/`after`, or unwraps it when already wrapped. */
export function toggleInline(
  view: EditorView,
  before: string,
  after = before,
  placeholder = 'text'
) {
  if (formatCell(before, after, placeholder)) return
  const { state } = view
  const changes = state.changeByRange((range) => {
    const text = state.sliceDoc(range.from, range.to)
    const outerFrom = range.from - before.length
    const outerTo = range.to + after.length
    if (
      outerFrom >= 0 &&
      state.sliceDoc(outerFrom, range.from) === before &&
      state.sliceDoc(range.to, outerTo) === after
    ) {
      return {
        changes: [
          { from: outerFrom, to: range.from, insert: '' },
          { from: range.to, to: outerTo, insert: '' },
        ],
        range: EditorSelection.range(outerFrom, range.to - before.length),
      }
    }
    const inner = text || placeholder
    return {
      changes: { from: range.from, to: range.to, insert: before + inner + after },
      range: EditorSelection.range(
        range.from + before.length,
        range.from + before.length + inner.length
      ),
    }
  })
  view.dispatch(state.update(changes, { scrollIntoView: true, userEvent: 'input' }))
  view.focus()
}

function selectedLines(state: EditorState) {
  const { from, to } = state.selection.main
  const first = state.doc.lineAt(from).number
  const last = state.doc.lineAt(to).number
  const lines: Line[] = []
  for (let n = first; n <= last; n++) lines.push(state.doc.line(n))
  return lines
}

const HEADING_RE = /^(\s{0,3})#{1,6}\s+/

export function headingLevel(state: EditorState): number {
  const line = state.doc.lineAt(state.selection.main.head)
  const m = /^\s{0,3}(#{1,6})\s/.exec(line.text)
  return m ? m[1].length : 0
}

/** Sets the selected lines to a heading level. 0 for body text. */
export function setHeading(view: EditorView, level: number) {
  const lines = selectedLines(view.state)
  view.dispatch({
    changes: lines.map((line) => {
      const m = HEADING_RE.exec(line.text)
      return {
        from: line.from,
        to: line.from + (m ? m[0].length : 0),
        insert: level ? '#'.repeat(level) + ' ' : '',
      }
    }),
    userEvent: 'input',
  })
  view.focus()
}

const PREFIXES: Record<string, RegExp> = {
  '- ': /^(\s*)[-*+]\s+/,
  '1. ': /^(\s*)\d+[.)]\s+/,
  '> ': /^(\s*)>\s?/,
}

/** Toggles a list/quote prefix on every selected line. */
export function toggleLinePrefix(view: EditorView, prefix: '- ' | '1. ' | '> ') {
  const lines = selectedLines(view.state).filter((l, _, all) => all.length === 1 || l.text.trim())
  const re = PREFIXES[prefix]
  const allHave = lines.every((l) => re.test(l.text))
  view.dispatch({
    changes: lines.map((line, i) => {
      const m = re.exec(line.text)
      if (allHave && m) {
        return { from: line.from + m[1].length, to: line.from + m[0].length, insert: '' }
      }
      // Replace any other list marker instead of stacking them
      const other = Object.values(PREFIXES)
        .map((r) => r.exec(line.text))
        .find(Boolean)
      const indent = /^\s*/.exec(line.text)![0].length
      const insert = prefix === '1. ' ? `${i + 1}. ` : prefix
      return {
        from: line.from + indent,
        to: other ? line.from + other[0].length : line.from + indent,
        insert,
      }
    }),
    userEvent: 'input',
  })
  view.focus()
}

export function insertBlock(view: EditorView, text: string) {
  const { state } = view
  const { from, to } = state.selection.main
  const before = state.sliceDoc(Math.max(0, from - 2), from)
  const after = state.sliceDoc(to, to + 2)
  const lead = from === 0 || before === '\n\n' ? '' : before.endsWith('\n') ? '\n' : '\n\n'
  const trail = after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n'
  const insert = lead + text + trail
  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + lead.length + text.length },
    scrollIntoView: true,
    userEvent: 'input',
  })
  view.focus()
}

export function replaceRange(view: EditorView, from: number, to: number, text: string) {
  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: from + text.length },
    scrollIntoView: true,
    userEvent: 'input',
  })
  view.focus()
}

export function insertLink(view: EditorView) {
  const { state } = view
  const { from, to } = state.selection.main
  const text = state.sliceDoc(from, to) || 'link text'
  const isUrl = /^https?:\/\//.test(text)
  const insert = isUrl ? `[link text](${text})` : `[${text}](https://)`
  const selFrom = isUrl ? from + 1 : from + text.length + 3
  const selTo = isUrl ? from + 10 : from + insert.length - 1
  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: selFrom, head: selTo },
    userEvent: 'input',
  })
  view.focus()
}

export function insertRule(view: EditorView) {
  insertBlock(view, '---')
}

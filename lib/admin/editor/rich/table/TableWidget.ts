import type { EditorView } from '@codemirror/view'
import { frameDom } from '../boxes'
import { actionButton, el } from '../dom'
import { removeRange } from '../editing'
import { reveal } from '../state'
import type { HandlersRef } from '../types'
import { SourceWidget } from '../widgets/SourceWidget'
import { cellMarkdown, formatCell, inlineHtml, clearActiveCell, setActiveCell } from './cells'
import { cellSource, parseTable, tableCells } from './source'

function focusCell(view: EditorView, from: number, r: number, c: number) {
  for (const wrap of view.contentDOM.querySelectorAll<HTMLElement>('.cm-rt-table-wrap')) {
    if (view.posAtDOM(wrap) !== from) continue
    wrap.querySelector<HTMLElement>(`[data-r="${r}"][data-c="${c}"]`)?.focus()
    return
  }
}

export class TableWidget extends SourceWidget {
  constructor(
    raw: string,
    readonly h: HandlersRef
  ) {
    super(raw, '')
  }

  get estimatedHeight() {
    return 12 + this.raw.split('\n').length * 32
  }

  /** Writes one cell back into the source; false when nothing changed */
  commit(view: EditorView, from: number, r: number, c: number, value: string) {
    if (view.state.sliceDoc(from, from + this.raw.length) !== this.raw) return false
    const row = tableCells(this.raw)[r]
    if (!row) return false
    const text = cellSource(value)
    const span = row.cells[c]
    let change: { from: number; to: number; insert: string }
    if (span) {
      const old = this.raw.slice(span.from, span.to)
      if (old === text) return false
      const insert = old || !text ? text : ` ${text} `
      // An empty cell's range sits right after its pipe so we take its padding too
      const to = old
        ? span.to
        : span.to + (/^[ \t]*/.exec(this.raw.slice(span.to))?.[0].length ?? 0)
      change = { from: span.from, to, insert }
    } else {
      if (!text) return false
      const gaps = ' |'.repeat(c - row.cells.length)
      change = {
        from: row.end,
        to: row.end,
        insert: row.piped ? `${gaps} ${text} |` : `${gaps} | ${text}`,
      }
    }
    view.dispatch({
      changes: { from: from + change.from, to: from + change.to, insert: change.insert },
      userEvent: 'input',
    })
    return true
  }

  toDOM(view: EditorView) {
    const rows = parseTable(this.raw)
    const spans = tableCells(this.raw)
    const wrap = el('div', 'cm-rt-table-wrap')
    const table = el('table', 'cm-rt-table')
    const head = document.createElement('thead')
    const body = document.createElement('tbody')
    const cells: HTMLElement[][] = []

    // Cells edit in place, rendered as they are
    // Leaving one (blur, Enter, Tab) writes it back into the source.
    // Cells holding raw HTML can't round-trip through the rendering, so
    // those edit as markdown source instead.
    let editing: HTMLElement | null = null
    let dirty = false
    const source = (r: number, c: number) => {
      const s = spans[r]?.cells[c]
      return s ? this.raw.slice(s.from, s.to) : ''
    }
    const isRich = (r: number, c: number) => !/<[^>]+>/.test(rows[r][c])
    const finish = (td: HTMLElement, save: boolean, next?: [number, number]) => {
      if (editing !== td) return
      editing = null
      clearActiveCell(td)
      const r = Number(td.dataset.r)
      const c = Number(td.dataset.c)
      if (!wrap.isConnected) return
      const value = isRich(r, c) ? cellMarkdown(td) : (td.textContent ?? '')
      let from: number
      let changed: boolean
      try {
        from = view.posAtDOM(wrap)
        changed = save && dirty && this.commit(view, from, r, c, value)
      } catch {
        // Blurred by the widget's removal inside an editor update (see destroy)
        return
      }
      if (!changed) {
        td.classList.remove('cm-rt-cell-editing')
        td.innerHTML = inlineHtml(rows[r][c])
      }
      if (next) {
        const target = cells[next[0]]?.[next[1]]
        if (changed) focusCell(view, from, ...next)
        // Staying in the same cell: focus() wouldn't fire again
        else if (target === document.activeElement) target.dispatchEvent(new FocusEvent('focus'))
        else target?.focus()
      }
      return from
    }
    /** Leaves the table, caret just after it */
    const exit = (td: HTMLElement, save: boolean) => {
      const from = finish(td, save)
      if (from === undefined) return
      const end = Math.min(view.state.doc.length, from + this.raw.length)
      view.dispatch({ selection: { anchor: end } })
      view.focus()
    }

    rows.forEach((row, r) => {
      const tr = document.createElement('tr')
      cells.push([])
      row.forEach((cell, c) => {
        const td = document.createElement(r === 0 ? 'th' : 'td')
        const rich = isRich(r, c)
        td.className = 'cm-rt-cell'
        td.dataset.r = String(r)
        td.dataset.c = String(c)
        td.contentEditable = rich ? 'true' : 'plaintext-only'
        if (!rich && td.contentEditable !== 'plaintext-only') td.contentEditable = 'true'
        td.spellcheck = false
        td.innerHTML = inlineHtml(cell)
        td.addEventListener('focus', () => {
          editing = td
          dirty = false
          setActiveCell({ td, rich, touch: () => (dirty = true) })
          td.classList.add(rich ? 'cm-rt-cell-active' : 'cm-rt-cell-editing')
          if (!rich) td.textContent = source(r, c)
          // A click places the caret itself; keyboard moves land at the end
          const sel = window.getSelection()
          if (sel && (!rich || !td.contains(sel.anchorNode))) {
            sel.selectAllChildren(td)
            sel.collapseToEnd()
          }
        })
        td.addEventListener('blur', () => {
          td.classList.remove('cm-rt-cell-active')
          finish(td, true)
        })
        td.addEventListener('input', () => (dirty = true))
        // Pasted and dropped content arrives as plain text on one line
        td.addEventListener('paste', (e) => {
          e.preventDefault()
          const text = e.clipboardData?.getData('text/plain') ?? ''
          document.execCommand('insertText', false, text.replace(/\s*\n\s*/g, ' '))
        })
        td.addEventListener('drop', (e) => e.preventDefault())
        td.addEventListener('keydown', (e) => {
          const mod = e.ctrlKey || e.metaKey
          const key = e.key.toLowerCase()
          if (mod && !e.altKey && (key === 'b' || key === 'i')) {
            e.preventDefault()
            formatCell(key === 'b' ? '**' : '*', key === 'b' ? '**' : '*')
          } else if (mod && key === 'u') {
            e.preventDefault()
          } else if (mod && key === 's') {
            // The editor's keymap doesn't see keys inside the widget so we have to write the
            // cell back, then hand the shortcut to the editor so it saves
            e.preventDefault()
            if (dirty) finish(td, true, [r, c])
            const init = {
              key: e.key,
              code: e.code,
              ctrlKey: e.ctrlKey,
              metaKey: e.metaKey,
              bubbles: true,
            }
            view.contentDOM.dispatchEvent(new KeyboardEvent('keydown', init))
          } else if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault()
          } else if (e.key === 'Escape') {
            e.preventDefault()
            exit(td, false)
          } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (r + 1 < rows.length) finish(td, true, [r + 1, c])
            else exit(td, true)
          } else if (e.key === 'Tab') {
            e.preventDefault()
            const i = r * row.length + c + (e.shiftKey ? -1 : 1)
            if (i < 0 || i >= rows.length * row.length) exit(td, true)
            else finish(td, true, [Math.floor(i / row.length), i % row.length])
          }
        })
        cells[r].push(td)
        tr.append(td)
      })
      ;(r === 0 ? head : body).append(tr)
    })
    table.append(head, body)

    // Actions on the whole table first write back the cell being edited, which
    // rebuilds this widget
    const settle = () => {
      const from = view.posAtDOM(wrap)
      if (editing) finish(editing, true)
      const doc = view.state.doc
      const last = Math.min(doc.lines, doc.lineAt(from).number + this.raw.split('\n').length - 1)
      return { from, to: doc.line(last).to }
    }
    const edit = () => {
      const { from, to } = settle()
      const cells = parseTable(view.state.sliceDoc(from, to))
      this.h.current.editSnippet('table', { cells }, from, to)
    }
    wrap.addEventListener(
      'mousedown',
      (e) => {
        const target = e.target as HTMLElement
        if (target.closest('.cm-rt-btn')) return
        if (e.altKey) {
          // Ahead of wire's reveal, which would tear down a cell mid-edit
          if (!editing) return
          e.preventDefault()
          e.stopImmediatePropagation()
          const { from, to } = settle()
          reveal(view, from, to)
          return
        }
        // The first click enters the cell and a link opens on a click once inside
        const link = target.closest<HTMLElement>('.cm-rt-cell .cm-rt-link')
        const td = link?.closest<HTMLElement>('.cm-rt-cell')
        if (!link || !td || editing !== td) return
        e.preventDefault()
        e.stopImmediatePropagation()
        if (link.dataset.href !== undefined && (e.ctrlKey || e.metaKey)) {
          window.open(link.dataset.href, '_blank', 'noopener')
          return
        }
        // Which link of the cell, then where that link sits in the source
        const nth = [...td.querySelectorAll('.cm-rt-link')].indexOf(link)
        const r = Number(td.dataset.r)
        const c = Number(td.dataset.c)
        const rect = link.getBoundingClientRect()
        const at = { left: rect.left, bottom: rect.bottom, scrollTop: view.scrollDOM.scrollTop }
        const { from, to } = settle()
        const raw = view.state.sliceDoc(from, to)
        const span = tableCells(raw)[r]?.cells[c]
        if (!span) return
        const cell = raw.slice(span.from, span.to)
        const masked = cell.replace(/`[^`]+`/g, (m) => ' '.repeat(m.length))
        const m = [...masked.matchAll(/\[([^\]]+)\]\(([^)]*)\)/g)][nth]
        if (!m) return
        const a = from + span.from + (m.index ?? 0)
        view.dispatch({ selection: { anchor: a } })
        this.h.current.openLink(a, a + m[0].length, at)
      },
      true
    )
    const actions = el('span', 'cm-rt-card-actions cm-rt-table-actions')
    actions.append(
      actionButton('editThin', 'Edit table', edit),
      actionButton('closeThin', 'Remove table', () => {
        const { from, to } = settle()
        removeRange(view, from, to)
      })
    )
    wrap.append(table, actions)
    wrap.title = 'Click a cell to edit it, Enter/Tab to move on (Alt+click for source)'
    this.wire(wrap, view, edit)
    const frame = frameDom(this.stack, wrap, 6, 6)
    // Torn down mid-edit (the table changed underneath): the blur that follows
    // can't write back during the editor's update, so the edit is dropped
    tableTeardown.set(frame, () => {
      editing = null
      clearActiveCell(wrap)
    })
    return frame
  }

  destroy(dom: HTMLElement) {
    tableTeardown.get(dom)?.()
    tableTeardown.delete(dom)
  }
}

const tableTeardown = new WeakMap<HTMLElement, () => void>()

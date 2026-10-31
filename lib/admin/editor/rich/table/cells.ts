import { colorFor } from '../colors'
import { condColor, condHtml } from '../conditions'
import { escapeHtml } from '../dom'

/**
 * Renders a table cell's inline markdown.
 * Elements contain what cellMarkdown needs to write them back.
 */
export function inlineHtml(src: string) {
  const held: string[] = []
  const hold = (html: string) => `\u0000${held.push(html) - 1}\u0000`
  const token = (raw: string, cls: string, label: string, color?: string) =>
    hold(
      `<span class="${cls}" contenteditable="false" data-src="${raw}"${
        color ? ` style="--rt-color:${color}"` : ''
      }>${label}</span>`
    )
  const unescape = (s: string) =>
    s
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
  return escapeHtml(src.replace(/<[^>]+>/g, ''))
    .replace(/`([^`]+)`/g, (_m, t) => hold(`<code class="cm-rt-code">${t}</code>`))
    .replace(/!(\d+)\|([^!]+)!|!([^!\s][^!]*)!/g, (m, _id, a, b) =>
      token(m, 'cm-spell-token', a ?? b)
    )
    .replace(/\[\*([^\]]+)\]/g, (m, c) =>
      token(m, 'cm-rt-cond', condHtml(unescape(c)), condColor(unescape(c)))
    )
    .replace(
      /:([a-zA-Z]+|#[0-9a-fA-F]{3,8})\[([^\]]+)\]/g,
      (_m, c, t) => `<span data-color="${c}" style="color:${colorFor(c)}">${t}</span>`
    )
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, '<span class="cm-rt-link" data-href="$2">$1</span>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>')
    .replace(/~~([^~]+)~~/g, '<s>$1</s>')
    .replace(/\u0000(\d+)\u0000/g, (_m, i) => held[Number(i)])
}

/** A rendered cell back to inline markdown */
export function cellMarkdown(node: Node): string {
  const wrap = (inner: string, open: string, close = open) => {
    const core = inner.trim()
    if (!core) return inner
    const lead = inner.slice(0, inner.length - inner.trimStart().length)
    const trail = inner.slice(inner.trimEnd().length)
    return lead + open + core + close + trail
  }
  let out = ''
  node.childNodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) {
      out += (n.textContent ?? '').replace(/ /g, ' ')
      return
    }
    if (!(n instanceof HTMLElement)) return
    const { src, href, color } = n.dataset
    if (src !== undefined) out += src
    else if (href !== undefined) out += `[${cellMarkdown(n)}](${href})`
    else if (color !== undefined) out += wrap(cellMarkdown(n), `:${color}[`, ']')
    else {
      switch (n.tagName) {
        case 'B':
        case 'STRONG':
          out += wrap(cellMarkdown(n), '**')
          break
        case 'I':
        case 'EM':
          out += wrap(cellMarkdown(n), '*')
          break
        case 'S':
        case 'STRIKE':
        case 'DEL':
          out += wrap(cellMarkdown(n), '~~')
          break
        case 'CODE':
          out += wrap(n.textContent ?? '', '`')
          break
        case 'BR':
          out += ' '
          break
        case 'DIV':
        case 'P':
          out += ' ' + cellMarkdown(n)
          break
        default:
          out += cellMarkdown(n)
      }
    }
  })
  return out
}

/** The table cell being edited */
type ActiveCell = { td: HTMLElement; rich: boolean; touch: () => void }
let activeCell: ActiveCell | null = null

export function setActiveCell(cell: ActiveCell) {
  activeCell = cell
}

/** Forgets the active cell when `within` holds it (blurred or torn down) */
export function clearActiveCell(within: HTMLElement) {
  if (activeCell && within.contains(activeCell.td)) activeCell = null
}

const CELL_FORMATS: Record<string, string> = { '**': 'B', '*': 'I', '~~': 'S', '`': 'CODE' }

/**
 * toggleInline for a table cell being edited: wraps the selection (or a
 * placeholder) in the matching element, or unwraps it when already inside one.
 * False when no cell has the selection.
 */
export function formatCell(before: string, after: string, placeholder = 'text') {
  const cell = activeCell
  const sel = window.getSelection()
  if (!cell || !cell.td.isConnected || !sel?.rangeCount || !cell.td.contains(sel.anchorNode))
    return false
  const range = sel.getRangeAt(0)
  cell.touch()
  if (!cell.rich) {
    document.execCommand('insertText', false, before + (range.toString() || placeholder) + after)
    return true
  }
  const color = /^:(.+)\[$/.exec(before)?.[1]
  const tag = color ? 'SPAN' : CELL_FORMATS[before]
  if (!tag) return true
  for (let n: Node | null = range.commonAncestorContainer; n && n !== cell.td; n = n.parentNode) {
    if (
      !(n instanceof HTMLElement) ||
      n.tagName !== tag ||
      (color && n.dataset.color === undefined)
    )
      continue
    if (color && n.dataset.color !== color) {
      n.dataset.color = color
      n.style.color = colorFor(color)
      return true
    }
    const kids = [...n.childNodes]
    n.replaceWith(...kids)
    if (kids.length) {
      range.setStartBefore(kids[0])
      range.setEndAfter(kids[kids.length - 1])
      sel.removeAllRanges()
      sel.addRange(range)
    }
    return true
  }
  const wrap = document.createElement(tag)
  if (tag === 'CODE') wrap.className = 'cm-rt-code'
  if (color) {
    wrap.dataset.color = color
    wrap.style.color = colorFor(color)
  }
  if (range.collapsed) wrap.textContent = placeholder
  else wrap.append(range.extractContents())
  range.insertNode(wrap)
  sel.selectAllChildren(wrap)
  return true
}

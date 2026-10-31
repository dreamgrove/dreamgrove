import type { DocTag } from '../blocks/tags'
import { formFromTag } from '../blocks/form'
import { el, escapeHtml } from './dom'

/** Display names of the document's talent toggles by id; refreshed on every build */
let toggleNames = new Map<string, string>()

export function setToggleNames(names: Map<string, string>) {
  toggleNames = names
}

export const CONDITION_RE = /^\[\*([^\]\n]+)\]\s*$/
/** A `[*…]` gating the tag that follows it on the line */
export const CONDITION_PREFIX = /^\s*\[\*([^\]\n]+)\]\s*$/

/** Toggle ids a `[*…]` expression references */
export const conditionIds = (expr: string) =>
  expr
    .split(/&&|\|\|/)
    .map((p) => p.replace(/^[\s~!(]+|[\s)]+$/g, ''))
    .filter(Boolean)

/** The id conditions use for a <Checkbox>: its `id`, else its spell id */
export function toggleId(tag: DocTag) {
  const { values } = formFromTag(tag)
  return String(values.id || values.spellId || '').trim()
}

/** A condition term's display name: its toggle's name when the page has one */
function termName(term: string) {
  const id = term.replace(/^[\s~!(]+|[\s)]+$/g, '')
  return { neg: /^\s*\(?\s*[~!]/.test(term), name: toggleNames.get(id) ?? id }
}

function describeCondition(expr: string) {
  return expr
    .split(/(&&|\|\|)/)
    .map((p) => {
      if (p === '&&' || p === '||') return p === '&&' ? ' and ' : ' or '
      const { neg, name } = termName(p)
      return (neg ? 'not ' : '') + name
    })
    .join('')
}

const COND_OPS: Record<string, string> = { '&&': 'and', '||': 'or' }

const COND_TERMS = 3

export function condHtml(expr: string) {
  const parts = expr
    .split(/(&&|\|\|)/)
    .map((p) => p.trim())
    .filter(Boolean)
  const terms = Math.ceil(parts.length / 2)
  const seg = (cls: string, text: string) => `<span class="${cls}">${escapeHtml(text)}</span>`
  // Terms sit at even indexes; keep the operator before the count
  const shown = terms > COND_TERMS ? parts.slice(0, COND_TERMS * 2) : parts
  let html = seg('cm-rt-cond-if', 'if')
  for (const p of shown) {
    if (COND_OPS[p]) {
      html += seg('cm-rt-cond-op', COND_OPS[p])
      continue
    }
    const { neg, name } = termName(p)
    if (neg) html += seg('cm-rt-cond-op', 'not')
    html += seg('cm-rt-cond-name', name)
  }
  if (terms > COND_TERMS) html += seg('cm-rt-cond-name', `${terms - COND_TERMS} more`)
  return html
}

export function condChip(expr: string, html = condHtml(expr)) {
  const chip = el('span', 'cm-rt-cond')
  chip.innerHTML = html
  chip.style.setProperty('--rt-color', condColor(expr))
  chip.title = `if ${describeCondition(expr)} · [*${expr}]`
  return chip
}

const COND_COLORS = [
  '#C5E6A6',
  '#8ec5ff',
  '#d4a6ff',
  '#ffd27a',
  '#ff9e9e',
  '#7fe0d0',
  '#ffb07a',
  '#f5a6d8',
  '#b8c4ff',
  '#e6e08a',
]

/** A stable colour per condition */
export function condColor(expr: string) {
  const key = expr.replace(/\s+/g, '')
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0
  return COND_COLORS[Math.abs(h) % COND_COLORS.length]
}

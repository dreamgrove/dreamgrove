// Finds registered component tags in a document and parses their attributes.
import type { EditorState } from '@codemirror/state'
import { BY_TAG, type BlockDef } from './registry'

export interface ParsedAttr {
  name: string
  /** Literal text after `=`, or null for a plain boolean attribute */
  raw: string | null
}

export interface TagMatch {
  block: BlockDef
  tag: string
  from: number
  to: number
  selfClosing: boolean
  attrs: ParsedAttr[]
}

// Skips a JS string or template literal starting at `i` and returns the index after it.
function skipJsString(src: string, i: number): number {
  const q = src[i]
  i++
  while (i < src.length && src[i] !== q) {
    if (src[i] === '\\') i++
    i++
  }
  return i + 1
}

// Skips a balanced `{…}` starting at `i` and returns the index after the closing brace.
function skipBraces(src: string, i: number): number {
  let depth = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '"' || c === "'" || c === '`') {
      i = skipJsString(src, i)
      continue
    }
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return i + 1
    }
    i++
  }
  return -1
}

// Parses `<Tag attrs…>` starting at `from` (the `<`).
// Returns null when the tag is unterminated.
function parseOpeningTag(src: string, from: number) {
  const m = /^<([A-Z][\w.]*)/.exec(src.slice(from, from + 64))
  if (!m) return null
  let i = from + m[0].length
  const attrs: ParsedAttr[] = []
  while (i < src.length) {
    while (/\s/.test(src[i] ?? '')) i++
    const c = src[i]
    if (c === undefined) return null
    if (c === '>') return { tag: m[1], to: i + 1, selfClosing: false, attrs }
    if (c === '/' && src[i + 1] === '>') return { tag: m[1], to: i + 2, selfClosing: true, attrs }
    if (c === '{') {
      const end = skipBraces(src, i)
      if (end < 0) return null
      attrs.push({ name: '', raw: src.slice(i, end) })
      i = end
      continue
    }
    const nm = /^[A-Za-z_][\w:.-]*/.exec(src.slice(i, i + 128))
    if (!nm) return null
    i += nm[0].length
    while (/\s/.test(src[i] ?? '')) i++
    if (src[i] !== '=') {
      attrs.push({ name: nm[0], raw: null })
      continue
    }
    i++
    while (/\s/.test(src[i] ?? '')) i++
    const start = i
    if (src[i] === '"' || src[i] === "'") {
      const close = src.indexOf(src[i], i + 1)
      if (close < 0) return null
      i = close + 1
    } else if (src[i] === '{') {
      i = skipBraces(src, i)
      if (i < 0) return null
    } else return null
    attrs.push({ name: nm[0], raw: src.slice(start, i) })
  }
  return null
}

const TAG_START = new RegExp(`<(${[...BY_TAG.keys()].join('|')})\\b`, 'g')

/** The registered component whose opening tag contains `pos` */
function findTagAt(doc: string, pos: number): TagMatch | null {
  const windowStart = Math.max(0, pos - 20000)
  const slice = doc.slice(windowStart, pos + 64)
  const starts: number[] = []
  for (const m of slice.matchAll(TAG_START)) {
    const at = windowStart + (m.index ?? 0)
    if (at <= pos) starts.push(at)
  }
  // Nearest first; a few tries covers a cursor inside a tag nested after others
  for (const at of starts.reverse().slice(0, 4)) {
    const parsed = parseOpeningTag(doc, at)
    if (parsed && pos <= parsed.to) {
      const block = BY_TAG.get(parsed.tag)
      if (block) return { block, from: at, ...parsed }
    }
  }
  return null
}

/** findTagAt over an editor's document, reading only the text near `pos` */
export function tagAtPos(state: EditorState, pos: number): TagMatch | null {
  const from = Math.max(0, pos - 20000)
  const match = findTagAt(state.doc.sliceString(from, pos + 20000), pos - from)
  return match ? { ...match, from: match.from + from, to: match.to + from } : null
}

// --- Whole-document scan (rich mode) -----------------------------------------

export interface DocTag extends TagMatch {
  /** Matching `</Tag>` for wrapping blocks */
  close?: { from: number; to: number }
}

/** Every registered component tag in `doc` */
export function findAllTags(doc: string): DocTag[] {
  const out: DocTag[] = []
  for (const m of doc.matchAll(TAG_START)) {
    const at = m.index ?? 0
    const parsed = parseOpeningTag(doc, at)
    const block = parsed && BY_TAG.get(parsed.tag)
    if (!parsed || !block) continue
    const tag: DocTag = { block, from: at, ...parsed }
    if (!parsed.selfClosing) tag.close = findClose(doc, parsed.tag, parsed.to)
    out.push(tag)
  }
  return out
}

/** Nesting-aware search for the `</tag>` matching an opening tag ending at `from` */
export function findClose(doc: string, tag: string, from: number) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*?(/?)>`, 'g')
  re.lastIndex = from
  let depth = 1
  let c: RegExpExecArray | null
  while ((c = re.exec(doc))) {
    if (c[1]) depth--
    else if (!c[2]) depth++
    if (depth === 0) return { from: c.index, to: c.index + c[0].length }
  }
}

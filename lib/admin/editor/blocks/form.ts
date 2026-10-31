// Form state for a block: read from an existing tag, edited, written back.
import type { BlockDef, Field, TalentColor, Values } from './registry'
import type { ParsedAttr, TagMatch } from './tags'

// Reads an attribute expression such as `{[1, 2]}` or `{[{ color: "x", nodes: ["a"] }]}`.
// Only JS literals are accepted (strings, numbers, booleans, null, arrays, objects with bare
// or quoted keys, trailing commas) and nothing is ever evaluated: the document may come from
// anyone. Anything else stays locked as raw text.
function evalExpression(raw: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: parseLiteral(raw.slice(1, -1)) }
  } catch {
    return { ok: false }
  }
}

const ESCAPES: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  b: '\b',
  f: '\f',
  v: '\v',
  0: '\0',
}

function parseLiteral(src: string): unknown {
  let i = 0
  const fail = (): never => {
    throw new SyntaxError(`Unexpected input at ${i}`)
  }
  const skip = () => {
    while (i < src.length) {
      if (/\s/.test(src[i])) i++
      else if (src.startsWith('//', i))
        i = src.includes('\n', i) ? src.indexOf('\n', i) : src.length
      else if (src.startsWith('/*', i))
        i = src.indexOf('*/', i) < 0 ? fail() : src.indexOf('*/', i) + 2
      else break
    }
  }
  const string = (): string => {
    const q = src[i++]
    let out = ''
    while (src[i] !== q) {
      if (i >= src.length || (q !== '`' && src[i] === '\n')) fail()
      if (q === '`' && src.startsWith('${', i)) fail()
      if (src[i] !== '\\') {
        out += src[i++]
        continue
      }
      const c = src[++i]
      if (c === 'u') {
        const hex = src.slice(i + 1, i + 5)
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) fail()
        out += String.fromCharCode(parseInt(hex, 16))
        i += 5
      } else {
        out += ESCAPES[c] ?? c
        i++
      }
    }
    i++
    return out
  }
  const value = (): unknown => {
    skip()
    const c = src[i]
    if (c === '"' || c === "'" || c === '`') return string()
    if (c === '[') {
      i++
      const arr: unknown[] = []
      for (skip(); src[i] !== ']'; skip()) {
        arr.push(value())
        skip()
        if (src[i] === ',') i++
        else if (src[i] !== ']') fail()
      }
      i++
      return arr
    }
    if (c === '{') {
      i++
      const obj: Record<string, unknown> = {}
      for (skip(); src[i] !== '}'; skip()) {
        let key: string
        if (src[i] === '"' || src[i] === "'") key = string()
        else {
          const m = /^[A-Za-z_$][\w$]*|^\d+/.exec(src.slice(i)) ?? fail()
          key = m[0]
          i += key.length
        }
        skip()
        if (src[i++] !== ':') fail()
        Object.defineProperty(obj, key, {
          value: value(),
          enumerable: true,
          writable: true,
          configurable: true,
        })
        skip()
        if (src[i] === ',') i++
        else if (src[i] !== '}') fail()
      }
      i++
      return obj
    }
    const m = /^(?:-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?|true|false|null)(?![\w$])/.exec(
      src.slice(i)
    )
    if (!m) fail()
    i += m![0].length
    return m![0] === 'true'
      ? true
      : m![0] === 'false'
        ? false
        : m![0] === 'null'
          ? null
          : Number(m![0])
  }
  const result = value()
  skip()
  if (i < src.length) fail()
  return result
}

/** Header row plus `rows - 1` body rows */
export function emptyTable(rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => (r === 0 ? `Header ${c + 1}` : ''))
  )
}

function coerce(field: Field, value: unknown): unknown {
  switch (field.kind) {
    case 'bool':
      return value === true || value === 'true'
    case 'number':
    case 'spell':
      return value === '' || value == null ? '' : String(value)
    case 'spells':
    case 'strings':
      return Array.isArray(value) ? value.map(String) : []
    case 'table':
      return Array.isArray(value)
        ? value.map((row) => (Array.isArray(row) ? row.map(String) : []))
        : emptyTable(3, 3)
    case 'talentColors':
      return Array.isArray(value)
        ? value
            .filter((c) => c && typeof c === 'object')
            .map((c) => ({
              color: String(c.color ?? ''),
              nodes: Array.isArray(c.nodes) ? c.nodes.map(String) : [],
            }))
        : []
    default:
      return value == null ? '' : String(value)
  }
}

export interface FormState {
  values: Values
  /** Attributes kept unchanged: unknown props, spreads, and expressions the form can't read */
  passthrough: ParsedAttr[]
  /** Field keys that fell back to passthrough because their value wasn't a literal */
  locked: string[]
}

export function emptyForm(block: BlockDef): FormState {
  const values: Values = {}
  for (const f of block.fields) {
    values[f.key] =
      f.kind === 'select' && f.required ? (f.options?.[0]?.value ?? '') : coerce(f, undefined)
  }
  if (block.id === 'callout') values.type = 'NOTE'
  if (block.id === 'talents') values.viewOnly = true
  if (block.id === 'wowhead') values.type = 'spell'
  return { values, passthrough: [], locked: [] }
}

export function formFromTag(match: TagMatch): FormState {
  const state = emptyForm(match.block)
  const fields = new Map(match.block.fields.map((f) => [f.key, f]))
  for (const attr of match.attrs) {
    const field = fields.get(attr.name)
    if (!field) {
      state.passthrough.push(attr)
      continue
    }
    if (attr.raw === null) {
      state.values[field.key] = coerce(field, true)
    } else if (attr.raw.startsWith('{')) {
      const res = evalExpression(attr.raw)
      if (res.ok) state.values[field.key] = coerce(field, res.value)
      else {
        state.passthrough.push(attr)
        state.locked.push(field.key)
      }
    } else {
      state.values[field.key] = coerce(field, attr.raw.slice(1, -1))
    }
  }
  return state
}

// --- Serializing ------------------------------------------------------------

function jsString(s: string) {
  return JSON.stringify(s)
}

function formatColors(colors: TalentColor[]) {
  const rows = colors
    .filter((c) => c.color && c.nodes.length)
    .map(
      (c) => `    { color: ${jsString(c.color)}, nodes: [${c.nodes.map(jsString).join(', ')}] },`
    )
  return `{[\n${rows.join('\n')}\n  ]}`
}

function serializeField(field: Field, value: unknown): string | null {
  switch (field.kind) {
    case 'bool':
      return value ? field.key : null
    case 'number':
    case 'spell': {
      const s = String(value ?? '').trim()
      if (!s) return null
      return /^-?\d+(\.\d+)?$/.test(s) ? `${field.key}={${s}}` : `${field.key}=${jsString(s)}`
    }
    case 'spells': {
      const ids = (value as string[]).filter(Boolean)
      if (!ids.length) return null
      return `${field.key}={[${ids.map((id) => (/^\d+$/.test(id) ? id : jsString(id))).join(', ')}]}`
    }
    case 'strings': {
      const list = (value as string[]).filter(Boolean)
      return list.length ? `${field.key}={[${list.map(jsString).join(', ')}]}` : null
    }
    case 'talentColors': {
      const list = (value as TalentColor[]).filter((c) => c.color && c.nodes.length)
      return list.length ? `${field.key}=${formatColors(list)}` : null
    }
    default: {
      const s = String(value ?? '')
      if (!s.trim()) return null
      // JSX attribute strings can't escape quotes or hold newlines -> use an expression
      return /["\n\\{}]/.test(s) ? `${field.key}={${jsString(s)}}` : `${field.key}="${s}"`
    }
  }
}

export function serializeOpeningTag(
  block: BlockDef,
  tag: string,
  state: FormState,
  selfClosing: boolean
): string {
  const parts: string[] = []
  for (const f of block.fields) {
    if (f.body || state.locked.includes(f.key)) continue
    const s = serializeField(f, state.values[f.key])
    if (s) parts.push(s)
  }
  for (const a of state.passthrough) {
    parts.push(a.name ? (a.raw === null ? a.name : `${a.name}=${a.raw}`) : (a.raw ?? ''))
  }
  const end = selfClosing ? '/>' : '>'
  const oneLine = `<${tag}${parts.map((p) => ' ' + p).join('')}${selfClosing ? ' ' : ''}${end}`
  if (oneLine.length <= 90 && !parts.some((p) => p.includes('\n'))) return oneLine
  return `<${tag}\n${parts.map((p) => '  ' + p).join('\n')}\n${end}`
}

/** Full text for a new block */
export function buildBlock(block: BlockDef, state: FormState, selection: string): string {
  if (block.build) return block.build(state.values, selection)
  const tag = block.tag!
  // Self-closing blocks with an optional body only wrap when it's filled in
  const bodyField = block.fields.find((f) => f.body)
  if (bodyField) {
    const body = String(state.values[bodyField.key] ?? '').trim()
    if (!body) return serializeOpeningTag(block, tag, state, true)
    return `${serializeOpeningTag(block, tag, state, false)}\n\n${body}\n\n</${tag}>`
  }
  if (!block.wraps) return serializeOpeningTag(block, tag, state, true)
  const open = serializeOpeningTag(block, tag, state, false)
  // Blank lines around the content so markdown inside the tag is still parsed
  return `${open}\n\n${selection.trim() || 'Content'}\n\n</${tag}>`
}

export function validate(block: BlockDef, state: FormState): string | null {
  for (const f of block.fields) {
    if (!f.required || state.locked.includes(f.key)) continue
    const v = state.values[f.key]
    if (Array.isArray(v) ? v.length === 0 : !String(v ?? '').trim()) {
      return `${f.label} is required.`
    }
  }
  return null
}

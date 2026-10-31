// Registry of the custom MDX components a writer can insert from the editor's
// block menu, plus the small JSX-attribute parser/serializer that lets the same
// form edit a tag that's already in the document.

import { SPECS } from '@/data/specs'

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'number'
  | 'bool'
  | 'select'
  | 'spell'
  | 'spells'
  | 'strings'
  | 'talentColors'
  | 'image'
  | 'table'

export interface Field {
  key: string
  label: string
  kind: FieldKind
  placeholder?: string
  help?: string
  required?: boolean
  mono?: boolean
  /** Textarea height in rows */
  rows?: number
  options?: { value: string; label: string }[]
  /** Autocomplete source for `strings` */
  suggest?: 'talents'
  /** Applied to text input before it's stored, e.g. YouTube URL → id */
  normalize?: (value: string) => string
  /** Takes the full form width */
  wide?: boolean
  /** Shown after the help text, opens in a new tab */
  link?: { href: string; label: string }
  /** Form heading this field sits under; fields carry the previous one forward */
  section?: string
  /** Content between the opening and closing tags rather than an attribute */
  body?: boolean
}

export type BlockCategory =
  | 'Spells and Talents'
  | 'Structural'
  | 'Conditionals'
  | 'Spells & items'
  | 'Media'

export interface BlockDef {
  id: string
  label: string
  description: string
  category: BlockCategory
  fields: Field[]
  /** JSX tag this block writes; absent for markdown snippets */
  tag?: string
  /** Other tag names that open the same form (BossCard ⇄ Encounter) */
  aliases?: string[]
  /** Paired tag that wraps content, vs. self-closing */
  wraps?: boolean
  /** Only offered in the block menu for pages whose path matches */
  pages?: RegExp
  /** Left out of the block menu; the form still opens for existing tags */
  hidden?: boolean
  /** Builds the inserted text for snippets that aren't plain JSX tags */
  build?: (values: Values, selection: string) => string
}

export type Values = Record<string, unknown>

export type TalentColor = { color: string; nodes: string[] }

export const TALENT_COLORS = ['red', 'yellow', 'green', 'white', 'blue', 'purple', 'orange']

const SPEC_OPTIONS = SPECS.map((s) => ({ value: s.id, label: s.name }))

function youtubeId(value: string) {
  const m = value.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{6,})/)
  return m ? m[1] : value.trim()
}

export const BLOCKS: BlockDef[] = [
  {
    id: 'talents',
    tag: 'Talents',
    label: 'Talent tree',
    description: 'Displays a talent tree from an export string',
    category: 'Spells and Talents',
    fields: [
      {
        key: 'name',
        label: 'Name',
        kind: 'text',
        placeholder: 'Class Tree Choices',
        wide: true,
        section: 'Build info',
      },
      {
        key: 'talents',
        label: 'Export string',
        kind: 'textarea',
        mono: true,
        rows: 2,
        required: true,
        wide: true,
        placeholder: 'In-game export string',
      },
      {
        key: 'comment',
        label: 'Comment',
        kind: 'textarea',
        rows: 1,
        wide: true,
        placeholder: 'Shown under the build name',
      },
      {
        key: 'forceTree',
        label: 'Show only',
        kind: 'select',
        section: 'Display options',
        options: [
          { value: '', label: 'All trees (switchable)' },
          { value: 'class', label: 'Class tree' },
          { value: 'spec', label: 'Spec tree' },
          { value: 'hero', label: 'Hero tree' },
          { value: 'full', label: 'Full tree' },
        ],
      },
      {
        key: 'defaultTree',
        label: 'Default tab',
        kind: 'select',
        options: [
          { value: '', label: 'Full (default)' },
          { value: 'Class', label: 'Class' },
          { value: 'Spec', label: 'Spec' },
          { value: 'Hero', label: 'Hero' },
        ],
      },
      { key: 'open', label: 'Expanded by default', kind: 'bool' },
      { key: 'hideCopy', label: 'Hide copy button', kind: 'bool' },
      { key: 'viewOnly', label: 'View only', kind: 'bool' },
      {
        key: 'colors',
        label: 'Highlighted nodes',
        kind: 'talentColors',
        section: 'Nodes',
        wide: true,
        help: 'Colour talent nodes by name, e.g. to mark flexible picks.',
      },
      {
        key: 'extra',
        label: 'Extra nodes',
        kind: 'strings',
        suggest: 'talents',
        wide: true,
        help: 'Shown as selected even if they are not in the string.',
      },
      {
        key: 'body',
        label: 'Optional body',
        kind: 'textarea',
        body: true,
        section: 'Body',
        wide: true,
        placeholder: 'Markdown shown under the comment',
        help: 'Written between <Talents> and </Talents>. Leave empty for a self-closing tag.',
      },
    ],
  },
  {
    id: 'timeline',
    tag: 'Timeline',
    label: 'Spell timeline',
    description: 'A row of spell icons in a sequence',
    category: 'Spells and Talents',
    fields: [
      {
        key: 'spellIds',
        label: 'Spells, in cast order',
        kind: 'spells',
        required: true,
        wide: true,
        help: 'Search and press Enter to add each spell. Drag to reorder.',
      },
      { key: 'beta', label: 'Use beta tooltips', kind: 'bool' },
    ],
  },
  {
    id: 'planner',
    tag: 'PlannerEmbed',
    label: 'Planner embed',
    description: 'Embeds a timeline from the dreamgrove planner',
    category: 'Spells and Talents',
    fields: [
      {
        key: 'code',
        label: 'Share code',
        kind: 'textarea',
        mono: true,
        required: true,
        wide: true,
        placeholder: 'DG1AQ…',
        help: 'Copy the share code from the planner.',
        link: { href: '/planner', label: 'Open the planner' },
      },
    ],
  },
  {
    id: 'hero',
    tag: 'HeroTalentsHeader',
    label: 'Hero talent section',
    description: 'Collapsible element that matches the colour of the selected hero tree',
    category: 'Structural',
    wraps: true,
    fields: [
      {
        key: 'title',
        label: 'Title',
        kind: 'text',
        required: true,
        placeholder: 'Druid of the Claw',
      },
      {
        key: 'id',
        label: 'Hero tree',
        kind: 'select',
        required: true,
        options: [
          { value: 'generic', label: 'Generic' },
          { value: 'kotg', label: 'Keeper of the Grove' },
          { value: 'ec', label: "Elune's Chosen" },
          { value: 'dotc', label: 'Druid of the Claw' },
        ],
      },
    ],
  },
  {
    id: 'collapsible',
    tag: 'Collapsible',
    label: 'Collapsible',
    description: 'Section with a title that expands when clicked',
    category: 'Structural',
    wraps: true,
    fields: [
      { key: 'title', label: 'Title', kind: 'text', required: true, placeholder: 'AoE Rotation' },
    ],
  },
  {
    id: 'callout',
    label: 'Callout',
    description: 'A note, a tip or a warning section',
    category: 'Structural',
    fields: [
      {
        key: 'type',
        label: 'Type',
        kind: 'select',
        options: ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'].map((v) => ({
          value: v,
          label: v[0] + v.slice(1).toLowerCase(),
        })),
      },
      { key: 'text', label: 'Text', kind: 'textarea', wide: true },
    ],
    build: (v, sel) => {
      const text = String(v.text || sel || 'Text')
      return (
        `> [!${v.type || 'NOTE'}]\n` +
        text
          .split('\n')
          .map((l) => `> ${l}`)
          .join('\n')
      )
    },
  },
  {
    id: 'checkbox',
    tag: 'Checkbox',
    label: 'Conditional checkbox',
    description: 'Checkbox used to show or hide conditional blocks',
    category: 'Conditionals',
    fields: [
      { key: 'spellId', label: 'Spell', kind: 'spell', required: true, wide: true },
      { key: 'name', label: 'Display name', kind: 'text', placeholder: 'Keeper of the Grove' },
      {
        key: 'id',
        label: 'Toggle id',
        kind: 'text',
        mono: true,
        placeholder: 'Defaults to the spell id',
        help: 'Id used by conditional blocks to reference this checkbox',
      },
      {
        key: 'radio',
        label: 'Radio group',
        kind: 'text',
        placeholder: 'Optional',
        help: 'All checkboxes sharing this name will be mutually exclusive',
      },
      // No isIcon field: <Checkbox> always renders as an icon and ignores the prop
      { key: 'defaultCheck', label: 'Ticked by default', kind: 'bool' },
    ],
  },
  {
    id: 'conditional',
    label: 'Conditional block',
    description: 'Content displayed only when the corresponding checkbox is ticked',
    category: 'Conditionals',
    fields: [
      {
        key: 'when',
        label: 'Condition',
        kind: 'text',
        required: true,
        mono: true,
        wide: true,
        placeholder: 'Incarnation',
        help: 'One or more conditional checkbox ids. You can combine multiple ids with && and negate one with ~, e.g. Starweaver&&~Incarnation',
      },
      { key: 'text', label: 'Content', kind: 'textarea', wide: true },
    ],
    build: (v, sel) => `<div>[*${v.when}]\n\n${v.text || sel || 'Content'}\n\n</div>`,
  },
  {
    id: 'boss',
    tag: 'BossCard',
    aliases: ['Encounter'],
    label: 'Encounter',
    description: 'Boss or trash section for dungeon and raid pages.',
    category: 'Structural',
    wraps: true,
    fields: [
      { key: 'title', label: 'Title', kind: 'text', required: true, placeholder: 'Trash' },
      { key: 'trash', label: 'Trash pack', kind: 'bool' },
    ],
  },
  {
    id: 'specnote',
    tag: 'SpecNote',
    label: 'Spec note',
    // Needs the role selector, which only raid and dungeon pages render
    pages: /^(raids|dungeons)\//,
    description: 'Note for one spec, shown when that spec is picked in the role selector.',
    category: 'Structural',
    wraps: true,
    fields: [{ key: 'spec', label: 'Spec', kind: 'select', required: true, options: SPEC_OPTIONS }],
  },
  {
    id: 'table',
    label: 'Table',
    description: 'Markdown table with a header',
    category: 'Structural',
    fields: [{ key: 'cells', label: '', kind: 'table', wide: true }],
    build: (v) => {
      const grid = (v.cells as string[][]) ?? []
      // A pipe or newline in a cell would break the row
      const cell = (text: string) => text.replace(/\|/g, '\\|').replace(/\n/g, ' ').trim() || ' '
      const line = (row: string[]) => '| ' + row.map(cell).join(' | ') + ' |'
      const [head = [], ...body] = grid
      return [line(head), line(head.map(() => '---')), ...body.map(line)].join('\n')
    },
  },
  {
    id: 'wowhead',
    tag: 'Wowhead',
    label: 'Wowhead link',
    description: 'Tooltip link to any Wowhead page: spells, items, NPCs.',
    category: 'Spells & items',
    hidden: true,
    fields: [
      {
        key: 'type',
        label: 'Type',
        kind: 'select',
        options: ['spell', 'item', 'npc', 'zone', 'achievement'].map((v) => ({
          value: v,
          label: v[0].toUpperCase() + v.slice(1),
        })),
      },
      { key: 'id', label: 'Id', kind: 'text', mono: true, placeholder: '8921' },
      { key: 'name', label: 'Display name', kind: 'text', placeholder: 'Moonfire' },
      { key: 'url', label: 'Custom URL', kind: 'text', placeholder: 'Optional', wide: true },
      { key: 'beta', label: 'Beta', kind: 'bool' },
      { key: 'noIcon', label: 'No icon', kind: 'bool' },
    ],
  },
  {
    id: 'image',
    label: 'Image',
    description: 'Upload an image or use one already in /public.',
    category: 'Media',
    fields: [
      {
        key: 'src',
        label: 'Image',
        kind: 'image',
        required: true,
        mono: true,
        wide: true,
        placeholder: '/static/images/…',
        help: 'Uploads are committed alongside the page when you save.',
      },
      { key: 'alt', label: 'Description', kind: 'text', placeholder: 'A description of the image' },
    ],
    build: (v) => `![${v.alt || ''}](${v.src})`,
  },
  {
    id: 'youtube',
    tag: 'YouTube',
    label: 'YouTube video',
    description: 'Embedded video player.',
    category: 'Media',
    fields: [
      {
        key: 'id',
        label: 'Video URL or id',
        kind: 'text',
        required: true,
        normalize: youtubeId,
        wide: true,
        placeholder: 'https://youtu.be/…',
      },
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'start', label: 'Start at (seconds)', kind: 'number' },
    ],
  },
]

const BY_TAG = new Map<string, BlockDef>()
for (const b of BLOCKS) {
  if (!b.tag) continue
  BY_TAG.set(b.tag, b)
  b.aliases?.forEach((a) => BY_TAG.set(a, b))
}

// --- Attribute parsing ------------------------------------------------------

export interface ParsedAttr {
  name: string
  /** Literal text after `=`, or null for a bare boolean attribute */
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

// Skips a JS string or template literal starting at `i`; returns the index past it.
function skipJsString(src: string, i: number): number {
  const q = src[i]
  i++
  while (i < src.length && src[i] !== q) {
    if (src[i] === '\\') i++
    i++
  }
  return i + 1
}

// Skips a balanced `{…}` starting at `i`; returns the index past the closing brace.
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

// Parses `<Tag attrs…>` starting at `from` (the `<`). Returns null when the tag
// is unterminated, so a half-typed tag never opens the form.
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
      // Spread attribute: keep it as-is
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

/** The registered component whose opening tag contains `pos`, if any. */
export function findTagAt(doc: string, pos: number): TagMatch | null {
  // Opening tags can span many lines (talent colour lists), so look a fair way back
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

// Evaluates an attribute expression such as `{[1, 2]}` or `{{ a: 1 }}`. The
// preview already compiles and runs this document's MDX, so evaluating its own
// attribute literals here adds nothing new.
function evalExpression(raw: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: new Function(`return (${raw.slice(1, -1)})`)() }
  } catch {
    return { ok: false }
  }
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
  /** Attributes kept verbatim: unknown props, spreads, and expressions the form can't read */
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

// --- Whole-document scan (rich mode) -----------------------------------------

export interface DocTag extends TagMatch {
  /** Matching `</Tag>` for wrapping blocks; absent if it isn't written yet */
  close?: { from: number; to: number }
}

/** Every registered component tag in `doc`, in document order. */
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

function truncate(s: string, n: number) {
  const flat = s.replace(/\s+/g, ' ').trim()
  return flat.length > n ? flat.slice(0, n - 1) + '…' : flat
}

/** One-line description of a component for its rich-mode card. */
export function summarizeBlock(match: TagMatch): string {
  const { values } = formFromTag(match)
  const str = (k: string) => String(values[k] ?? '').trim()
  switch (match.block.id) {
    case 'talents':
      return truncate(str('name') || 'Talent build', 80)
    case 'timeline': {
      const n = (values.spellIds as string[]).length
      return `${n} spell${n === 1 ? '' : 's'}${values.beta ? ' · beta' : ''}`
    }
    // The share code itself is in the card body
    case 'planner':
      return 'Planner timeline'
    case 'youtube':
      return str('title') || str('id')
    case 'checkbox':
      return str('name')
    case 'wowhead':
      return str('name') || `${str('type')} ${str('id')}`
    case 'specnote':
      return (
        match.block.fields[0].options?.find((o) => o.value === str('spec'))?.label ?? str('spec')
      )
    case 'boss':
      return str('title') + (values.trash ? ' · trash' : '')
    default:
      return str('title')
  }
}

/** Secondary text shown muted after the summary */
export function blockDetail(match: TagMatch): string | undefined {
  const { values } = formFromTag(match)
  const str = (k: string) => String(values[k] ?? '').trim()
  // The toggle id defaults to the spell id, and is what [*id] conditions reference
  if (match.block.id === 'checkbox') return str('id') || str('spellId')
}

export interface BlockField {
  label: string
  value: string
  mono?: boolean
  /** Takes a double-width column */
  wide?: boolean
}

/** Labelled values shown in the body of a component's rich-mode card */
export function blockFields(match: TagMatch): BlockField[] {
  const { values } = formFromTag(match)
  const str = (k: string) => String(values[k] ?? '').trim()
  const option = (key: string) =>
    match.block.fields.find((f) => f.key === key)?.options?.find((o) => o.value === str(key))?.label
  const out: (BlockField | false)[] = []
  switch (match.block.id) {
    case 'talents': {
      const colors = (values.colors as TalentColor[]).reduce((n, c) => n + c.nodes.length, 0)
      const extra = (values.extra as string[]).length
      out.push(
        { label: 'Export string', value: str('talents') || '—', mono: true, wide: true },
        { label: 'Shows', value: option('forceTree') ?? 'All trees' },
        !!str('defaultTree') && { label: 'Default tab', value: str('defaultTree') },
        !!colors && { label: 'Highlighted', value: `${colors} node${colors === 1 ? '' : 's'}` },
        !!extra && { label: 'Extra', value: `${extra} node${extra === 1 ? '' : 's'}` }
      )
      break
    }
    case 'planner':
      out.push({ label: 'Share code', value: str('code') || '—', mono: true, wide: true })
      break
    case 'youtube': {
      const start = Number(str('start'))
      out.push(
        { label: 'Video', value: str('id') || '—', mono: true, wide: true },
        start > 0 && {
          label: 'Starts at',
          value: `${Math.floor(start / 60)}:${String(Math.floor(start % 60)).padStart(2, '0')}`,
        }
      )
      break
    }
  }
  return out.filter((f): f is BlockField => !!f)
}

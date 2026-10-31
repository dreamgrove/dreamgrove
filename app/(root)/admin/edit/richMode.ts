import {
  EditorView,
  WidgetType,
  Decoration,
  DecorationSet,
  ViewPlugin,
  BlockType,
  keymap,
  type ViewUpdate,
} from '@codemirror/view'
import {
  EditorState,
  Prec,
  StateField,
  StateEffect,
  Range,
  type Extension,
} from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { IterMode, type SyntaxNode } from '@lezer/common'
import {
  blockDetail,
  blockFields,
  findAllTags,
  formFromTag,
  summarizeBlock,
  type BlockField,
  type DocTag,
} from './mdxBlocks'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { IconType } from 'react-icons'
import { FaRegCheckSquare, FaRegCircle, FaRegDotCircle, FaRegSquare } from 'react-icons/fa'
import { loadSpells } from './SpellPicker'
import spellData from '../../../../spellData.json'

// Rich text mode: the same markdown document, rendered in place. Syntax markers
// are hidden, formatting is styled, and components collapse into compact cards
// that open the existing block forms. The text itself is never transformed, so
// switching back to MDX shows exactly what's saved. Alt+click anything rendered
// to reveal its source until the caret leaves it.

export interface RichHandlers {
  /** Opens the block form for the component whose opening tag starts at `pos` */
  editTag: (pos: number) => void
  /**
   * Opens the link popover for the markdown link spanning `from`–`to`. `at`
   * places it under a rendered link (viewport coords at the scroll position
   * `scrollTop`) when `from` has no text of its own, as inside a table.
   */
  openLink: (from: number, to: number, at?: LinkAnchor) => void
  /** Opens a snippet block's form (image, table); submitting replaces `from`–`to` */
  editSnippet: (blockId: string, values: Record<string, unknown>, from: number, to: number) => void
  /** Displayable URL for an image src (pending uploads live in blobs) */
  imageUrl: (src: string) => string
}

export type LinkAnchor = { left: number; bottom: number; scrollTop: number }

type HandlersRef = { readonly current: RichHandlers }

// --- Reveal ------------------------------------------------------------------

type Span = { from: number; to: number } | null

const setReveal = StateEffect.define<Span>()

// Same lifecycle as the spell token editing range: cleared once the caret leaves.
const revealField = StateField.define<Span>({
  create: () => null,
  update(value, tr) {
    for (const e of tr.effects) if (e.is(setReveal)) value = e.value
    if (value && tr.docChanged) {
      value = { from: tr.changes.mapPos(value.from, -1), to: tr.changes.mapPos(value.to, 1) }
    }
    if (value && tr.selection) {
      const head = tr.selection.main.head
      if (head < value.from || head > value.to) value = null
    }
    return value
  },
})

// --- Folding -------------------------------------------------------------------

const toggleFold = StateEffect.define<number>()

/** Opening-tag positions of collapsed sections */
const foldField = StateField.define<readonly number[]>({
  create: () => [],
  update(value, tr) {
    if (tr.docChanged) value = value.map((pos) => tr.changes.mapPos(pos, 1))
    for (const e of tr.effects) {
      if (!e.is(toggleFold)) continue
      value = value.includes(e.value) ? value.filter((p) => p !== e.value) : [...value, e.value]
    }
    return value
  },
})

// --- Toggle links --------------------------------------------------------------

const toggleLink = StateEffect.define<string>()

/** Talent toggle ids whose conditions are linked, in the order they were shown */
const linkField = StateField.define<readonly string[]>({
  create: () => [],
  update(value, tr) {
    for (const e of tr.effects) {
      if (!e.is(toggleLink)) continue
      value = value.includes(e.value) ? value.filter((id) => id !== e.value) : [...value, e.value]
    }
    return value
  },
})

function reveal(view: EditorView, from: number, to: number) {
  view.dispatch({ selection: { anchor: from }, effects: setReveal.of({ from, to }) })
  view.focus()
}

// --- Colours -----------------------------------------------------------------

// The toolbar's `:name[…]` colours, matching their swatches
const DIRECTIVE_COLORS: Record<string, string> = {
  red: '#e05555',
  orange: '#e0883f',
  yellow: '#e2c044',
  green: '#5fb760',
  blue: '#5b9bd5',
  purple: '#a77fdc',
}

// Approximate Tailwind palette for `text-*` / `bg-*` classes in inline HTML
const TW_COLORS: Record<string, string> = {
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
  gray: '#9ca3af',
  grey: '#9ca3af',
  slate: '#94a3b8',
  zinc: '#a1a1aa',
  neutral: '#a3a3a3',
  stone: '#a8a29e',
  white: '#ffffff',
  black: '#000000',
}

function classColor(attrs: string, prefix: 'text' | 'bg'): string | undefined {
  const cls = /className=["']([^"']*)["']|class=["']([^"']*)["']/.exec(attrs)
  if (cls) {
    for (const c of (cls[1] ?? cls[2]).split(/\s+/)) {
      const m = new RegExp(`^${prefix}-([a-z]+)(?:-\\d{2,3})?$`).exec(c)
      if (m && TW_COLORS[m[1]]) return TW_COLORS[m[1]]
    }
  }
  if (prefix === 'text') {
    const style = /[{"';\s]color:\s*['"]?(#[0-9a-fA-F]{3,8}|[a-z]+)/.exec(attrs)
    if (style) return style[1]
  }
  return undefined
}

// Per-type hue for card badges, so block types tell apart at a glance
const BLOCK_HUES: Record<string, string> = {
  talents: '#b9a6f0',
  timeline: '#e6b16a',
  planner: '#4fc9ae',
  youtube: '#8ec5ff',
  image: '#8ec5ff',
}

// Spell names by id: the picker's spell list once loaded, until then the
// token table (which also holds localized names; those are skipped)
let spellNames: Map<string, string> | undefined

function spellName(id: string) {
  if (!spellNames) {
    spellNames = new Map()
    for (const [name, i] of Object.entries(spellData as Record<string, string | number>)) {
      if (!/[^\u0000-ɏ]/.test(name) && !spellNames.has(String(i))) spellNames.set(String(i), name)
    }
  }
  return spellNames.get(id)
}

/** Redraws once the full spell list has arrived */
const spellsLoaded = StateEffect.define<null>()

const spellLoader = ViewPlugin.define((view) => {
  let live = true
  loadSpells().then((list) => {
    if (!live || !list.length) return
    spellName('')
    for (const s of list) spellNames!.set(String(s.id), s.name)
    view.dispatch({ effects: spellsLoaded.of(null) })
  })
  return {
    destroy() {
      live = false
    },
  }
})

/** Display names of the document's talent toggles by id; refreshed on every build */
let toggleNames = new Map<string, string>()

function firstClass(attrs: string) {
  const cls = /className=["']([^"']*)["']|class=["']([^"']*)["']/.exec(attrs)
  return cls ? (cls[1] ?? cls[2]).trim().split(/\s+/)[0] : ''
}

// --- Widgets -----------------------------------------------------------------

const SVG = {
  edit: '<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M11.7 1.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4L6 13l-3.5.9.9-3.5 8.3-9.1Z"/></svg>',
  close:
    '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.5 3.5l9 9m0-9-9 9"/></svg>',
  chevron:
    '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l4 4 4-4"/></svg>',
  unwrap:
    '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 4h12M2 12h12M5 8h6"/></svg>',
  eye: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z"/><circle cx="8" cy="8" r="2"/></svg>',
  open: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 2.5h4.5V7M13.5 2.5 7 9M11.5 9.5v4h-9v-9h4"/></svg>',
}

// Widgets are plain DOM, so react-icons are rendered to markup once and reused
const iconMarkup = new Map<IconType, string>()

function icon(Icon: IconType) {
  let svg = iconMarkup.get(Icon)
  if (!svg) {
    svg = renderToStaticMarkup(createElement(Icon, { size: 12, 'aria-hidden': true }))
    iconMarkup.set(Icon, svg)
  }
  return svg
}

/** A talent toggle's glyph: checkbox or radio, ticked when on by default */
function toggleIcon(checked: boolean, radio: boolean) {
  if (radio) return icon(checked ? FaRegDotCircle : FaRegCircle)
  return icon(checked ? FaRegCheckSquare : FaRegSquare)
}

function actionButton(icon: keyof typeof SVG, title: string, onClick: () => void) {
  const b = document.createElement('button')
  b.type = 'button'
  b.className = 'cm-rt-btn'
  b.title = title
  b.setAttribute('aria-label', title)
  b.innerHTML = SVG[icon]
  b.addEventListener('mousedown', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })
  b.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    onClick()
  })
  return b
}

function el(tag: string, cls: string, text?: string) {
  const node = document.createElement(tag)
  node.className = cls
  if (text !== undefined) node.textContent = text
  return node
}

// --- Section boxes ------------------------------------------------------------
//
// Wrapping components render as a bordered box: a header card, content lines
// drawn with side borders, and a closing edge. Nested boxes step in by INDENT.
// Lines can't contain real boxes, so borders and fills are background layers.

const GUTTER = 28
const INDENT = 14
const BOX_BORDER = '#3a3a3a'
const BOX_FILL = 'rgba(255,255,255,0.025)'

const layer = (color: string, pos: string, size: string) =>
  `linear-gradient(${color},${color}) ${pos}/${size} no-repeat`

/** Left edge of content at nesting `depth` */
const inset = (depth: number) => GUTTER + depth * INDENT

// Hero talent sections take their tree's colour, as <HeroTalentsHeader> draws
// them (components/custom/HeroTalents). Each tree has a one-letter box kind.
const HERO_COLORS: Record<string, string> = {
  kotg: '#2d6b2d',
  ec: '#4b62be',
  dotc: '#c41e3a',
  generic: '#d57f43',
}
const HERO_BOX: Record<string, string> = { kotg: 'k', ec: 'e', dotc: 'd', generic: 'g' }
const BOX_TINTS: Record<string, string> = Object.fromEntries(
  Object.entries(HERO_BOX).map(([id, k]) => [k, HERO_COLORS[id]])
)

const tintBorder = (c: string) => `color-mix(in srgb, ${c} 55%, ${BOX_BORDER})`

/**
 * Borders and fills of every enclosing box. `stack`
 * lists the boxes outermost first, one character per component section: `s`
 * for a plain one, a BOX_TINTS key for a tinted one.
 */
function boxLayers(stack: string): string[] {
  const layers: string[] = []
  for (let i = 0; i < stack.length; i++) {
    const x = inset(i)
    const tint = BOX_TINTS[stack[i]]
    const border = tint ? tintBorder(tint) : BOX_BORDER
    layers.push(layer(border, `${x}px 0`, '1px 100%'))
    layers.push(layer(border, `right ${x}px top 0`, '1px 100%'))
  }
  // Every box's fill, innermost on top: translucent fills stack, so the outer
  // section's colour carries on beside and under the boxes nested in it
  for (let i = stack.length - 1; i >= 0; i--) {
    const x = inset(i)
    const tint = BOX_TINTS[stack[i]]
    const fill = tint ? `color-mix(in srgb, ${tint} 6%, transparent)` : BOX_FILL
    layers.push(layer(fill, `${x}px 0`, `calc(100% - ${2 * x}px) 100%`))
  }
  return layers
}

/** Wraps a block widget so it sits inside its enclosing boxes */
function frameDom(stack: string, inner: HTMLElement, top = 0, bottom = 0) {
  const frame = el('div', 'cm-rt-frame')
  const x = inset(stack.length)
  frame.style.padding = `${top}px ${x}px ${bottom}px`
  const layers = boxLayers(stack)
  if (layers.length) frame.style.background = layers.join(',')
  frame.append(inner)
  return frame
}

type LineKind = { kind: 'callout' | 'quote' | 'code'; color?: string }

function lineStyle(stack: string, kind?: LineKind, top = 0, bottom = 0): string {
  const x = inset(stack.length)
  const layers: string[] = []
  let left = x
  let right = x
  if (kind?.kind === 'callout' || kind?.kind === 'quote') {
    const c = kind.color ?? '#4a4a4a'
    layers.push(layer(c, `${x}px 0`, '3px 100%'))
    if (kind.kind === 'callout') {
      const tint = `color-mix(in srgb, ${c} 9%, transparent)`
      layers.push(layer(tint, `${x}px 0`, `calc(100% - ${2 * x}px) 100%`))
      right = x + 12
    }
    left = x + 19
  } else if (kind?.kind === 'code') {
    layers.push(layer('#262626', `${x}px 0`, `calc(100% - ${2 * x}px) 100%`))
    left = x + 12
    right = x + 12
  }
  layers.push(...boxLayers(stack))
  return (
    `padding-left:${left}px;padding-right:${right}px` +
    (top ? `;padding-top:${top}px` : '') +
    (bottom ? `;padding-bottom:${bottom}px` : '') +
    (layers.length ? `;background:${layers.join(',')}` : '')
  )
}

/** Base for widgets standing in for a slice of source text (`raw`). */
abstract class SourceWidget extends WidgetType {
  /** Enclosing boxes (see boxLayers); set once all boxes are known */
  stack = ''

  constructor(
    readonly raw: string,
    readonly key: string
  ) {
    super()
  }

  eq(other: WidgetType) {
    return (
      other.constructor === this.constructor &&
      (other as SourceWidget).raw === this.raw &&
      (other as SourceWidget).key === this.key &&
      (other as SourceWidget).stack === this.stack
    )
  }

  ignoreEvent() {
    return true
  }

  /** Click runs `onClick` (or reveals the source without one); Alt+click always reveals. */
  protected wire(dom: HTMLElement, view: EditorView, onClick?: (from: number) => void) {
    dom.addEventListener('mousedown', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.cm-rt-btn') || (!e.altKey && target.closest('.cm-rt-cell'))) return
      e.preventDefault()
      const from = view.posAtDOM(dom)
      if (e.altKey || !onClick) reveal(view, from, from + this.raw.length)
      else onClick(from)
    })
  }
}

function removeRange(view: EditorView, from: number, to: number) {
  const doc = view.state.doc
  if (doc.sliceString(to, to + 1) === '\n') to++
  view.dispatch({ changes: { from, to }, userEvent: 'delete', scrollIntoView: true })
  view.focus()
}

interface CardSpec {
  kind: 'card' | 'header' | 'footer' | 'chip'
  label: string
  summary: string
  /** Muted text after the summary */
  detail?: string
  /** Offset of the opening `<` from the start of the replaced range */
  tagOffset: number
  /** Registered component (edit form available) vs plain HTML wrapper */
  editable: boolean
  thumb?: string
  /** Header with a fold toggle */
  foldable?: boolean
  /** Header of a section that can fold; true while folded */
  folded?: boolean
  /** Second line under the summary */
  description?: string
  /** Talent toggle id; adds the eye that links its conditions */
  linkId?: string
  /** Badge hue (see BLOCK_HUES) */
  hue?: string
  /** Section header and edge take the hue too (hero talent sections) */
  tint?: boolean
  /** Short type word on an inline chip's tinted segment, e.g. `Spell` */
  chipType?: string
  /** Talent toggle state, drawn as the glyph on its tinted segment */
  toggle?: { checked: boolean; radio: string }
  /** Labelled values in a card's body */
  fields?: BlockField[]
  /** Spell timeline steps in a card's body, repeats merged */
  spells?: { name: string; count: number }[]
  /** `[*…]` gating the block: before the tag (`lead`) or the conditional div's own */
  cond?: { expr: string; html: string; lead: boolean }
  /** Opens the block's source elsewhere, e.g. the planner */
  href?: { url: string; title: string }
  /** Caption over a section's content when it's an optional extra (Talents) */
  bodyLabel?: string
}

class CardWidget extends SourceWidget {
  constructor(
    raw: string,
    readonly spec: CardSpec,
    readonly h: HandlersRef
  ) {
    super(raw, JSON.stringify(spec))
  }

  get estimatedHeight() {
    const body = this.spec.fields?.length || this.spec.spells?.length
    return { card: body ? 98 : 52, header: 48, footer: 18, chip: -1 }[this.spec.kind]
  }

  toDOM(view: EditorView) {
    const { kind, label, summary, tagOffset, editable, thumb, hue, cond } = this.spec
    const edit = (from: number) => this.h.current.editTag(from + tagOffset)

    if (kind === 'chip') {
      const { toggle, linkId, detail } = this.spec
      const chip = el('span', 'cm-rt-chip cm-rt-seg')
      if (hue) chip.style.setProperty('--rt-hue', hue)
      const type = el('span', 'cm-rt-seg-type')
      if (toggle) {
        type.classList.add('cm-rt-seg-icon')
        type.innerHTML = toggleIcon(toggle.checked, !!toggle.radio)
      } else type.textContent = this.spec.chipType ?? label
      chip.append(type)
      if (summary) chip.append(el('span', 'cm-rt-seg-name', summary))
      if (detail) chip.append(el('span', 'cm-rt-seg-detail', detail))
      if (linkId) {
        const eye = actionButton('eye', 'Show the conditions using this toggle', () =>
          view.dispatch({ effects: toggleLink.of(linkId) })
        )
        eye.dataset.rtLink = linkId
        chip.append(eye)
      }
      chip.title = toggle
        ? [
            label,
            `id ${detail}`,
            toggle.checked ? 'default on' : 'default off',
            toggle.radio && `group ${toggle.radio}`,
          ]
            .filter(Boolean)
            .join(' · ') + ' (Alt+click for source)'
        : editable
          ? `Edit ${label.toLowerCase()} (Alt+click for source)`
          : label
      this.wire(chip, view, editable ? edit : undefined)
      return chip
    }

    if (kind === 'footer') {
      const foot = el('div', 'cm-rt-wrap-foot')
      if (this.spec.tint && hue) {
        foot.classList.add('cm-rt-tinted')
        foot.style.setProperty('--rt-hue', hue)
      }
      foot.title = `End of ${label.toLowerCase()} (Alt+click for source)`
      // Clicking the bottom of a section means "continue writing in it"
      this.wire(foot, view, (from) => {
        view.dispatch({ selection: { anchor: Math.max(0, from - 1) }, scrollIntoView: true })
        view.focus()
      })
      return frameDom(this.stack, foot, 0, 8)
    }

    const { bodyLabel } = this.spec
    const stacked = kind === 'card' || !!bodyLabel
    const box = el('div', kind === 'card' ? 'cm-rt-card cm-rt-block' : 'cm-rt-wrap-head')
    if (hue) box.style.setProperty('--rt-hue', hue)
    if (this.spec.tint) box.classList.add('cm-rt-tinted')
    if (stacked) box.classList.add('cm-rt-block')
    // A card stacks its header row over a body; a section header is just the
    // row, unless its fields and content caption go under it
    const row = stacked ? el('div', 'cm-rt-card-head') : box
    if (kind === 'header' && this.spec.foldable) {
      const folded = !!this.spec.folded
      if (folded) box.classList.add('cm-rt-folded')
      row.append(
        actionButton('chevron', folded ? 'Expand section' : 'Collapse section', () =>
          view.dispatch({ effects: toggleFold.of(view.posAtDOM(box) + tagOffset) })
        )
      )
    }
    const at = () => view.posAtDOM(box)
    const condition = cond && condChip(cond.expr, cond.html)
    if (condition) {
      // The condition is source of its own: clicking it opens the line for editing
      condition.addEventListener('mousedown', (e) => {
        e.preventDefault()
        e.stopPropagation()
        reveal(view, at(), at() + this.raw.length)
      })
      condition.title += ' (click to edit)'
    }
    if (condition && cond?.lead) row.append(condition)
    if (thumb) {
      const img = document.createElement('img')
      img.className = 'cm-rt-card-thumb'
      img.src = thumb
      img.alt = ''
      row.append(img)
    }
    row.append(el('span', 'cm-rt-badge', label))
    const text = el('span', 'cm-rt-card-summary')
    text.append(el('span', 'cm-rt-card-title', summary))
    if (condition && !cond?.lead) text.append(condition)
    if (this.spec.description) text.append(el('span', 'cm-rt-card-desc', this.spec.description))
    row.append(text)
    const actions = el('span', 'cm-rt-card-actions')
    const { href } = this.spec
    if (href) {
      actions.append(
        actionButton('open', href.title, () => window.open(href.url, '_blank', 'noopener'))
      )
    }
    if (editable)
      actions.append(actionButton('edit', `Edit ${label.toLowerCase()}`, () => edit(at())))
    if (kind === 'card') {
      actions.append(
        actionButton('close', `Remove ${label.toLowerCase()}`, () => {
          const from = at()
          removeRange(view, from, from + this.raw.length)
        })
      )
    } else {
      actions.append(
        actionButton('unwrap', 'Unwrap (keep the content)', () => unwrap(view, at() + tagOffset))
      )
    }
    row.append(actions)
    if (row !== box) box.append(row)
    const body = stacked && this.body()
    if (body) box.append(body)
    if (bodyLabel) box.append(el('div', 'cm-rt-body-label', bodyLabel))
    box.title = 'Alt+click to edit the source'
    this.wire(box, view, editable ? edit : undefined)
    return kind === 'card'
      ? frameDom(this.stack, box, 6, 6)
      : frameDom(this.stack, box, 8, this.spec.folded ? 8 : 0)
  }

  /** The block's own contents: its timeline steps or its fields as labelled values */
  private body() {
    const { fields, spells } = this.spec
    if (spells?.length) {
      const body = el('div', 'cm-rt-card-body cm-rt-steps')
      spells.forEach((s, i) => {
        if (i) body.append(el('span', 'cm-rt-step-arrow', '→'))
        const step = el('span', 'cm-rt-step', s.name)
        if (s.count > 1) step.append(el('span', 'cm-rt-step-count', `×${s.count}`))
        body.append(step)
      })
      return body
    }
    if (!fields?.length) return null
    const body = el('div', 'cm-rt-card-body cm-rt-fields')
    for (const f of fields) {
      const cell = el('div', f.wide ? 'cm-rt-field cm-rt-field-wide' : 'cm-rt-field')
      const value = el(
        'span',
        f.mono ? 'cm-rt-field-value cm-rt-field-mono' : 'cm-rt-field-value',
        f.value
      )
      value.title = f.value
      cell.append(el('span', 'cm-rt-field-label', f.label), value)
      body.append(cell)
    }
    return body
  }
}

class ImageWidget extends SourceWidget {
  constructor(
    raw: string,
    readonly src: string,
    readonly alt: string,
    /** Offset/length of the `![…](…)` inside the replaced range */
    readonly offset: number,
    readonly length: number,
    readonly block: boolean,
    readonly h: HandlersRef
  ) {
    super(raw, `${src}|${alt}|${block}`)
  }

  get estimatedHeight() {
    return this.block ? 72 : -1
  }

  toDOM(view: EditorView) {
    const box = el(
      this.block ? 'div' : 'span',
      this.block ? 'cm-rt-card cm-rt-image' : 'cm-rt-chip'
    )
    const img = document.createElement('img')
    img.className = this.block ? 'cm-rt-image-thumb' : 'cm-rt-image-inline'
    img.src = this.h.current.imageUrl(this.src)
    img.alt = this.alt
    box.append(img)
    const edit = (from: number) =>
      this.h.current.editSnippet(
        'image',
        { src: this.src, alt: this.alt },
        from + this.offset,
        from + this.offset + this.length
      )
    if (this.block) {
      const text = el('span', 'cm-rt-card-summary')
      text.append(el('span', 'cm-rt-image-alt', this.alt || 'Image'))
      text.append(el('span', 'cm-rt-image-src', this.src))
      box.style.setProperty('--rt-hue', BLOCK_HUES.image)
      box.append(el('span', 'cm-rt-badge', 'Image'), text)
      const actions = el('span', 'cm-rt-card-actions')
      actions.append(
        actionButton('edit', 'Edit image', () => edit(view.posAtDOM(box))),
        actionButton('close', 'Remove image', () => {
          const from = view.posAtDOM(box)
          removeRange(view, from, from + this.raw.length)
        })
      )
      box.append(actions)
    }
    this.wire(box, view, edit)
    return this.block ? frameDom(this.stack, box, 6, 6) : box
  }
}

/** Small inline label; clicking reveals its source unless `passive`. */
class PillWidget extends SourceWidget {
  constructor(
    raw: string,
    readonly text: string,
    readonly cls: string,
    readonly passive = false,
    readonly color?: string
  ) {
    super(raw, `${text}|${cls}|${color ?? ''}`)
  }

  toDOM(view: EditorView) {
    const pill = el('span', this.cls, this.text)
    if (this.color) pill.style.setProperty('--rt-color', this.color)
    if (!this.passive) {
      pill.title = 'Click to edit the source'
      this.wire(pill, view)
    }
    return pill
  }

  ignoreEvent() {
    return !this.passive
  }
}

/** A tag that sits on its own line, e.g. `<div className="flex">` → `div.flex`. */
class TagLineWidget extends SourceWidget {
  constructor(
    raw: string,
    readonly text: string
  ) {
    super(raw, text)
  }

  get estimatedHeight() {
    return 20
  }

  toDOM(view: EditorView) {
    const line = el('div', 'cm-rt-tagline')
    line.append(el('span', 'cm-rt-tag', this.text))
    line.title = 'Click to edit the source'
    this.wire(line, view)
    return frameDom(this.stack, line)
  }
}

/** First line of a `> [!TIP]` callout; clicking it opens the callout form. */
class CalloutHeadWidget extends SourceWidget {
  constructor(
    raw: string,
    readonly label: string,
    readonly color: string,
    /** Length of the whole blockquote from the start of this line */
    readonly length: number,
    readonly h: HandlersRef
  ) {
    super(raw, `${label}|${length}`)
  }

  get estimatedHeight() {
    return 26
  }

  toDOM(view: EditorView) {
    const head = el('div', 'cm-rt-callout-head', this.label)
    head.style.setProperty('--rt-callout', this.color)
    head.title = 'Click to edit the callout, Alt+click to edit the source'
    this.wire(head, view, (from) => {
      const to = Math.min(view.state.doc.length, from + this.length)
      const text = view.state.doc
        .sliceString(Math.min(to, from + this.raw.length + 1), to)
        .split('\n')
        .map((l) => l.replace(/^\s*>\s?/, ''))
        .join('\n')
      this.h.current.editSnippet('callout', { type: this.label.toUpperCase(), text }, from, to)
    })
    return frameDom(this.stack, head, 4, 0)
  }
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function colorFor(name: string) {
  if (name.startsWith('#')) return name
  const n = name.toLowerCase()
  return DIRECTIVE_COLORS[n] ?? TW_COLORS[n] ?? n
}

/**
 * Renders a table cell's inline markdown; the cell is escaped first. Elements
 * carry what cellMarkdown needs to write them back: tokens edited as a whole
 * (spells, conditions) keep their source, colours and links their target.
 */
function inlineHtml(src: string) {
  // Placeholders keep finished pieces away from the later patterns
  const held: string[] = []
  const hold = (html: string) => `\u0000${held.push(html) - 1}\u0000`
  const token = (raw: string, cls: string, label: string, color?: string) =>
    hold(
      `<span class="${cls}" contenteditable="false" data-src="${raw}"${
        color ? ` style="--rt-color:${color}"` : ''
      }>${label}</span>`
    )
  // The cell is escaped by now; a condition's operators need the raw text back
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

/** A rendered cell back to inline markdown (pipes still unescaped) */
function cellMarkdown(node: Node): string {
  // Markdown emphasis can't open or close on a space, so edge spaces go outside
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

/** The table cell being edited, so toolbar formatting lands inside it */
let activeCell: { td: HTMLElement; rich: boolean; touch: () => void } | null = null

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

const TABLE_DELIMITER = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/

/** Markdown table → rows of raw cell text, header first */
function parseTable(src: string): string[][] {
  const rows = src
    .split('\n')
    .filter((l) => l.trim() && !TABLE_DELIMITER.test(l))
    .map((l) =>
      l
        .trim()
        .replace(/^\|/, '')
        .replace(/(?<!\\)\|$/, '')
        .split(/(?<!\\)\|/)
        .map((c) => c.trim().replace(/\\\|/g, '|'))
    )
  const cols = Math.max(...rows.map((r) => r.length))
  return rows.map((r) => [...r, ...Array(cols - r.length).fill('')])
}

interface CellSpan {
  /** Trimmed cell text, or an empty range between its pipes */
  from: number
  to: number
}

/** Source offsets of each cell, rows aligned with parseTable */
function tableCells(src: string): { cells: CellSpan[]; end: number; piped: boolean }[] {
  const rows: { cells: CellSpan[]; end: number; piped: boolean }[] = []
  let base = 0
  for (const line of src.split('\n')) {
    const at = base
    base += line.length + 1
    if (!line.trim() || TABLE_DELIMITER.test(line)) continue
    const lead = line.length - line.trimStart().length
    const trail = line.trimEnd().length
    const bars = [...line.matchAll(/(?<!\\)\|/g)].map((m) => m.index ?? 0)
    const piped = bars[bars.length - 1] === trail - 1 && trail - 1 > lead
    const edges = [
      bars[0] === lead ? lead : lead - 1,
      ...bars.filter((b) => b !== lead && b !== trail - 1),
    ]
    edges.push(piped ? trail - 1 : trail)
    const cells: CellSpan[] = []
    for (let i = 0; i + 1 < edges.length; i++) {
      const a = edges[i] + 1
      const slice = line.slice(a, edges[i + 1])
      const text = slice.trim()
      const from = text ? a + slice.indexOf(text) : a
      cells.push({ from: at + from, to: at + from + text.length })
    }
    rows.push({ cells, end: at + trail, piped })
  }
  return rows
}

/** Cell text as table source: one line, pipes escaped */
const cellSource = (text: string) =>
  text
    .replace(/\s*\n\s*/g, ' ')
    .trim()
    .replace(/(?<!\\)\|/g, '\\|')

function focusCell(view: EditorView, from: number, r: number, c: number) {
  for (const wrap of view.contentDOM.querySelectorAll<HTMLElement>('.cm-rt-table-wrap')) {
    if (view.posAtDOM(wrap) !== from) continue
    wrap.querySelector<HTMLElement>(`[data-r="${r}"][data-c="${c}"]`)?.focus()
    return
  }
}

class TableWidget extends SourceWidget {
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
      // An empty cell's range sits right after its pipe; take its padding too
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

    // Cells edit in place, rendered as they are; leaving one (blur, Enter, Tab)
    // writes it back into the source. Cells holding raw HTML can't round-trip
    // through the rendering, so those edit as markdown source instead.
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
      if (activeCell?.td === td) activeCell = null
      const r = Number(td.dataset.r)
      const c = Number(td.dataset.c)
      if (!wrap.isConnected) return
      const value = isRich(r, c) ? cellMarkdown(td) : (td.textContent ?? '')
      let from: number
      let changed: boolean
      try {
        from = view.posAtDOM(wrap)
        // The doc change rebuilds the widget, so a moved-to cell is looked up afresh
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
          activeCell = { td, rich, touch: () => (dirty = true) }
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
            // The editor's keymap doesn't see keys inside the widget: write the
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
    // rebuilds this widget; they work from the table's start (which a cell
    // edit never moves) and its current extent.
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
        // The first click enters the cell; a link opens on a click once inside
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
        // Same pattern inlineHtml renders links with; code spans hold none
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
      actionButton('edit', 'Edit table', edit),
      actionButton('close', 'Remove table', () => {
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
      if (activeCell && wrap.contains(activeCell.td)) activeCell = null
    })
    return frame
  }

  destroy(dom: HTMLElement) {
    tableTeardown.get(dom)?.()
    tableTeardown.delete(dom)
  }
}

const tableTeardown = new WeakMap<HTMLElement, () => void>()

class RuleWidget extends SourceWidget {
  get estimatedHeight() {
    return 25
  }
  toDOM() {
    return frameDom(this.stack, el('div', 'cm-rt-hr'), 12, 12)
  }
}

// --- Inline HTML scan ----------------------------------------------------------

interface HtmlToken {
  from: number
  to: number
  name: string
  closing: boolean
  selfClosing: boolean
  attrs: string
}

interface HtmlPair {
  open: HtmlToken
  close: HtmlToken
}

// Lowercase tags only; components are capitalised and handled by mdxBlocks
const HTML_RE =
  /<(\/?)([a-z][a-z0-9]*)(?=[\s/>])((?:[^<>"'{}]|"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^{}]*\})*\})*?)(\/?)>/g

const VOID_TAGS = new Set(['br', 'img', 'hr', 'input', 'wbr', 'source'])

function scanHtml(text: string, skip: (from: number, to: number) => boolean) {
  const tokens: HtmlToken[] = []
  const pairs: HtmlPair[] = []
  const stack: HtmlToken[] = []
  for (const m of text.matchAll(HTML_RE)) {
    const from = m.index ?? 0
    const to = from + m[0].length
    if (skip(from, to)) continue
    const tok: HtmlToken = {
      from,
      to,
      name: m[2],
      closing: !!m[1],
      selfClosing: !!m[4] || VOID_TAGS.has(m[2]),
      attrs: m[3] ?? '',
    }
    tokens.push(tok)
    if (tok.selfClosing) continue
    if (!tok.closing) {
      stack.push(tok)
      continue
    }
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].name === tok.name) {
        pairs.push({ open: stack[i], close: tok })
        stack.length = i
        break
      }
    }
  }
  return { tokens, pairs }
}

const CONDITION_RE = /^\[\*([^\]\n]+)\]\s*$/
/** A `[*…]` gating the tag that follows it on the line */
const CONDITION_PREFIX = /^\s*\[\*([^\]\n]+)\]\s*$/

/** Toggle ids a `[*…]` expression references */
const conditionIds = (expr: string) =>
  expr
    .split(/&&|\|\|/)
    .map((p) => p.replace(/^[\s~!(]+|[\s)]+$/g, ''))
    .filter(Boolean)

/** The id conditions use for a <Checkbox>: its `id`, else its spell id */
function toggleId(tag: DocTag) {
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

/**
 * Inner HTML of a split condition chip: an `if` segment, then the terms with
 * their operators as small words between them. Past COND_TERMS terms the rest
 * collapse to a count; the tooltip has them all.
 */
const COND_TERMS = 3

function condHtml(expr: string) {
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

function condChip(expr: string, html = condHtml(expr)) {
  const chip = el('span', 'cm-rt-cond')
  chip.innerHTML = html
  chip.style.setProperty('--rt-color', condColor(expr))
  chip.title = `if ${describeCondition(expr)} · [*${expr}]`
  return chip
}

class CondWidget extends SourceWidget {
  constructor(
    raw: string,
    readonly expr: string
  ) {
    // Keyed by the rendered names, so renaming a toggle redraws its conditions
    super(raw, condHtml(expr))
  }

  toDOM(view: EditorView) {
    const chip = condChip(this.expr, this.key)
    chip.title += ' (click to edit)'
    this.wire(chip, view)
    return chip
  }
}

/** Timeline spell ids as steps, consecutive repeats merged like <Timeline> does */
function timelineSteps(ids: string[]) {
  const steps: { id: string; name: string; count: number }[] = []
  for (const id of ids) {
    const last = steps[steps.length - 1]
    if (last?.id === id) last.count++
    else steps.push({ id, name: spellName(id) ?? id, count: 1 })
  }
  return steps.map(({ name, count }) => ({ name, count }))
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

/** A stable colour per condition, so the same `[*…]` always matches */
function condColor(expr: string) {
  const key = expr.replace(/\s+/g, '')
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0
  return COND_COLORS[Math.abs(h) % COND_COLORS.length]
}

/** Removes a wrapper's opening and closing tags, keeping its content. */
function unwrap(view: EditorView, openFrom: number) {
  const text = view.state.doc.toString()
  let close: { from: number; to: number } | undefined
  let openTo = -1
  const tag = findAllTags(text).find((t) => t.from === openFrom)
  if (tag) {
    openTo = tag.to
    close = tag.close
  } else {
    const pair = scanHtml(text, () => false).pairs.find((p) => p.open.from === openFrom)
    if (pair) {
      openTo = pair.open.to
      close = pair.close
      // A conditional block's `[*id]` goes with its <div>
      const cond = /^\[\*[^\]\n]+\]/.exec(text.slice(openTo))
      if (cond) openTo += cond[0].length
    }
  }
  if (openTo < 0) return
  // So does a `[*…]` written before the tag
  const openLine = view.state.doc.lineAt(openFrom)
  const start = CONDITION_PREFIX.test(text.slice(openLine.from, openFrom))
    ? openLine.from
    : openFrom
  const span = (from: number, to: number) => {
    const doc = view.state.doc
    const a = doc.lineAt(from)
    const b = doc.lineAt(to)
    const alone = !doc.sliceString(a.from, from).trim() && !doc.sliceString(to, b.to).trim()
    return alone ? { from: a.from, to: Math.min(doc.length, b.to + 1) } : { from, to }
  }
  const changes = [span(start, openTo)]
  if (close) changes.push(span(close.from, close.to))
  view.dispatch({ changes, userEvent: 'delete' })
  view.focus()
}

// --- Decorations ---------------------------------------------------------------

interface Built {
  deco: DecorationSet
  atomic: DecorationSet
  /** Hidden ranges at a line start (heading/quote/list markers): start → end */
  leads: Map<number, number>
  /** Full-line block widgets (cards, section edges), in document order */
  blocks: [number, number][]
  /** Opening/closing tag lines of a wrapper → the wrapper's whole range */
  wrappers: Map<number, [number, number]>
}

const HIDE = Decoration.replace({})

const INLINE_COMPONENTS = new Set(['checkbox', 'wowhead'])

const MARK_CLASS: Record<string, string> = {
  b: 'cm-rt-strong',
  strong: 'cm-rt-strong',
  summary: 'cm-rt-strong',
  i: 'cm-rt-em',
  em: 'cm-rt-em',
  u: 'cm-rt-underline',
  ins: 'cm-rt-underline',
  s: 'cm-rt-strike',
  del: 'cm-rt-strike',
  strike: 'cm-rt-strike',
  sup: 'cm-rt-sup',
  sub: 'cm-rt-sub',
  kbd: 'cm-rt-kbd',
  code: 'cm-rt-code',
  mark: 'cm-rt-highlight',
  small: 'cm-rt-small',
  a: 'cm-rt-link',
}

const CALLOUT_RE = /^(\s*>\s?)(\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\])/i

function build(state: EditorState, revealed: Span, h: HandlersRef): Built {
  const doc = state.doc
  const text = doc.toString()
  const folds = state.field(foldField, false) ?? []

  type Rep = { from: number; to: number; deco: Decoration; lead?: boolean }
  const reps: Rep[] = []
  const others: Range<Decoration>[] = []
  const covered: [number, number][] = []
  const code: [number, number][] = []
  /** Boxes by content range: open line end -> close line start */
  const boxes: { a: number; b: number; kind: string }[] = []
  const lineKinds = new Map<number, LineKind>()
  const wrappers = new Map<number, [number, number]>()
  const wrapper = (open: number, close: number, to: number) => {
    wrappers.set(open, [open, to])
    wrappers.set(close, [open, to])
  }

  const overlaps = (list: [number, number][], from: number, to: number) =>
    list.some(([a, b]) => from < b && to > a)
  const isRevealed = (from: number, to: number) =>
    !!revealed && from <= revealed.to && to >= revealed.from
  const blocked = (from: number, to: number) =>
    overlaps(code, from, to) || overlaps(covered, from, to)

  const replace = (from: number, to: number, deco: Decoration = HIDE, lead = false) => {
    if (from >= to || isRevealed(from, to)) return
    reps.push({ from, to, deco, lead })
  }
  const widget = (from: number, to: number, w: WidgetType, block = false) =>
    replace(from, to, Decoration.replace({ widget: w, block }))
  const mark = (from: number, to: number, cls: string, color?: string) => {
    if (from >= to) return
    others.push(
      Decoration.mark({
        class: cls,
        attributes: color ? { style: `color:${color}` } : undefined,
      }).range(from, to)
    )
  }
  const lineClass = (pos: number, cls: string) =>
    others.push(Decoration.line({ class: cls }).range(doc.lineAt(pos).from))
  const eachLine = (from: number, to: number, fn: (lineFrom: number, i: number) => void) => {
    let i = 0
    for (let pos = from; pos <= to; ) {
      const line = doc.lineAt(pos)
      fn(line.from, i++)
      pos = line.to + 1
    }
  }
  // Full-line span when [from, to) has nothing else on its lines
  const lineSpan = (from: number, to: number) => {
    const a = doc.lineAt(from)
    const b = doc.lineAt(to)
    if (text.slice(a.from, from).trim() || text.slice(to, b.to).trim()) return null
    return { from: a.from, to: b.to }
  }
  // Same, but a `[*…]` may precede the tag: `[*id] <Timeline … />` is still a block
  const blockSpan = (from: number, to: number) => {
    const span = lineSpan(from, to)
    if (span) return { ...span, cond: undefined }
    const a = doc.lineAt(from)
    const b = doc.lineAt(to)
    const cond = CONDITION_PREFIX.exec(text.slice(a.from, from))
    if (!cond || text.slice(to, b.to).trim()) return null
    return { from: a.from, to: b.to, cond: cond[1] }
  }

  const tree = syntaxTree(state)

  // Code first: nothing inside it is rendered
  tree.iterate({
    mode: IterMode.IgnoreMounts,
    enter(n) {
      if (n.name === 'FencedCode' || n.name === 'CodeBlock' || n.name === 'InlineCode') {
        code.push([n.from, n.to])
        return false
      }
    },
  })

  // --- Custom HTML blocks ---
  // The outermost block-level element (open and close tags on their own lines)
  // stays as source, tags included, shown as one code block
  const { tokens, pairs } = scanHtml(text, (from, to) => overlaps(code, from, to))
  const isBlockPair = ({ open, close }: HtmlPair) =>
    !MARK_CLASS[open.name] && !!lineSpan(open.from, open.to) && !!lineSpan(close.from, close.to)
  const blockPairs = pairs.filter(isBlockPair)
  const htmlRaw: [number, number][] = []
  const htmlEdges: [number, number][] = []
  for (const { open, close } of blockPairs) {
    if (blockPairs.some((p) => p.open.from < open.from && p.close.to > close.to)) continue
    const span: [number, number] = [
      lineSpan(open.from, open.to)!.from,
      lineSpan(close.from, close.to)!.to,
    ]
    code.push(span)
    htmlRaw.push(span)
    htmlEdges.push([span[0], doc.lineAt(span[1]).from])
    eachLine(span[0], span[1], (from) => {
      lineClass(from, 'cm-rt-codeblock')
      lineKinds.set(from, { kind: 'code' })
    })
  }

  // --- Components ---
  const tags = findAllTags(text)
  // Conditions show toggles by name; a toggle without one goes by its spell
  toggleNames = new Map()
  for (const tag of tags) {
    if (tag.block.id !== 'checkbox') continue
    const { values } = formFromTag(tag)
    const name = String(values.name ?? '').trim() || spellName(String(values.spellId ?? '').trim())
    const id = toggleId(tag)
    if (id && name && !toggleNames.has(id)) toggleNames.set(id, name)
  }
  for (const tag of tags) {
    if (blocked(tag.from, tag.to)) continue
    const { block } = tag
    const { values } = formFromTag(tag)
    const str = (k: string) => String(values[k] ?? '').trim()
    const summary =
      block.id === 'checkbox'
        ? summarizeBlock(tag) || spellName(str('spellId')) || ''
        : summarizeBlock(tag)
    const thumb =
      block.id === 'youtube' && str('id')
        ? `https://i.ytimg.com/vi/${str('id')}/default.jpg`
        : undefined
    const span = INLINE_COMPONENTS.has(block.id) ? null : blockSpan(tag.from, tag.to)
    const foldable = !tag.selfClosing && block.id !== 'talents'
    const description = block.id === 'talents' ? str('comment') : undefined
    const hero = block.id === 'hero' ? (HERO_COLORS[str('id')] ? str('id') : 'generic') : undefined
    // <Talents>…</Talents>: the content renders under the tree as an extra
    const bodyLabel =
      !tag.selfClosing && block.fields.some((f) => f.body) ? 'Optional body' : undefined
    const fields = tag.selfClosing || bodyLabel ? blockFields(tag) : []
    const spells = block.id === 'timeline' ? timelineSteps(values.spellIds as string[]) : undefined
    const cond = span?.cond
    const spec = (kind: CardSpec['kind'], from: number): CardSpec => ({
      kind,
      label: block.label,
      summary,
      detail: blockDetail(tag),
      tagOffset: tag.from - from,
      editable: true,
      thumb,
      foldable,
      description: kind === 'footer' ? undefined : description,
      linkId: block.id === 'checkbox' ? toggleId(tag) : undefined,
      hue: hero ? HERO_COLORS[hero] : BLOCK_HUES[block.id],
      tint: !!hero,
      chipType:
        block.id === 'wowhead'
          ? (str('type') || 'spell').replace(/^./, (c) => c.toUpperCase())
          : undefined,
      toggle:
        block.id === 'checkbox'
          ? { checked: !!values.defaultCheck, radio: str('radio') }
          : undefined,
      fields:
        (kind === 'card' || bodyLabel) && kind !== 'footer' && fields.length ? fields : undefined,
      bodyLabel: kind === 'header' ? bodyLabel : undefined,
      spells: kind === 'card' ? spells : undefined,
      cond:
        cond && kind !== 'footer' ? { expr: cond, html: condHtml(cond), lead: true } : undefined,
      href:
        block.id === 'planner' && str('code')
          ? {
              url: `/planner?loadout=${encodeURIComponent(str('code'))}`,
              title: 'Open in the planner',
            }
          : undefined,
    })
    const closeSpan = tag.close && lineSpan(tag.close.from, tag.close.to)
    if (span && closeSpan && foldable && folds.includes(tag.from)) {
      // Folded: the header stands in for the whole section
      const raw = text.slice(span.from, closeSpan.to)
      widget(
        span.from,
        closeSpan.to,
        new CardWidget(raw, { ...spec('header', span.from), folded: true }, h),
        true
      )
      covered.push([span.from, closeSpan.to])
      continue
    }
    if (span) {
      const kind = tag.selfClosing ? 'card' : 'header'
      widget(
        span.from,
        span.to,
        new CardWidget(text.slice(span.from, span.to), spec(kind, span.from), h),
        true
      )
      covered.push([span.from, span.to])
    } else {
      widget(
        tag.from,
        tag.to,
        new CardWidget(text.slice(tag.from, tag.to), spec('chip', tag.from), h)
      )
      covered.push([tag.from, tag.to])
    }
    if (tag.close) {
      const { from, to } = tag.close
      if (closeSpan) {
        const raw = text.slice(closeSpan.from, closeSpan.to)
        widget(
          closeSpan.from,
          closeSpan.to,
          new CardWidget(raw, spec('footer', closeSpan.from), h),
          true
        )
        covered.push([closeSpan.from, closeSpan.to])
        if (span && !tag.selfClosing) {
          boxes.push({ a: span.to, b: closeSpan.from, kind: hero ? HERO_BOX[hero] : 's' })
          wrapper(span.from, closeSpan.from, closeSpan.to)
        }
      } else {
        replace(from, to)
        covered.push([from, to])
      }
    }
  }

  // --- Inline HTML ---
  const paired = new Set<HtmlToken>()
  for (const { open, close } of pairs) {
    if (blocked(open.from, close.to)) continue
    paired.add(open).add(close)
    const openSpan = lineSpan(open.from, open.to)
    const closeSpan = lineSpan(close.from, close.to)

    // <div>[*id] … </div> or [*id] <div> … </div>: content shown only when a
    // toggle is ticked
    const openLine = doc.lineAt(open.from)
    const before = text.slice(openLine.from, open.from)
    const after = text.slice(open.to, openLine.to)
    const cond = before.trim()
      ? !after.trim() && CONDITION_PREFIX.exec(before)
      : CONDITION_RE.exec(after)
    if (open.name === 'div' && cond) {
      const raw = text.slice(openLine.from, openLine.to)
      const spec: CardSpec = {
        kind: 'header',
        label: 'Conditional',
        summary: 'Shown',
        tagOffset: open.from - openLine.from,
        editable: false,
        foldable: true,
        cond: { expr: cond[1], html: condHtml(cond[1]), lead: false },
      }
      if (closeSpan && folds.includes(open.from)) {
        const all = text.slice(openLine.from, closeSpan.to)
        widget(openLine.from, closeSpan.to, new CardWidget(all, { ...spec, folded: true }, h), true)
        covered.push([openLine.from, closeSpan.to])
        continue
      }
      widget(openLine.from, openLine.to, new CardWidget(raw, spec, h), true)
      covered.push([openLine.from, openLine.to])
      if (closeSpan) {
        const foot = { ...spec, kind: 'footer' as const }
        widget(
          closeSpan.from,
          closeSpan.to,
          new CardWidget(text.slice(closeSpan.from, closeSpan.to), foot, h),
          true
        )
        boxes.push({ a: openLine.to, b: closeSpan.from, kind: 's' })
        wrapper(openLine.from, closeSpan.from, closeSpan.to)
      } else replace(close.from, close.to)
      continue
    }

    // Empty element with a background colour: the legend squares
    const bg = classColor(open.attrs, 'bg')
    if (bg && open.to === close.from) {
      widget(
        open.from,
        close.to,
        new PillWidget(text.slice(open.from, close.to), '', 'cm-rt-swatch', false, bg)
      )
      continue
    }

    for (const tok of [open, close]) {
      const span = tok === open ? openSpan : closeSpan
      if (span) {
        const cls = firstClass(tok.attrs)
        const label = (tok.closing ? '/' : '') + tok.name + (cls ? `.${cls}` : '')
        widget(span.from, span.to, new TagLineWidget(text.slice(span.from, span.to), label), true)
      } else replace(tok.from, tok.to)
    }
    if (openSpan && closeSpan) wrapper(openSpan.from, closeSpan.from, closeSpan.to)
    const cls = MARK_CLASS[open.name]
    const color = classColor(open.attrs, 'text')
    if (cls || color) mark(open.to, close.from, cls ?? 'cm-rt-colored', color)
  }
  for (const tok of tokens) {
    if (paired.has(tok) || blocked(tok.from, tok.to)) continue
    const raw = text.slice(tok.from, tok.to)
    if (tok.name === 'br') {
      widget(tok.from, tok.to, new PillWidget(raw, '↵', 'cm-rt-br'))
      continue
    }
    const span = lineSpan(tok.from, tok.to)
    const label = (tok.closing ? '/' : '') + tok.name
    if (span)
      widget(span.from, span.to, new TagLineWidget(text.slice(span.from, span.to), label), true)
    else widget(tok.from, tok.to, new PillWidget(raw, label, 'cm-rt-tag'))
  }

  // --- Custom inline syntax ---
  // Same pattern as plugins/remarkColor.js, which also matches mid-word
  for (const m of text.matchAll(/:([a-zA-Z]+|#[0-9a-fA-F]{3,8})\[([^\]]+)\]/g)) {
    const from = m.index ?? 0
    const to = from + m[0].length
    const name = m[1].toLowerCase()
    const color = colorFor(name)
    if (blocked(from, to)) continue
    const open = from + m[1].length + 2
    replace(from, open)
    replace(to - 1, to)
    mark(open, to - 1, 'cm-rt-colored', color)
  }
  for (const m of text.matchAll(/\[\*([^\]\n]+)\]/g)) {
    const from = m.index ?? 0
    const to = from + m[0].length
    if (blocked(from, to)) continue
    widget(from, to, new CondWidget(m[0], m[1]))
  }

  // --- Markdown ---
  const headingLines = new Set<number>()
  const hideMarks = (node: SyntaxNode, name: string) => {
    for (const c of node.getChildren(name)) replace(c.from, c.to)
  }
  tree.iterate({
    mode: IterMode.IgnoreMounts,
    enter(n) {
      if (n.name === 'Document') return
      // Source shown verbatim inside a custom HTML box
      if (htmlRaw.some(([a, b]) => n.from >= a && n.to <= b + 1)) return false
      if (overlaps(covered, n.from, n.to) && !/List|Blockquote|Paragraph|HTMLBlock/.test(n.name)) {
        return false
      }
      const node = n.node
      switch (n.name) {
        case 'FencedCode': {
          eachLine(n.from, n.to, (from, i) => {
            lineClass(from, 'cm-rt-codeblock')
            lineKinds.set(from, { kind: 'code' })
            const line = doc.lineAt(from)
            if (i === 0 || line.to >= n.to) lineClass(from, 'cm-rt-fence')
          })
          return false
        }
        case 'CodeBlock':
          eachLine(n.from, n.to, (from) => {
            lineClass(from, 'cm-rt-codeblock')
            lineKinds.set(from, { kind: 'code' })
          })
          return false
        case 'InlineCode': {
          const marks = node.getChildren('CodeMark')
          if (marks.length < 2) return false
          mark(marks[0].to, marks[marks.length - 1].from, 'cm-rt-code')
          for (const c of marks) replace(c.from, c.to)
          return false
        }
        case 'Table': {
          const span = lineSpan(n.from, n.to)
          if (span)
            widget(span.from, span.to, new TableWidget(text.slice(span.from, span.to), h), true)
          else eachLine(n.from, n.to, (from) => lineClass(from, 'cm-rt-table'))
          return false
        }
        case 'StrongEmphasis':
          mark(n.from, n.to, 'cm-rt-strong')
          hideMarks(node, 'EmphasisMark')
          return
        case 'Emphasis':
          mark(n.from, n.to, 'cm-rt-em')
          hideMarks(node, 'EmphasisMark')
          return
        case 'Strikethrough':
          mark(n.from, n.to, 'cm-rt-strike')
          hideMarks(node, 'StrikethroughMark')
          return
        case 'Escape':
          replace(n.from, n.from + 1)
          return false
        case 'HorizontalRule': {
          const span = lineSpan(n.from, n.to)
          if (span)
            widget(span.from, span.to, new RuleWidget(text.slice(span.from, span.to), ''), true)
          return false
        }
        case 'Link': {
          const marks = node.getChildren('LinkMark')
          const url = node.getChild('URL')
          if (!url || marks.length < 2 || marks[0].to === marks[1].from) return
          replace(n.from, marks[0].to)
          replace(marks[1].from, n.to)
          mark(marks[0].to, marks[1].from, 'cm-rt-link')
          return
        }
        case 'Image': {
          const marks = node.getChildren('LinkMark')
          const url = node.getChild('URL')
          if (!url || marks.length < 2) return false
          const src = text.slice(url.from, url.to)
          const alt = text.slice(marks[0].to, marks[1].from)
          const span = lineSpan(n.from, n.to)
          const from = span?.from ?? n.from
          const to = span?.to ?? n.to
          const w = new ImageWidget(
            text.slice(from, to),
            src,
            alt,
            n.from - from,
            n.to - n.from,
            !!span,
            h
          )
          widget(from, to, w, !!span)
          return false
        }
        case 'ListMark': {
          const list = node.parent?.parent?.name
          const after = text[n.to] === ' ' ? n.to + 1 : n.to
          if (list === 'BulletList') {
            replace(
              n.from,
              after,
              Decoration.replace({
                widget: new PillWidget(text.slice(n.from, after), '•', 'cm-rt-bullet', true),
              }),
              true
            )
          } else mark(n.from, n.to, 'cm-rt-olmark')
          return
        }
        case 'Blockquote': {
          const first = doc.lineAt(n.from)
          const callout = CALLOUT_RE.exec(first.text)
          const cls = callout
            ? `cm-rt-callout cm-rt-callout-${callout[3].toLowerCase()}`
            : 'cm-rt-quote'
          const kind: LineKind = callout
            ? { kind: 'callout', color: CALLOUTS[callout[3].toLowerCase()] }
            : { kind: 'quote' }
          eachLine(n.from, n.to, (from) => {
            lineClass(from, cls)
            lineKinds.set(from, kind)
          })
          if (callout) {
            const from = first.from + callout[1].length
            const to = from + callout[2].length
            const type = callout[3].toUpperCase()
            const label = type[0] + type.slice(1).toLowerCase()
            const color = CALLOUTS[type.toLowerCase()]
            if (isRevealed(first.from, first.to)) {
              lineClass(first.from, 'cm-rt-callout-src')
            } else if (!text.slice(to, first.to).trim()) {
              // Marker alone on its line: a block header, so the caret can't
              // land after the marker and type onto the header line
              const raw = text.slice(first.from, first.to)
              const head = new CalloutHeadWidget(raw, label, color, n.to - first.from, h)
              widget(first.from, first.to, head, true)
            } else {
              widget(from, to, new PillWidget(callout[2], label, 'cm-rt-callout-label'))
            }
          }
          return
        }
        case 'QuoteMark': {
          const after = text[n.to] === ' ' ? n.to + 1 : n.to
          replace(n.from, after, HIDE, true)
          return
        }
        case 'HTMLBlock':
        case 'Paragraph':
          return
      }
      const heading = /^(?:ATX|Setext)Heading(\d)$/.exec(n.name)
      if (heading) {
        const line = doc.lineAt(n.from)
        headingLines.add(line.from)
        lineClass(line.from, `cm-rt-h${heading[1]}`)
        for (const c of node.getChildren('HeaderMark')) {
          if (n.name.startsWith('Setext')) {
            lineClass(c.from, 'cm-rt-setext')
          } else if (c.from === line.from || !text.slice(line.from, c.from).trim()) {
            const after = text[c.to] === ' ' ? c.to + 1 : c.to
            replace(c.from, after, HIDE, true)
          } else {
            replace(text[c.from - 1] === ' ' ? c.from - 1 : c.from, c.to)
          }
        }
      }
    },
  })

  // Headings inside HTML blocks (content right under a component tag) aren't
  // parsed as markdown; style them anyway
  for (const m of text.matchAll(/^(#{1,6}) +\S.*$/gm)) {
    const from = m.index ?? 0
    if (headingLines.has(from) || blocked(from, from + m[0].length)) continue
    lineClass(from, `cm-rt-h${m[1].length}`)
    replace(from, from + m[1].length + 1, HIDE, true)
  }

  // Box geometry: block widgets learn their depth, lines get borders and fills
  boxes.sort((x, y) => x.a - y.a)
  const stackAt = (pos: number) =>
    boxes
      .filter(({ a, b }) => pos > a && pos < b)
      .map((x) => x.kind)
      .join('')
  for (const r of reps) {
    const w = r.deco.spec.widget
    if (r.deco.spec.block && w instanceof SourceWidget) w.stack = stackAt(r.from)
  }
  const styled = new Set<number>(lineKinds.keys())
  // Breathing room between a box's edges and its first/last line of text
  const padTop = new Map<number, number>()
  const padBottom = new Map<number, number>()
  for (const { a, b, kind } of boxes) {
    if (b <= a + 1) continue
    eachLine(a + 1, b - 1, (from) => styled.add(from))
    const first = doc.lineAt(a + 1)
    const last = doc.lineAt(b - 1)
    if (first.text.trim()) padTop.set(first.from, kind === 's' ? 10 : 6)
    if (last.text.trim()) padBottom.set(last.from, kind === 's' ? 6 : 4)
  }
  for (const [first, last] of htmlEdges) {
    padTop.set(first, 8)
    padBottom.set(last, 8)
  }
  for (const from of styled) {
    const stack = stackAt(from)
    const kind = lineKinds.get(from)
    if (stack || kind) {
      const style = lineStyle(stack, kind, padTop.get(from), padBottom.get(from))
      others.push(Decoration.line({ attributes: { style } }).range(from))
    }
  }

  // Overlapping replacements can't coexist; the earliest (then widest) wins
  reps.sort((a, b) => a.from - b.from || b.to - a.to)
  const kept: Range<Decoration>[] = []
  const leads = new Map<number, number>()
  const blocks: [number, number][] = []
  let end = -1
  for (const r of reps) {
    if (r.from < end) continue
    end = r.to
    kept.push(r.deco.range(r.from, r.to))
    if (r.lead) leads.set(r.from, r.to)
    if (r.deco.spec.block) blocks.push([r.from, r.to])
  }

  return {
    deco: Decoration.set([...kept, ...others], true),
    atomic: Decoration.set(kept, true),
    leads,
    blocks,
    wrappers,
  }
}

// --- Extension -----------------------------------------------------------------

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
      // Let the caret land first, then open the popover
      setTimeout(() => h.current.openLink(from, to))
      return false
    },
  })

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
            // Match the card itself, which sits inside its enclosing boxes
            const widget = Array.from(view.contentDOM.children).find(
              (c) => c.classList.contains('cm-rt-frame') && view.posAtDOM(c) === gap.card
            )
            if (!widget) return null
            // Block widgets are framed (frameDom); the card is the frame's child
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

  return [
    revealField,
    foldField,
    linkField,
    field,
    leadFilter,
    events,
    gapStep,
    gapInput,
    gapKeys,
    gapCursor,
    linkLines,
    spellLoader,
    richTheme,
  ]
}

// --- Toggle link lines ----------------------------------------------------------
//
// With a toggle's eye on, a line runs down the left gutter from the toggle to
// every condition referencing its id. A condition hidden in a folded section
// points at the vertical middle of that section instead.

const LINK_COLORS = ['#5b9bd5', '#a77fdc', '#5fb760', '#e2c044', '#e05555', '#e0883f']

type LinkDrawing = { active: readonly string[]; paths: string }

const linkLines = ViewPlugin.fromClass(
  class {
    svg: SVGSVGElement

    constructor(readonly view: EditorView) {
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      this.svg.setAttribute('class', 'cm-rt-links')
      view.scrollDOM.append(this.svg)
      this.schedule()
    }

    update(u: ViewUpdate) {
      const active = u.state.field(linkField, false) ?? []
      if (active.length || u.startState.field(linkField, false) !== active) this.schedule()
    }

    schedule() {
      this.view.requestMeasure<LinkDrawing>({
        key: this,
        read: () => this.read(),
        write: (m) => this.write(m),
      })
    }

    read(): LinkDrawing {
      const { view } = this
      const active = view.state.field(linkField, false) ?? []
      if (!active.length) return { active, paths: '' }
      const text = view.state.doc.toString()
      const scroller = view.scrollDOM.getBoundingClientRect()
      const ox = view.scrollDOM.scrollLeft - scroller.left
      const oy = view.scrollDOM.scrollTop - scroller.top
      const left = view.contentDOM.getBoundingClientRect().left + ox
      const docTop = view.documentTop + oy

      // Where a branch ends for the thing at `pos`: its rendered left edge, or
      // the middle of the block widget (folded section, card) standing in for it
      const point = (pos: number) => {
        const block = view.lineBlockAt(pos)
        const fallback = { x: left + GUTTER, y: docTop + block.top + block.height / 2 }
        if (block.type === BlockType.WidgetRange) return fallback
        const c = view.coordsAtPos(pos, 1)
        return c ? { x: c.left + ox, y: (c.top + c.bottom) / 2 + oy } : fallback
      }

      const conditions = [...text.matchAll(/\[\*([^\]\n]+)\]/g)].map((m) => ({
        pos: m.index ?? 0,
        ids: conditionIds(m[1]),
      }))
      const toggles = findAllTags(text).filter((t) => t.block.id === 'checkbox')
      let paths = ''
      active.forEach((id, i) => {
        const color = LINK_COLORS[i % LINK_COLORS.length]
        const trunk = left + 8 + i * 5
        const sources = toggles.filter((t) => toggleId(t) === id).map((t) => point(t.from))
        // Conditions folded into the same section share one end point
        const targets = new Map<string, { x: number; y: number }>()
        for (const c of conditions) {
          if (!c.ids.includes(id)) continue
          const p = point(c.pos)
          targets.set(`${Math.round(p.x)},${Math.round(p.y)}`, p)
        }
        if (!sources.length || !targets.size) return
        const all = [...sources, ...targets.values()]
        const ys = all.map((p) => p.y)
        let d = `M${trunk} ${Math.min(...ys)}V${Math.max(...ys)}`
        let dots = ''
        for (const p of all) {
          const end = Math.max(trunk, p.x - 3)
          d += `M${trunk} ${p.y}H${end}`
          if (!sources.includes(p))
            dots += `<circle cx="${end}" cy="${p.y}" r="2.5" fill="${color}"/>`
        }
        paths += `<path d="${d}" stroke="${color}" stroke-width="1.5" fill="none"/>${dots}`
      })
      return { active, paths }
    }

    write({ active, paths }: LinkDrawing) {
      this.svg.innerHTML = paths
      this.view.contentDOM.querySelectorAll<HTMLElement>('[data-rt-link]').forEach((b) => {
        const i = active.indexOf(b.dataset.rtLink ?? '')
        b.classList.toggle('cm-rt-on', i >= 0)
        b.style.color = i >= 0 ? LINK_COLORS[i % LINK_COLORS.length] : ''
        b.title = i >= 0 ? 'Hide the condition lines' : 'Show the conditions using this toggle'
      })
    }

    destroy() {
      this.svg.remove()
    }
  }
)

// --- Theme ---------------------------------------------------------------------

const SANS = "'familiar-pro', ui-sans-serif, system-ui, sans-serif"
const DISPLAY = "'thiccboi', 'familiar-pro', ui-sans-serif, system-ui, sans-serif"
const MONO = 'Consolas, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace'

const CALLOUTS: Record<string, string> = {
  note: '#5b9bd5',
  tip: '#5fb760',
  important: '#a77fdc',
  warning: '#e2c044',
  caution: '#e05555',
}

const richTheme = EditorView.theme({
  '&.cm-editor .cm-content': {
    fontFamily: SANS,
    fontSize: '15px',
    lineHeight: '1.75',
    color: '#e9e4dc',
    padding: '18px 0 40vh',
  },
  '&.cm-editor .cm-line': { padding: '0 28px' },
  '&.cm-editor .cm-activeLine': { backgroundColor: 'transparent' },

  // Headings
  '& .cm-line.cm-rt-h1, & .cm-line.cm-rt-h2, & .cm-line.cm-rt-h3, & .cm-line.cm-rt-h4, & .cm-line.cm-rt-h5, & .cm-line.cm-rt-h6':
    { fontFamily: DISPLAY, color: '#ffffff', fontWeight: '700', lineHeight: '1.35' },
  '& .cm-line.cm-rt-h1': { fontSize: '1.85em', paddingTop: '.5em' },
  '& .cm-line.cm-rt-h2': { fontSize: '1.5em', paddingTop: '.45em' },
  '& .cm-line.cm-rt-h3': { fontSize: '1.25em', paddingTop: '.35em' },
  '& .cm-line.cm-rt-h4': { fontSize: '1.1em', paddingTop: '.25em' },
  '& .cm-line.cm-rt-h5, & .cm-line.cm-rt-h6': { fontSize: '1em', color: 'rgba(255,255,255,.8)' },
  '& .cm-line.cm-rt-setext': { fontSize: '.7em', color: 'rgba(255,255,255,.25)' },
  // The base highlighter colours heading text orange; keep it white here
  '& .cm-line[class*="cm-rt-h"] span:not(.cm-spell-token):not(.cm-rt-link):not([style])': {
    color: '#ffffff',
  },

  // Inline formatting
  // The MDX highlighter shares its bold/italic tags with spell names and tints
  // them orange; rich text keeps them in the body colour
  '& .cm-rt-strong:not([style]), & .cm-rt-strong span:not(.cm-spell-token):not(.cm-rt-link):not([style])':
    {
      fontWeight: '700',
      color: '#ffffff',
    },
  '& .cm-rt-em:not([style]), & .cm-rt-em span:not(.cm-spell-token):not(.cm-rt-link):not([style])': {
    fontStyle: 'italic',
    color: '#e9e4dc',
  },
  // Same box as the condition pills it often sits beside
  '.cm-spell-token': { display: 'inline-block', lineHeight: '1.33', verticalAlign: '1px' },
  // A spell token opened for editing: plain source, sized like the token
  '& .cm-spell-editing, & .cm-spell-editing span': {
    fontFamily: MONO,
    fontSize: '13px',
    fontWeight: 'normal',
    color: '#ffb86c',
  },
  '.cm-rt-underline': { textDecoration: 'underline', textUnderlineOffset: '3px' },
  '.cm-rt-strike': { textDecoration: 'line-through' },
  '.cm-rt-sup': { verticalAlign: 'super', fontSize: '.75em' },
  '.cm-rt-sub': { verticalAlign: 'sub', fontSize: '.75em' },
  '.cm-rt-small': { fontSize: '.85em' },
  '.cm-rt-highlight': { backgroundColor: 'rgba(226,192,68,.25)' },
  '.cm-rt-colored, .cm-rt-colored *': { color: 'inherit' },
  // `[…]` of a colour directive reads as a link label to the MDX highlighter
  '& .cm-rt-colored span:not(.cm-rt-link):not(.cm-rt-underline)': { textDecoration: 'none' },
  '.cm-rt-code, .cm-rt-kbd': {
    fontFamily: MONO,
    fontSize: '.86em',
    backgroundColor: '#2c2c2c',
    border: '1px solid #3a3a3a',
    borderRadius: '3px',
    padding: '1px 4px',
  },
  '.cm-rt-link': {
    color: '#ffb86c',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(255,184,108,.45)',
    textUnderlineOffset: '3px',
    cursor: 'pointer',
  },
  '.cm-rt-link *': { color: 'inherit', textDecoration: 'none' },

  // Lists and quotes
  '.cm-rt-bullet': {
    display: 'inline-block',
    width: '1.1em',
    color: '#ffb86c',
    fontWeight: '700',
  },
  '.cm-rt-olmark': { color: '#ffb86c', fontWeight: '600' },
  '& .cm-line.cm-rt-quote': { color: 'rgba(233,228,220,.75)' },
  ...Object.fromEntries(
    Object.entries(CALLOUTS).map(([k, c]) => [
      `& .cm-line.cm-rt-callout-${k}`,
      { '--rt-callout': c },
    ])
  ),
  '.cm-rt-callout-head': {
    padding: '4px 0 0 16px',
    borderLeft: '3px solid var(--rt-callout)',
    backgroundColor: 'color-mix(in srgb, var(--rt-callout) 9%, transparent)',
    color: 'var(--rt-callout)',
    fontWeight: '700',
    fontSize: '.8em',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    lineHeight: '22px',
    cursor: 'pointer',
  },
  // `> [!TIP]` while its source is revealed: compact, like the header it replaces
  '& .cm-line.cm-rt-callout-src, & .cm-line.cm-rt-callout-src span': {
    fontFamily: MONO,
    fontSize: '12px',
    color: 'var(--rt-callout, rgba(255,255,255,.6))',
    textDecoration: 'none',
  },
  '.cm-rt-callout-label': {
    color: 'var(--rt-callout)',
    fontWeight: '700',
    fontSize: '.8em',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },

  // Line backgrounds (code, boxes) would hide CodeMirror's selection layer,
  // which sits behind the content, leaving only the theme's native highlight
  // on the text itself. Draw the (translucent) selection above instead.
  '& .cm-scroller > .cm-selectionLayer': { zIndex: '2 !important', pointerEvents: 'none' },
  // Out-specifies the theme's `.cm-content ::selection` rule
  '& .cm-content .cm-line ::selection, & .cm-content .cm-line::selection': {
    background: 'transparent !important',
  },

  // Code and tables stay as source
  '& .cm-line.cm-rt-codeblock': { fontFamily: MONO, fontSize: '13px' },
  '& .cm-line.cm-rt-fence': { color: 'rgba(255,255,255,.3)' },
  '& .cm-line.cm-rt-table': { fontFamily: MONO, fontSize: '13px', color: 'rgba(233,228,220,.85)' },

  // Small inline pills
  '.cm-rt-tag, .cm-rt-br': {
    display: 'inline-block',
    fontFamily: MONO,
    fontSize: '11px',
    lineHeight: '17px',
    padding: '0 6px',
    margin: '0 2px',
    borderRadius: '3px',
    verticalAlign: '1px',
    cursor: 'pointer',
    color: 'rgba(255,255,255,.4)',
    border: '1px solid #3a3a3a',
  },
  // Split condition: a filled `if`, then names with operator words between
  '.cm-rt-cond': {
    '--rt-c': 'var(--rt-color, #C5E6A6)',
    display: 'inline-flex',
    alignItems: 'stretch',
    maxWidth: '100%',
    margin: '0 2px',
    border: '1px solid color-mix(in srgb, var(--rt-c) 55%, transparent)',
    borderRadius: '3px',
    overflow: 'hidden',
    fontFamily: SANS,
    fontSize: '12px',
    lineHeight: '17px',
    verticalAlign: '1px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  '.cm-rt-cond-if': {
    padding: '0 5px',
    backgroundColor: 'var(--rt-c)',
    color: '#141414',
    fontWeight: '700',
  },
  '.cm-rt-cond-name': {
    padding: '0 6px',
    color: 'var(--rt-c)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '.cm-rt-cond-op': {
    display: 'flex',
    alignItems: 'center',
    padding: '0 4px',
    fontSize: '9.5px',
    fontWeight: '700',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    color: 'color-mix(in srgb, var(--rt-c) 70%, #8a8a8a)',
    backgroundColor: 'color-mix(in srgb, var(--rt-c) 8%, transparent)',
    borderLeft: '1px solid color-mix(in srgb, var(--rt-c) 30%, transparent)',
    borderRight: '1px solid color-mix(in srgb, var(--rt-c) 30%, transparent)',
  },
  '.cm-rt-cond-if + .cm-rt-cond-op': { borderLeft: 'none' },
  // Inside a card's header row the chip sits on the row's centre line
  '.cm-rt-card-head > .cm-rt-cond, .cm-rt-wrap-head > .cm-rt-cond, .cm-rt-card-summary > .cm-rt-cond':
    {
      flexShrink: '0',
      alignSelf: 'center',
      margin: '0',
      verticalAlign: 'baseline',
    },
  '.cm-rt-swatch': {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    backgroundColor: 'var(--rt-color)',
    verticalAlign: '-1px',
    margin: '0 4px',
    cursor: 'pointer',
  },
  '.cm-rt-tagline': { lineHeight: '20px', cursor: 'pointer' },
  '.cm-rt-tagline .cm-rt-tag': { margin: 0 },
  '.cm-rt-hr': { height: '1px', backgroundColor: '#3a3a3a' },

  // Component cards
  '.cm-rt-card, .cm-rt-wrap-head': {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 6px 6px 14px',
    backgroundColor: '#262626',
    border: '1px solid #3a3a3a',
    borderRadius: '4px',
    fontFamily: SANS,
    fontSize: '13.5px',
    lineHeight: '1.4',
    cursor: 'pointer',
    transition: 'border-color .12s',
  },
  '.cm-rt-card:hover, .cm-rt-wrap-head:hover': { borderColor: '#565656' },
  // Field card: the header row over the block's own contents
  '.cm-rt-card.cm-rt-block': { display: 'block', padding: '0' },
  '.cm-rt-card-head': {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 6px 6px 14px',
  },
  '.cm-rt-card-body': {
    borderTop: '1px solid #333',
    padding: '9px 14px 10px',
  },
  // One row: short values take their own width, the wide one gets the rest
  '.cm-rt-fields': { display: 'flex', gap: '24px' },
  '.cm-rt-field': { display: 'flex', flexDirection: 'column', minWidth: '0', flex: '0 0 auto' },
  '.cm-rt-field-wide': { flex: '1 1 0' },
  '.cm-rt-field-label': { fontSize: '11.5px', color: 'rgba(255,255,255,.45)' },
  '.cm-rt-field-value': {
    color: 'rgba(255,255,255,.85)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '.cm-rt-field-mono': { fontFamily: MONO, fontSize: '12.5px' },
  // A share code on its own would run the full card width; cap it (the full
  // value stays in the tooltip)
  '.cm-rt-field:only-child > .cm-rt-field-mono': { maxWidth: '40ch' },
  '.cm-rt-steps': { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' },
  '.cm-rt-step': {
    border: '1px solid #444',
    borderRadius: '3px',
    padding: '0 6px',
    lineHeight: '20px',
    color: 'rgba(255,255,255,.85)',
  },
  '.cm-rt-step-count': { marginLeft: '4px', fontSize: '11.5px', color: 'rgba(255,255,255,.45)' },
  '.cm-rt-step-arrow': { color: 'rgba(255,255,255,.3)' },
  '.cm-rt-wrap-head': {
    paddingLeft: '8px',
    backgroundColor: '#2a2621',
    borderRadius: '4px 4px 0 0',
  },
  '.cm-rt-wrap-head.cm-rt-folded': { borderRadius: '4px' },
  '.cm-rt-wrap-head.cm-rt-block': { display: 'block', padding: '0' },
  '.cm-rt-body-label': {
    borderTop: '1px dashed #3a3a3a',
    padding: '5px 14px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '.04em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,.4)',
  },
  // Hero talent sections: the tree's colour on the header, edges and badge
  '.cm-rt-wrap-head.cm-rt-tinted': {
    borderColor: `color-mix(in srgb, var(--rt-hue) 55%, ${BOX_BORDER})`,
    backgroundColor: 'color-mix(in srgb, var(--rt-hue) 16%, #232323)',
  },
  '.cm-rt-wrap-head.cm-rt-tinted:hover': { borderColor: 'var(--rt-hue)' },
  '.cm-rt-wrap-foot.cm-rt-tinted': {
    borderColor: `color-mix(in srgb, var(--rt-hue) 55%, ${BOX_BORDER})`,
    backgroundColor: 'color-mix(in srgb, var(--rt-hue) 6%, transparent)',
  },
  // The tree colours are dark; lift them so the badge text stays readable
  '.cm-rt-tinted .cm-rt-badge': {
    color: 'color-mix(in srgb, var(--rt-hue) 55%, #fff)',
    backgroundColor: 'color-mix(in srgb, var(--rt-hue) 35%, transparent)',
  },
  // The 28px hit area leaves ~8px of air around the icon; pull the badge in
  // so the chevron sits evenly between the border and the badge
  '.cm-rt-wrap-head > .cm-rt-btn:first-child': { marginRight: '-4px' },
  '.cm-rt-wrap-head > .cm-rt-btn:first-child svg': { transition: 'transform .12s' },
  '.cm-rt-folded > .cm-rt-btn:first-child svg': { transform: 'rotate(-90deg)' },
  '.cm-rt-badge': {
    flexShrink: '0',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '.04em',
    textTransform: 'uppercase',
    color: 'var(--rt-hue, #ffb86c)',
    backgroundColor: 'color-mix(in srgb, var(--rt-hue, #d57f43) 15%, transparent)',
    borderRadius: '3px',
    // Caps-only text: a tight line box with a touch more padding on top
    // keeps the letters optically centred
    lineHeight: '1',
    padding: '5px 8px 4px',
  },
  '.cm-rt-card-summary': {
    minWidth: '0',
    flex: '1',
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    color: 'rgba(255,255,255,.85)',
  },
  '.cm-rt-card-title': {
    flexShrink: '0',
    maxWidth: '60%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  // Sits beside the title and takes whatever room is left
  '.cm-rt-card-desc': {
    minWidth: '0',
    fontSize: '12.5px',
    color: 'rgba(255,255,255,.55)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Tables
  '.cm-rt-table-wrap': {
    position: 'relative',
    overflowX: 'auto',
    border: '1px solid #3a3a3a',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  '.cm-rt-table-wrap:hover': { borderColor: '#565656' },
  '.cm-rt-table': {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  '.cm-rt-table th, .cm-rt-table td': {
    padding: '6px 12px',
    textAlign: 'left',
    verticalAlign: 'top',
    borderBottom: '1px solid #333',
  },
  '.cm-rt-table th': { backgroundColor: '#262626', color: '#fff', fontWeight: '700' },
  '.cm-rt-cell': { cursor: 'text', outline: 'none' },
  '.cm-rt-cell:hover': { backgroundColor: 'rgba(255,255,255,.03)' },
  '.cm-rt-cell.cm-rt-cell-active': {
    boxShadow: 'inset 0 0 0 1px #5b9bd5',
    backgroundColor: 'rgba(91,155,213,.08)',
  },
  '.cm-rt-cell .cm-spell-token, .cm-rt-cell .cm-rt-cond': { userSelect: 'all' },
  '.cm-rt-cell-active .cm-rt-link': { cursor: 'pointer' },
  '.cm-rt-cell.cm-rt-cell-editing': {
    fontFamily: MONO,
    fontSize: '13px',
    fontWeight: '400',
    whiteSpace: 'pre-wrap',
    boxShadow: 'inset 0 0 0 1px #5b9bd5',
    backgroundColor: 'rgba(91,155,213,.08)',
  },
  '.cm-rt-table tr:last-child td': { borderBottom: 'none' },
  '.cm-rt-table-actions': {
    position: 'absolute',
    top: '3px',
    right: '3px',
    opacity: '0',
    backgroundColor: '#262626',
    borderRadius: '3px',
    transition: 'opacity .12s',
  },
  '.cm-rt-table-wrap:hover .cm-rt-table-actions': { opacity: '1' },
  '.cm-rt-card-actions': { display: 'flex', gap: '2px', flexShrink: '0' },
  '.cm-rt-btn': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '3px',
    color: 'rgba(255,255,255,.5)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  '.cm-rt-btn:hover': { color: '#fff', backgroundColor: '#3a3a3a' },
  '.cm-rt-card-thumb': { width: '48px', height: '27px', objectFit: 'cover', borderRadius: '2px' },
  '.cm-rt-wrap-foot': {
    height: '10px',
    border: `1px solid ${BOX_BORDER}`,
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    backgroundColor: BOX_FILL,
    cursor: 'pointer',
  },
  '.cm-rt-image-thumb': {
    width: '56px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '2px',
    backgroundColor: '#1a1a1a',
  },
  '.cm-rt-image .cm-rt-card-summary': { display: 'flex', flexDirection: 'column' },
  '.cm-rt-image-src': { fontFamily: MONO, fontSize: '11px', color: 'rgba(255,255,255,.4)' },
  '.cm-rt-chip': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '0 6px 0 2px',
    margin: '0 1px',
    border: '1px solid rgba(213,127,67,.4)',
    borderRadius: '3px',
    fontSize: '.85em',
    lineHeight: '1.5',
    verticalAlign: '1px',
    color: 'rgba(255,255,255,.85)',
    cursor: 'pointer',
  },
  '.cm-rt-chip .cm-rt-btn': { width: '20px', height: '20px', margin: '0 -4px 0 -2px' },
  // Segmented chip (toggles, Wowhead links): tinted type segment, name, muted id
  '.cm-rt-chip.cm-rt-seg': {
    alignItems: 'stretch',
    gap: '0',
    padding: '0',
    overflow: 'hidden',
    border: '1px solid #4a4a4a',
    backgroundColor: '#2a2a2a',
    // The chip opens its form, but reads as a label rather than a control
    cursor: 'default',
  },
  '.cm-rt-seg-type': {
    display: 'flex',
    alignItems: 'center',
    padding: '0 6px',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '.04em',
    textTransform: 'uppercase',
    color: 'var(--rt-hue, #ffb86c)',
    backgroundColor: 'color-mix(in srgb, var(--rt-hue, #d57f43) 16%, transparent)',
  },
  '.cm-rt-seg-name': { padding: '0 7px', color: '#fff', fontWeight: '600' },
  '.cm-rt-seg-detail': {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '7px',
    fontFamily: MONO,
    fontSize: '11.5px',
    color: 'rgba(255,255,255,.45)',
  },
  '.cm-rt-seg .cm-rt-btn': { height: 'auto', margin: '0 2px 0 -4px' },
  '.cm-rt-seg-icon': { padding: '0 6px' },
  '.cm-rt-seg-icon svg': { display: 'block' },
  '.cm-rt-gapcursor': {
    position: 'absolute',
    height: '2px',
    backgroundColor: '#e9e4dc',
    pointerEvents: 'none',
    animation: 'cm-rt-gap-blink 1.2s steps(1) infinite',
  },
  '.cm-scroller.cm-rt-gap .cm-cursorLayer': { display: 'none' },
  '@keyframes cm-rt-gap-blink': { '50%': { opacity: '0' } },
  '.cm-rt-links': {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '1px',
    height: '1px',
    overflow: 'visible',
    pointerEvents: 'none',
  },
  '.cm-rt-image-inline': { height: '1.4em', verticalAlign: 'middle' },
})

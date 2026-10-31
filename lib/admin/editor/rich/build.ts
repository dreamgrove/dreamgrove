import { Decoration, type DecorationSet, type WidgetType } from '@codemirror/view'
import type { EditorState, Range } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { IterMode, type SyntaxNode } from '@lezer/common'
import { formFromTag } from '../blocks/form'
import { blockDetail, blockFields, summarizeBlock } from '../blocks/summary'
import { findAllTags } from '../blocks/tags'
import { HERO_BOX, HERO_COLORS, lineStyle, type LineKind } from './boxes'
import { BLOCK_HUES, CALLOUTS, classColor, colorFor } from './colors'
import { CONDITION_PREFIX, CONDITION_RE, condHtml, setToggleNames, toggleId } from './conditions'
import { firstClass, scanHtml, type HtmlPair, type HtmlToken } from './html'
import { spellName, timelineSteps } from './spellNames'
import type { Span } from '../caretRange'
import { foldField } from './state'
import type { HandlersRef } from './types'
import { CardWidget, type CardSpec } from './widgets/CardWidget'
import { ImageWidget } from './widgets/ImageWidget'
import {
  CalloutHeadWidget,
  CondWidget,
  PillWidget,
  RuleWidget,
  TagLineWidget,
} from './widgets/simple'
import { SourceWidget } from './widgets/SourceWidget'
import { TableWidget } from './table/TableWidget'

// --- Decorations ---------------------------------------------------------------

export interface Built {
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

export function build(state: EditorState, revealed: Span, h: HandlersRef): Built {
  const doc = state.doc
  const text = doc.toString()
  const folds = state.field(foldField, false) ?? []

  type Rep = { from: number; to: number; deco: Decoration; lead?: boolean }
  const reps: Rep[] = []
  const others: Range<Decoration>[] = []
  const covered: [number, number][] = []
  const code: [number, number][] = []
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
  const toggleNames = new Map<string, string>()
  for (const tag of tags) {
    if (tag.block.id !== 'checkbox') continue
    const { values } = formFromTag(tag)
    const name = String(values.name ?? '').trim() || spellName(String(values.spellId ?? '').trim())
    const id = toggleId(tag)
    if (id && name && !toggleNames.has(id)) toggleNames.set(id, name)
  }
  setToggleNames(toggleNames)
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
  // parsed as markdown but we style them anyway
  for (const m of text.matchAll(/^(#{1,6}) +\S.*$/gm)) {
    const from = m.index ?? 0
    if (headingLines.has(from) || blocked(from, from + m[0].length)) continue
    lineClass(from, `cm-rt-h${m[1].length}`)
    replace(from, from + m[1].length + 1, HIDE, true)
  }

  // block widgets learn their depth, lines get borders and fills
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

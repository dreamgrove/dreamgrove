import { Decoration } from '@codemirror/view'
import { IterMode, type SyntaxNode, type Tree } from '@lezer/common'
import { HIDE, type BuildContext } from '../context'
import type { LineKind } from '../boxes'
import { CALLOUTS } from '../colors'
import { ImageWidget } from '../widgets/ImageWidget'
import { CalloutHeadWidget, PillWidget, RuleWidget } from '../widgets/simple'
import { TableWidget } from '../table/TableWidget'
import { CALLOUT_RE } from '../marks'

/** Markdown from the syntax tree, plus headings the parser leaves inside HTML blocks. */
export function markdown(ctx: BuildContext, tree: Tree, htmlRaw: [number, number][]) {
  const {
    doc,
    text,
    h,
    covered,
    code,
    lineKinds,
    overlaps,
    isRevealed,
    blocked,
    replace,
    widget,
    mark,
    lineClass,
    eachLine,
    lineSpan,
  } = ctx
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
}

import type { BuildContext } from '../context'
import { classColor } from '../colors'
import { CONDITION_PREFIX, CONDITION_RE, condHtml } from '../conditions'
import { firstClass, type HtmlPair, type HtmlToken } from '../html'
import { CardWidget, type CardSpec } from '../widgets/CardWidget'
import { PillWidget, TagLineWidget } from '../widgets/simple'
import { MARK_CLASS } from '../marks'

/** HTML inside paragraphs: conditional divs, colour swatches, tag pills and marks. */
export function inlineHtml(ctx: BuildContext, tokens: HtmlToken[], pairs: HtmlPair[]) {
  const { doc, text, h, folds, covered, boxes, wrapper, blocked, replace, widget, mark, lineSpan } =
    ctx
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
}

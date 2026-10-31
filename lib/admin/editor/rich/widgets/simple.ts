import type { EditorView } from '@codemirror/view'
import { frameDom } from '../boxes'
import { condChip, condHtml } from '../conditions'
import { el } from '../dom'
import type { HandlersRef } from '../types'
import { SourceWidget } from './SourceWidget'

/** Small inline label; clicking reveals its source unless `passive`. */
export class PillWidget extends SourceWidget {
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

/** A tag that sits on its own line */
export class TagLineWidget extends SourceWidget {
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
export class CalloutHeadWidget extends SourceWidget {
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

export class RuleWidget extends SourceWidget {
  get estimatedHeight() {
    return 25
  }
  toDOM() {
    return frameDom(this.stack, el('div', 'cm-rt-hr'), 12, 12)
  }
}

export class CondWidget extends SourceWidget {
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

import { WidgetType, type EditorView } from '@codemirror/view'
import { reveal } from '../state'

/** Base for widgets standing in for a slice of source text (`raw`). */
export abstract class SourceWidget extends WidgetType {
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

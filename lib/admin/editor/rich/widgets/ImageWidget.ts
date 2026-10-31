import type { EditorView } from '@codemirror/view'
import { frameDom } from '../boxes'
import { BLOCK_HUES } from '../colors'
import { actionButton, el } from '../dom'
import { removeRange } from '../editing'
import type { HandlersRef } from '../types'
import { SourceWidget } from './SourceWidget'

export class ImageWidget extends SourceWidget {
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
        actionButton('editThin', 'Edit image', () => edit(view.posAtDOM(box))),
        actionButton('closeThin', 'Remove image', () => {
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

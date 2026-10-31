import type { EditorView } from '@codemirror/view'
import type { BlockField } from '../../blocks/summary'
import { frameDom } from '../boxes'
import { condChip } from '../conditions'
import { actionButton, el, toggleIcon } from '../dom'
import { removeRange, unwrap } from '../editing'
import { reveal, toggleFold, toggleLink } from '../state'
import type { HandlersRef } from '../types'
import { SourceWidget } from './SourceWidget'

export interface CardSpec {
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

export class CardWidget extends SourceWidget {
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
        const eye = actionButton('eyeThin', 'Show the conditions using this toggle', () =>
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
    // a section header is just the row, unless its fields and content caption go under it
    const row = stacked ? el('div', 'cm-rt-card-head') : box
    if (kind === 'header' && this.spec.foldable) {
      const folded = !!this.spec.folded
      if (folded) box.classList.add('cm-rt-folded')
      row.append(
        actionButton('chevronDownThin', folded ? 'Expand section' : 'Collapse section', () =>
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
        actionButton('externalThin', href.title, () => window.open(href.url, '_blank', 'noopener'))
      )
    }
    if (editable)
      actions.append(actionButton('editThin', `Edit ${label.toLowerCase()}`, () => edit(at())))
    if (kind === 'card') {
      actions.append(
        actionButton('closeThin', `Remove ${label.toLowerCase()}`, () => {
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

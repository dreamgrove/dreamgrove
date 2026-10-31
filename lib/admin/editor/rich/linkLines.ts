import { BlockType, ViewPlugin, type EditorView, type ViewUpdate } from '@codemirror/view'
import { findAllTags } from '../blocks/tags'
import { TEXT_COLORS } from '@/lib/admin/palette'
import { GUTTER } from './boxes'
import { conditionIds, toggleId } from './conditions'
import { linkField } from './state'

// --- Toggle link lines ----------------------------------------------------------
//
// With a toggle's eye on, a line runs down the left gutter from the toggle to
// every condition referencing its id. A condition hidden in a folded section
// points at the vertical middle of that section instead.

const { blue, purple, green, yellow, red, orange } = TEXT_COLORS
const LINK_COLORS = [blue, purple, green, yellow, red, orange]

type LinkDrawing = { active: readonly string[]; paths: string }

export const linkLines = ViewPlugin.fromClass(
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

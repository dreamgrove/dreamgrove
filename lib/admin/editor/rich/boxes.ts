import { el } from './dom'

// --- Section boxes ------------------------------------------------------------
//
// Wrapping components render as a bordered box: a header card, content lines
// drawn with side borders, and a closing edge. Nested boxes step in by INDENT.
// Lines can't contain real boxes, so borders and fills are background layers.

export const GUTTER = 28
const INDENT = 14
export const BOX_BORDER = '#3a3a3a'
export const BOX_FILL = 'rgba(255,255,255,0.025)'

const layer = (color: string, pos: string, size: string) =>
  `linear-gradient(${color},${color}) ${pos}/${size} no-repeat`

/** Left edge of content at nesting `depth` */
const inset = (depth: number) => GUTTER + depth * INDENT

export const HERO_COLORS: Record<string, string> = {
  kotg: '#2d6b2d',
  ec: '#4b62be',
  dotc: '#c41e3a',
  generic: '#d57f43',
}
export const HERO_BOX: Record<string, string> = { kotg: 'k', ec: 'e', dotc: 'd', generic: 'g' }
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

  for (let i = stack.length - 1; i >= 0; i--) {
    const x = inset(i)
    const tint = BOX_TINTS[stack[i]]
    const fill = tint ? `color-mix(in srgb, ${tint} 6%, transparent)` : BOX_FILL
    layers.push(layer(fill, `${x}px 0`, `calc(100% - ${2 * x}px) 100%`))
  }
  return layers
}

/** Wraps a block widget so it sits inside its enclosing boxes */
export function frameDom(stack: string, inner: HTMLElement, top = 0, bottom = 0) {
  const frame = el('div', 'cm-rt-frame')
  const x = inset(stack.length)
  frame.style.padding = `${top}px ${x}px ${bottom}px`
  const layers = boxLayers(stack)
  if (layers.length) frame.style.background = layers.join(',')
  frame.append(inner)
  return frame
}

export type LineKind = { kind: 'callout' | 'quote' | 'code'; color?: string }

export function lineStyle(stack: string, kind?: LineKind, top = 0, bottom = 0): string {
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

import { Decoration, type WidgetType } from '@codemirror/view'
import type { EditorState, Range } from '@codemirror/state'
import type { Span } from '../caretRange'
import { CONDITION_PREFIX } from './conditions'
import { foldField } from './state'
import type { HandlersRef } from './types'
import type { LineKind } from './boxes'

export const HIDE = Decoration.replace({})

/**
 * What every pass of build() reads and writes: the document, the decorations
 * collected so far, and helpers that respect the caret's revealed range and
 * the ranges already taken by code or earlier widgets.
 */
export function createContext(state: EditorState, text: string, revealed: Span, h: HandlersRef) {
  const doc = state.doc
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
    for (let pos = from; pos <= to;) {
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

  return {
    state,
    doc,
    text,
    h,
    folds,
    reps,
    others,
    covered,
    code,
    boxes,
    lineKinds,
    wrappers,
    wrapper,
    overlaps,
    isRevealed,
    blocked,
    replace,
    widget,
    mark,
    lineClass,
    eachLine,
    lineSpan,
    blockSpan,
  }
}

export type BuildContext = ReturnType<typeof createContext>

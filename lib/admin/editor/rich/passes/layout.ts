import { Decoration } from '@codemirror/view'
import type { BuildContext } from '../context'
import { lineStyle } from '../boxes'
import { SourceWidget } from '../widgets/SourceWidget'

/** Block widgets learn their nesting depth; lines inside boxes get borders and fills. */
export function layout(ctx: BuildContext, htmlEdges: [number, number][]) {
  const { doc, reps, others, boxes, lineKinds, eachLine } = ctx
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
}

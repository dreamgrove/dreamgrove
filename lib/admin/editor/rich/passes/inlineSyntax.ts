import type { BuildContext } from '../context'
import { colorFor } from '../colors'
import { CondWidget } from '../widgets/simple'

/** The site's own inline syntax: `:color[text]` and `[*id]` conditions. */
export function inlineSyntax(ctx: BuildContext) {
  const { text, blocked, replace, widget, mark } = ctx
  // Same pattern as plugins/remarkColor.js, which also matches mid-word
  for (const m of text.matchAll(/:([a-zA-Z]+|#[0-9a-fA-F]{3,8})\[([^\]]+)\]/g)) {
    const from = m.index ?? 0
    const to = from + m[0].length
    const name = m[1].toLowerCase()
    const color = colorFor(name)
    if (blocked(from, to)) continue
    const open = from + m[1].length + 2
    replace(from, open)
    replace(to - 1, to)
    mark(open, to - 1, 'cm-rt-colored', color)
  }
  for (const m of text.matchAll(/\[\*([^\]\n]+)\]/g)) {
    const from = m.index ?? 0
    const to = from + m[0].length
    if (blocked(from, to)) continue
    widget(from, to, new CondWidget(m[0], m[1]))
  }
}

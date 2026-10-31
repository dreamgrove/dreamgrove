/** Classes in a tag's `className`/`class` attribute */
export function classNames(attrs: string): string[] {
  const cls = /className=["']([^"']*)["']|class=["']([^"']*)["']/.exec(attrs)
  return cls ? (cls[1] ?? cls[2]).trim().split(/\s+/).filter(Boolean) : []
}

export const firstClass = (attrs: string) => classNames(attrs)[0] ?? ''

// --- Inline HTML scan ----------------------------------------------------------

export interface HtmlToken {
  from: number
  to: number
  name: string
  closing: boolean
  selfClosing: boolean
  attrs: string
}

export interface HtmlPair {
  open: HtmlToken
  close: HtmlToken
}

// Lowercase tags only; components are capitalised and handled by mdxBlocks
const HTML_RE =
  /<(\/?)([a-z][a-z0-9]*)(?=[\s/>])((?:[^<>"'{}]|"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^{}]*\})*\})*?)(\/?)>/g

export const VOID_TAGS = new Set(['br', 'img', 'hr', 'input', 'wbr', 'source'])

export function scanHtml(text: string, skip: (from: number, to: number) => boolean) {
  const tokens: HtmlToken[] = []
  const pairs: HtmlPair[] = []
  const stack: HtmlToken[] = []
  for (const m of text.matchAll(HTML_RE)) {
    const from = m.index ?? 0
    const to = from + m[0].length
    if (skip(from, to)) continue
    const tok: HtmlToken = {
      from,
      to,
      name: m[2],
      closing: !!m[1],
      selfClosing: !!m[4] || VOID_TAGS.has(m[2]),
      attrs: m[3] ?? '',
    }
    tokens.push(tok)
    if (tok.selfClosing) continue
    if (!tok.closing) {
      stack.push(tok)
      continue
    }
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].name === tok.name) {
        pairs.push({ open: stack[i], close: tok })
        stack.length = i
        break
      }
    }
  }
  return { tokens, pairs }
}

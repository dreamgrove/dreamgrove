import type { EditorView } from '@codemirror/view'

// Keeps the editor and the preview roughly scrolled together.
//
// The two panes have unrelated heights: the editor shows raw source while the
// preview renders collapsibles, talent trees, etc. whose height has nothing to
// do with their source length, so a plain scrollTop ratio drifts badly.
// Instead we anchor on markdown headings and <Collapsible> titles, pairing them
// by text in source order, so something that doesn't render is skipped rather
// than shifting everything after it. Between two matched anchors we
// interpolate linearly, so any drift is bounded to a single section. With no
// matched anchors it degrades to the whole-pane ratio.

export interface Anchors {
  editor: number[]
  preview: number[]
}

const normHeading = (text: string) =>
  text
    .replace(/^\s{0,3}#{1,6}\s+/, '')
    .replace(/[#*`_~]/g, '')
    .trim()
    .toLowerCase()

// A preview heading inside a collapsed <Collapsible> is clipped to zero height
// (grid-rows-[0fr] + overflow-hidden) rather than unmounted, so it still
// reports a bogus getBoundingClientRect. Those bogus tops run past the next
// visible anchor and would make the anchor list non-monotonic (which inverts
// the mapping).
function isClipped(node: HTMLElement, root: HTMLElement) {
  for (let p = node.parentElement; p && p !== root; p = p.parentElement) {
    if (p.offsetHeight === 0) return true
  }
  return false
}

/**
 * Scroll offsets (in each pane's own scroll space) of landmarks that appear in
 * BOTH panes: markdown headings and <Collapsible> titles.
 */
export function buildAnchors(view: EditorView, previewEl: HTMLElement): Anchors {
  const doc = view.state.doc
  const editorHeads: { top: number; text: string }[] = []
  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i)
    const collapsible = line.text.match(/<Collapsible\s+title\s*=\s*["']([^"']*)["']/)
    if (collapsible) {
      editorHeads.push({ top: view.lineBlockAt(line.from).top, text: normHeading(collapsible[1]) })
    } else if (/^\s{0,3}#{1,6}\s/.test(line.text)) {
      editorHeads.push({ top: view.lineBlockAt(line.from).top, text: normHeading(line.text) })
    }
  }

  const previewBase = previewEl.getBoundingClientRect().top - previewEl.scrollTop
  const previewHeads: { top: number; text: string }[] = []
  previewEl.querySelectorAll('h1,h2,h3,h4,h5,h6,[data-collapsible-title]').forEach((el) => {
    const node = el as HTMLElement
    if (isClipped(node, previewEl)) return // inside a collapsed section
    previewHeads.push({
      top: node.getBoundingClientRect().top - previewBase,
      text: normHeading(node.textContent || ''),
    })
  })

  // Match forward-only, and never accept an anchor that isn't strictly below
  // the previous one in either pane, so both arrays stay monotonic.
  const editor: number[] = []
  const preview: number[] = []
  let p = 0
  let lastE = -Infinity
  let lastP = -Infinity
  for (const eh of editorHeads) {
    if (!eh.text || eh.top <= lastE) continue
    for (let k = p; k < previewHeads.length; k++) {
      if (previewHeads[k].text !== eh.text) continue
      if (previewHeads[k].top > lastP) {
        editor.push(eh.top)
        preview.push(previewHeads[k].top)
        lastE = eh.top
        lastP = previewHeads[k].top
      }
      p = k + 1
      break
    }
  }
  return { editor, preview }
}

/**
 * Maps a scroll offset from one pane to the other through the anchor pairs,
 * padding with the pane edges (0 and max) so positions before the first and
 * after the last heading still interpolate sensibly.
 */
export function mapScroll(
  value: number,
  from: number[],
  fromMax: number,
  to: number[],
  toMax: number
) {
  if (from.length === 0 || fromMax <= 0 || toMax <= 0) {
    return fromMax > 0 ? (value / fromMax) * toMax : 0
  }
  // Clamp every anchor into [0, max] since a landmark near the bottom can
  // report a top past the scrollable range, which would otherwise make a
  // segment run backwards.
  const fromPts = [0]
  const toPts = [0]
  for (let i = 0; i < from.length; i++) {
    const f = Math.max(0, Math.min(from[i], fromMax))
    const t = Math.max(0, Math.min(to[i], toMax))
    if (f <= fromPts[fromPts.length - 1] || t <= toPts[toPts.length - 1]) continue
    fromPts.push(f)
    toPts.push(t)
  }
  fromPts.push(fromMax)
  toPts.push(toMax)
  let i = 0
  while (i < fromPts.length - 2 && value >= fromPts[i + 1]) i++
  const f0 = fromPts[i]
  const f1 = fromPts[i + 1]
  const frac = f1 > f0 ? (value - f0) / (f1 - f0) : 0
  return toPts[i] + frac * (toPts[i + 1] - toPts[i])
}

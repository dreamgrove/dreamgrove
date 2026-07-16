import { EditorView, Decoration, DecorationSet } from '@codemirror/view'
import { StateField, Range, Text } from '@codemirror/state'

// Visual grouping for the two paired, nestable section components used in the
// docs — <Collapsible title="…">…</Collapsible> and
// <HeroTalentsHeader …>…</HeroTalentsHeader>. Because their content can run for
// dozens of lines (and they nest), it's otherwise hard to tell which lines
// belong to which section while editing.
//
// Every line that sits inside a section gets:
//   - one thin vertical rail per nesting level, drawn to the left and inset by
//     depth so nesting is visible as a staircase of colored bars;
//   - a faint full-line wash in the innermost section's color, so a whole
//     section reads as one contiguous block (opening/closing tag lines get a
//     slightly stronger wash to mark the boundaries).
// It's purely rendering — the underlying text/whitespace is untouched.

// Rail + wash colors cycle by nesting depth. Tuned for the dark darcula editor.
const PALETTE = [
  { rail: '#d57f43', tint: 'rgba(213,127,67,0.07)', edge: 'rgba(213,127,67,0.16)' },
  { rail: '#5b9bd5', tint: 'rgba(91,155,213,0.07)', edge: 'rgba(91,155,213,0.16)' },
  { rail: '#69b06a', tint: 'rgba(105,176,106,0.07)', edge: 'rgba(105,176,106,0.16)' },
  { rail: '#b57edc', tint: 'rgba(181,126,220,0.08)', edge: 'rgba(181,126,220,0.18)' },
]

const X0 = 4 // x of the first rail (px)
const STEP = 7 // horizontal spacing between nested rails (px)
const WIDTH = 2 // rail thickness (px)

const OPEN_RE = /<(Collapsible|HeroTalentsHeader)\b/
const CLOSE_RE = /^\s*<\/(Collapsible|HeroTalentsHeader)\s*>/
const SELF_CLOSE_TAIL = /\/>\s*$/

// Inline style for a line sitting inside `depth` nested sections (depth >= 1).
// `boundary` = the line is an opening or closing tag (stronger wash).
function lineStyle(depth: number, boundary: boolean): string {
  const layers: string[] = []
  // Rails, outermost first, each a thin vertical bar via a horizontal gradient.
  for (let i = 0; i < depth; i++) {
    const x = X0 + i * STEP
    const c = PALETTE[i % PALETTE.length].rail
    layers.push(
      `linear-gradient(to right, transparent ${x}px, ${c} ${x}px, ${c} ${x + WIDTH}px, transparent ${x + WIDTH}px)`
    )
  }
  // Wash from the innermost section, drawn behind the rails (listed last).
  const inner = PALETTE[(depth - 1) % PALETTE.length]
  const wash = boundary ? inner.edge : inner.tint
  layers.push(`linear-gradient(${wash}, ${wash})`)
  // Indent the text past the rails so they never overlap it; the indent grows
  // with nesting, which itself reinforces the structure.
  const pad = X0 + depth * STEP + 4
  return `background-image:${layers.join(',')};background-repeat:no-repeat;padding-left:${pad}px;`
}

function decorate(depth: number, boundary: boolean, at: number): Range<Decoration> {
  return Decoration.line({ attributes: { style: lineStyle(depth, boundary) } }).range(at)
}

function buildDecorations(doc: Text): DecorationSet {
  const ranges: Range<Decoration>[] = []
  // Stack of open component names, popped LIFO on close. MDX is well-formed, so
  // a closing tag always matches the top; we pop the nearest as a best effort.
  const stack: string[] = []
  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i)
    const text = line.text

    if (CLOSE_RE.test(text)) {
      // The closing tag line still belongs to the section it closes.
      if (stack.length > 0) {
        ranges.push(decorate(stack.length, true, line.from))
        stack.pop()
      }
      continue
    }

    const openM = text.match(OPEN_RE)
    if (openM && !SELF_CLOSE_TAIL.test(text)) {
      stack.push(openM[1])
      ranges.push(decorate(stack.length, true, line.from))
      continue
    }

    if (stack.length > 0) {
      ranges.push(decorate(stack.length, false, line.from))
    }
  }
  return Decoration.set(ranges, true)
}

// Rebuilds on every doc change (documents are a few hundred lines at most);
// non-doc transactions keep the current set.
const sectionGuideField = StateField.define<DecorationSet>({
  create(state) {
    return buildDecorations(state.doc)
  },
  update(deco, tr) {
    if (tr.docChanged) return buildDecorations(tr.state.doc)
    return deco
  },
  provide: (f) => EditorView.decorations.from(f),
})

export const sectionGuideExtension = [sectionGuideField]

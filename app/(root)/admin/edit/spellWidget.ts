import { EditorView, WidgetType, Decoration, DecorationSet } from '@codemirror/view'
import { StateField, StateEffect, Text, Range } from '@codemirror/state'
import spellData from '../../../../spellData.json'

const spellNameToId = spellData as Record<string, string | number>

// Matches both spell syntaxes, mirroring plugins/remarkSpell.js:
//   !<id>|<name>!   (explicit id, e.g. the picker's output)
//   !<name>!        (id resolved from spellData.json by name)
// Names are single-line and can't contain "!".
const SPELL_RE = /!(\d+)\|([^!\n]+)!|!([^!\n]+)!/g

type EditRange = { from: number; to: number } | null

function rangesEqual(a: EditRange, b: EditRange) {
  if (a === b) return true
  if (!a || !b) return false
  return a.from === b.from && a.to === b.to
}

// Marks the token range the user is currently editing (raw text shown, not
// widgetized). Set when a token is clicked; cleared automatically when the
// caret leaves the range.
const setEditing = StateEffect.define<EditRange>()

const editingField = StateField.define<EditRange>({
  create() {
    return null
  },
  update(value, tr) {
    for (const e of tr.effects) if (e.is(setEditing)) value = e.value
    // Keep the range covering the token as its text is edited.
    if (value && tr.docChanged) {
      value = {
        from: tr.changes.mapPos(value.from, -1),
        to: tr.changes.mapPos(value.to, 1),
      }
    }
    // Re-widgetize once the caret moves outside the token being edited.
    if (value && tr.selection) {
      const head = tr.selection.main.head
      if (head < value.from || head > value.to) value = null
    }
    return value
  },
})

// Renders a spell token as an inline, atomic element: the name in bold orange
// with a thin border, wrapped in a Wowhead link (when an id is known) so
// hovering shows the native tooltip. The link is non-navigable — its href only
// exists so wow.zamimg.com/js/tooltips.js attaches its tooltip via document-level
// delegation; the global whTooltips config (public/static/scripts/tooltip.js)
// suppresses Wowhead's own icon. Clicking the token "dissolves" it: the raw
// `!id|name!` text is revealed for manual editing until the caret leaves it.
class SpellWidget extends WidgetType {
  constructor(
    readonly name: string,
    readonly id: string | null,
    readonly raw: string
  ) {
    super()
  }

  eq(other: SpellWidget) {
    return other.raw === this.raw
  }

  toDOM(view: EditorView) {
    const el = document.createElement(this.id ? 'a' : 'span')
    el.className = 'cm-spell-token'
    el.textContent = this.name
    if (this.id) {
      const a = el as HTMLAnchorElement
      a.href = `https://www.wowhead.com/spell=${this.id}`
      // Block navigation (mousedown below usually suffices, but be explicit).
      a.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
      })
    }
    el.addEventListener('mousedown', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const from = view.posAtDOM(el)
      const to = from + this.raw.length
      view.dispatch({
        selection: { anchor: Math.max(from, to - 1) },
        effects: setEditing.of({ from, to }),
      })
      view.focus()
    })
    return el
  }

  // Let CodeMirror treat the widget as opaque; our own listeners handle clicks
  // and the Wowhead tooltip binds through document-level event delegation.
  ignoreEvent() {
    return true
  }
}

function buildDecorations(doc: Text, editing: EditRange): DecorationSet {
  const text = doc.toString()
  const ranges: Range<Decoration>[] = []
  SPELL_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = SPELL_RE.exec(text)) !== null) {
    // Alternation: groups 1/2 are the id|name form; group 3 is the id-less name.
    const name = m[2] ?? m[3]
    const explicitId = m[1] ?? null
    const resolved =
      explicitId ?? (spellNameToId[name] != null ? String(spellNameToId[name]) : null)
    const from = m.index
    const to = from + m[0].length
    // Skip the token the user is editing so its raw text stays visible/editable.
    if (editing && from < editing.to && to > editing.from) continue
    ranges.push(
      Decoration.replace({
        widget: new SpellWidget(name, resolved, m[0]),
      }).range(from, to)
    )
  }
  return Decoration.set(ranges, true)
}

// StateField holding the spell-token decorations. It provides both the
// decorations (so they render) and atomic ranges built from the same spans, so
// each token behaves as a single unit: the caret skips over it, selecting snaps
// to the whole token, and Backspace/Delete removes it. The token currently being
// edited is excluded from both, so it reads and edits as ordinary text.
const spellTokenField = StateField.define<DecorationSet>({
  create(state) {
    return buildDecorations(state.doc, null)
  },
  update(deco, tr) {
    const prev = tr.startState.field(editingField, false) ?? null
    const cur = tr.state.field(editingField, false) ?? null
    if (tr.docChanged || !rangesEqual(prev, cur)) {
      return buildDecorations(tr.state.doc, cur)
    }
    return deco.map(tr.changes)
  },
  provide: (f) => [
    EditorView.decorations.from(f),
    EditorView.atomicRanges.of((view) => view.state.field(f, false) ?? Decoration.none),
  ],
})

// editingField must come before spellTokenField so the latter can read it.
export const spellTokenExtension = [editingField, spellTokenField]

import { useMemo, useRef, useState, type RefObject } from 'react'
import { Prec } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import type { Spell } from '@/lib/admin/spells'
import { useLatest } from './useLatest'
import { useSpellSearch } from './useSpellSearch'

export type PickerPosition = { left: number; top: number }

/**
 * Ctrl+Space spell search typed inline in the editor.
 * Returns the editor extension driving it and the picker's props.
 */
export function useInlineSpellSearch(
  viewRef: RefObject<EditorView | null>,
  currentSpec: string | null
) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [position, setPosition] = useState<PickerPosition>({ left: 0, top: 0 })
  const [highlighted, setHighlighted] = useState(0)
  const startRef = useRef<number | null>(null)
  const results = useSpellSearch(query, currentSpec, open)

  const close = () => {
    startRef.current = null
    setOpen(false)
  }

  const update = (view: EditorView) => {
    const start = startRef.current
    if (start == null) return
    const head = view.state.selection.main.head
    const query = view.state.doc.sliceString(start, head)
    // A leading space cancels the search (e.g. hitting space right after Ctrl+Space)
    if (head < start || query.startsWith(' ')) return close()
    const coords = view.coordsAtPos(start)
    if (coords) setPosition({ left: coords.left, top: coords.bottom })
    setQuery(query)
    setHighlighted(0)
    setOpen(true)
  }

  const select = (spell: Spell) => {
    const view = viewRef.current
    const start = startRef.current
    startRef.current = null // end the session before mutating the doc
    if (view && start != null) {
      const head = view.state.selection.main.head
      const insert = `!${spell.id}|${spell.name}!`
      view.dispatch({
        changes: { from: start, to: Math.max(start, head), insert },
        selection: { anchor: start + insert.length },
      })
      view.focus()
    }
    setOpen(false)
  }

  // Read by the (stable) extension at event time, so it always sees this render
  const latest = useLatest({ results, highlighted, close, update, select })

  /** Starts a search from the toolbar */
  const start = () => {
    const view = viewRef.current
    if (!view) return
    const { from, to } = view.state.selection.main
    if (from !== to) view.dispatch({ selection: { anchor: to } })
    startRef.current = from
    update(view)
    view.focus()
  }

  // CodeMirror calls these on key presses and updates, never during render
  /* eslint-disable react-hooks/refs */
  const extension = useMemo(() => {
    const active = () => startRef.current != null
    return [
      Prec.highest(
        keymap.of([
          {
            key: 'Ctrl-Space',
            run: (view) => {
              startRef.current = view.state.selection.main.head
              latest.current.update(view)
              return true
            },
          },
          {
            key: 'ArrowDown',
            run: () => {
              if (!active()) return false
              const last = Math.max(0, latest.current.results.length - 1)
              setHighlighted((h) => Math.min(h + 1, last))
              return true
            },
          },
          {
            key: 'ArrowUp',
            run: () => {
              if (!active()) return false
              setHighlighted((h) => Math.max(0, h - 1))
              return true
            },
          },
          {
            key: 'Enter',
            run: () => {
              if (!active()) return false
              const { results, highlighted, select, close } = latest.current
              const spell = results[highlighted]
              if (spell) select(spell)
              else close()
              return true
            },
          },
          {
            key: 'Escape',
            run: () => {
              if (!active()) return false
              latest.current.close()
              return true
            },
          },
        ])
      ),
      EditorView.updateListener.of((u) => {
        const start = startRef.current
        if (start == null) return
        if (u.docChanged) {
          let touchedBefore = false
          u.changes.iterChangedRanges((fromA) => {
            if (fromA < start) touchedBefore = true
          })
          if (touchedBefore) return latest.current.close()
          startRef.current = u.changes.mapPos(start, -1)
          latest.current.update(u.view)
        } else if (u.selectionSet) {
          latest.current.close()
        }
      }),
    ]
  }, [latest])
  /* eslint-enable react-hooks/refs */

  return {
    extension,
    start,
    picker: {
      open,
      position,
      results,
      highlighted,
      hasQuery: query.trim().length > 0,
      onHover: setHighlighted,
      onSelect: select,
      onClose: close,
    },
  }
}

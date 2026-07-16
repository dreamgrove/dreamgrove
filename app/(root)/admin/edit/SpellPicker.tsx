'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Fuse from 'fuse.js'

export type Spell = {
  id: number
  name: string
  spec: string | null
}

type IndexedSpell = Spell & { idStr: string }

export type PickerPosition = { left: number; top: number }

const MAX_RESULTS = 50

// Palette tuned to sit inside the darcula editor: near-black panel, hairline
// borders, muted metadata, with the token orange reserved as a functional
// accent (active row + on-spec signal).
const C = {
  panel: '#2b2b2b',
  input: '#232323',
  border: '#3c3f41',
  active: '#37393d',
  text: '#d8d8d8',
  dim: '#7c7f83',
  faint: '#6a6d70',
  accent: '#ffb86c',
}

const MONO = 'Consolas, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace'

// Scoped CSS for the bits inline styles can't reach: a slim, muted scrollbar
// (the native one is chunky/ugly) and the placeholder color.
const PICKER_CSS = `
.spell-picker-list { scrollbar-width: thin; scrollbar-color: #55585c transparent; }
.spell-picker-list::-webkit-scrollbar { width: 11px; }
.spell-picker-list::-webkit-scrollbar-track { background: transparent; }
.spell-picker-list::-webkit-scrollbar-thumb {
  background: #4a4d50;
  background-clip: padding-box;
  border: 3px solid #2b2b2b;
}
.spell-picker-list::-webkit-scrollbar-thumb:hover { background: #5c6064; }
.spell-picker input::placeholder { color: #6a6d70; }
`

// icon | name | spec | id — fixed side columns so specs and ids line up in a
// clean vertical rule across every row; the name flexes and truncates.
const ROW_GRID = '16px minmax(0,1fr) 52px 56px'

// Druid spec → its specialization icon on the Wowhead CDN.
const SPEC_ICON: Record<string, string> = {
  Balance: 'spell_nature_starfall',
  Feral: 'ability_druid_catform',
  Guardian: 'ability_racial_bearform',
  Restoration: 'spell_nature_healingtouch',
}

// Specs from a label ("Balance, Feral, Guardian") that have an icon; drops
// "Generic"/unknown so those rows simply show no spec icon.
function specParts(spec: string): string[] {
  return spec
    .split(',')
    .map((s) => s.trim())
    .filter((s) => SPEC_ICON[s])
}

// Module-level cache + in-flight promise so the ~1100-row spell list is fetched
// from /api/spells only once per session, no matter how often the picker opens.
let spellCache: IndexedSpell[] | null = null
let spellPromise: Promise<IndexedSpell[]> | null = null

function loadSpells(): Promise<IndexedSpell[]> {
  if (spellCache) return Promise.resolve(spellCache)
  if (!spellPromise) {
    spellPromise = fetch('/api/spells')
      .then((res) => res.json())
      .then((data) => {
        const spells: Spell[] = data?.spells ?? []
        spellCache = spells.map((s) => ({ ...s, idStr: String(s.id) }))
        return spellCache
      })
      .catch((err) => {
        console.error('Failed to load spells', err)
        spellPromise = null
        return []
      })
  }
  return spellPromise
}

function useSpells(open: boolean) {
  const [spells, setSpells] = useState<IndexedSpell[]>(spellCache ?? [])

  useEffect(() => {
    if (!open || spellCache) return
    let active = true
    loadSpells().then((s) => {
      if (active) setSpells(s)
    })
    return () => {
      active = false
    }
  }, [open])

  const fuse = useMemo(
    () =>
      new Fuse(spells, {
        keys: ['name', 'idStr'],
        threshold: 0.4,
        ignoreLocation: true,
        includeScore: true,
      }),
    [spells]
  )

  return { spells, fuse }
}

export default function SpellPicker({
  open,
  position,
  currentSpec,
  onSelect,
  onClose,
}: {
  open: boolean
  position: PickerPosition
  // Spec of the file being edited (e.g. "Balance"), used to surface spells for
  // that spec when several share a name. Null when the path has no spec folder.
  currentSpec?: string | null
  onSelect: (spell: Spell) => void
  onClose: () => void
}) {
  const { spells, fuse } = useSpells(open)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // A spell is "on-spec" when its (possibly multi-spec) spec label names the
  // current spec, e.g. currentSpec "Balance" matches spec "Balance, Feral,
  // Guardian". Generic/null spells are not treated as on-spec.
  const matchesSpec = useCallback(
    (spell: Spell) => !!currentSpec && !!spell.spec && spell.spec.includes(currentSpec),
    [currentSpec]
  )

  const results = useMemo(() => {
    // Boost applied to a Fuse score (lower = better) for on-spec spells. Small
    // enough that it mainly breaks ties between equally-relevant matches — e.g.
    // two spells with the same name — surfacing the current spec's first.
    const SPEC_BOOST = 0.1

    // Nothing is shown until at least one character is typed.
    if (!query.trim()) return []

    return fuse
      .search(query.trim())
      .sort(
        (a, b) =>
          (a.score ?? 0) -
          (matchesSpec(a.item) ? SPEC_BOOST : 0) -
          ((b.score ?? 0) - (matchesSpec(b.item) ? SPEC_BOOST : 0))
      )
      .slice(0, MAX_RESULTS)
      .map((r) => r.item)
  }, [query, spells, fuse, currentSpec, matchesSpec])

  // Reset transient state each time the picker opens and focus the search box.
  useEffect(() => {
    if (!open) return
    setQuery('')
    setHighlighted(0)
    // Focus after the portal has mounted.
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  // Keep the highlighted index in range and scrolled into view.
  useEffect(() => {
    if (highlighted >= results.length) setHighlighted(results.length ? results.length - 1 : 0)
  }, [results, highlighted])

  useEffect(() => {
    rowRefs.current[highlighted]?.scrollIntoView({ block: 'nearest' })
  }, [highlighted])

  // Close when clicking anywhere outside the picker.
  useEffect(() => {
    if (!open) return
    const onDocMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open, onClose])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlighted((h) => Math.min(h + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlighted((h) => Math.max(h - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const spell = results[highlighted]
        if (spell) onSelect(spell)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    },
    [results, highlighted, onSelect, onClose]
  )

  if (!open || typeof document === 'undefined') return null

  // Clamp within the viewport; flip above the cursor if it would overflow below.
  const width = 360
  const estHeight = 340
  const left = Math.max(8, Math.min(position.left, window.innerWidth - width - 8))
  const flipUp = position.top + estHeight + 24 > window.innerHeight
  const top = flipUp ? undefined : position.top + 4
  const bottom = flipUp ? window.innerHeight - position.top + 4 : undefined

  const hasQuery = query.trim().length > 0

  return createPortal(
    <div
      ref={containerRef}
      className="spell-picker"
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        left,
        top,
        bottom,
        width,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        background: C.panel,
        border: `1px solid ${C.border}`,
        boxShadow: '0 10px 28px rgba(0,0,0,0.5)',
        zIndex: 10000,
        fontFamily: MONO,
        fontSize: 13,
        color: C.text,
      }}
    >
      <style>{PICKER_CSS}</style>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search spell name or id"
        spellCheck={false}
        style={{
          boxSizing: 'border-box',
          width: '100%',
          border: 'none',
          borderBottom: `1px solid ${C.border}`,
          background: C.input,
          color: C.text,
          caretColor: C.accent,
          padding: '9px 12px',
          outline: 'none',
          fontFamily: MONO,
          fontSize: 13,
          letterSpacing: '0.01em',
        }}
      />

      {!hasQuery ? (
        <div style={{ padding: '10px 12px', color: C.faint }}>Type to search spells</div>
      ) : (
        <>
          <div
            ref={listRef}
            className="spell-picker-list"
            style={{ maxHeight: 288, overflowY: 'auto', overflowX: 'hidden' }}
          >
            {results.length === 0 ? (
              <div style={{ padding: '10px 12px', color: C.faint }}>No matching spells</div>
            ) : (
              results.map((spell, i) => {
                const active = i === highlighted
                return (
                  <a
                    key={spell.id}
                    ref={(el) => {
                      rowRefs.current[i] = el
                    }}
                    href={`https://www.wowhead.com/spell=${spell.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      onSelect(spell)
                    }}
                    onMouseEnter={() => setHighlighted(i)}
                    style={{
                      boxSizing: 'border-box',
                      display: 'grid',
                      gridTemplateColumns: ROW_GRID,
                      columnGap: 10,
                      alignItems: 'center',
                      padding: '5px 12px',
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      background: active ? C.active : 'transparent',
                    }}
                  >
                    <img
                      src={`https://cdn.simcode.dev/${spell.id}.jpg`}
                      alt=""
                      width={16}
                      height={16}
                      style={{
                        width: 16,
                        height: 16,
                        display: 'block',
                        border: '1px solid rgba(0,0,0,0.45)',
                      }}
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.visibility = 'hidden'
                      }}
                    />
                    <span
                      style={{
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: active ? '#fff' : C.text,
                      }}
                    >
                      {spell.name}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      {spell.spec &&
                        specParts(spell.spec).map((sp) => (
                          <img
                            key={sp}
                            src={`https://wow.zamimg.com/images/wow/icons/small/${SPEC_ICON[sp]}.jpg`}
                            alt={sp}
                            title={sp}
                            width={14}
                            height={14}
                            style={{
                              width: 14,
                              height: 14,
                              display: 'block',
                              // Ring the current spec's icon to flag on-spec spells.
                              border:
                                sp === currentSpec
                                  ? `1px solid ${C.accent}`
                                  : '1px solid rgba(0,0,0,0.45)',
                            }}
                          />
                        ))}
                    </span>
                    <span
                      style={{
                        textAlign: 'right',
                        color: C.dim,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {spell.id}
                    </span>
                  </a>
                )
              })
            )}
          </div>

          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '5px 12px',
              borderTop: `1px solid ${C.border}`,
              fontSize: 11,
              color: C.faint,
              letterSpacing: '0.02em',
            }}
          >
            <span>{results.length} shown</span>
            <span>↑↓ move · ⏎ insert · esc close</span>
          </div>
        </>
      )}
    </div>,
    document.body
  )
}

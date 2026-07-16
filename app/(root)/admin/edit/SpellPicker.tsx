'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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

// Fuzzy-search the spell list by name or id, with on-spec spells lightly boosted
// so the current file's spec surfaces first among equally-relevant matches.
// Returns [] until a query is typed. `enabled` defers the fetch until first use.
export function useSpellSearch(
  query: string,
  currentSpec: string | null | undefined,
  enabled: boolean
): Spell[] {
  const [spells, setSpells] = useState<IndexedSpell[]>(spellCache ?? [])

  useEffect(() => {
    if (!enabled || spellCache) return
    let active = true
    loadSpells().then((s) => {
      if (active) setSpells(s)
    })
    return () => {
      active = false
    }
  }, [enabled])

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

  return useMemo(() => {
    const q = query.trim()
    if (!q) return []
    const SPEC_BOOST = 0.1
    const onSpec = (s: Spell) => !!currentSpec && !!s.spec && s.spec.includes(currentSpec)
    return fuse
      .search(q)
      .sort(
        (a, b) =>
          (a.score ?? 0) -
          (onSpec(a.item) ? SPEC_BOOST : 0) -
          ((b.score ?? 0) - (onSpec(b.item) ? SPEC_BOOST : 0))
      )
      .slice(0, MAX_RESULTS)
      .map((r) => r.item)
  }, [query, fuse, currentSpec])
}

// Presentational dropdown. The query is typed inline in the editor; this only
// renders the results and reports hover/click. Keyboard navigation (↑↓ ⏎ esc)
// is handled by the editor keymap while a search session is active, so this
// component never takes focus.
export default function SpellPicker({
  open,
  position,
  results,
  highlighted,
  hasQuery,
  currentSpec,
  onHover,
  onSelect,
  onClose,
}: {
  open: boolean
  position: PickerPosition
  results: Spell[]
  highlighted: number
  hasQuery: boolean
  currentSpec?: string | null
  onHover: (index: number) => void
  onSelect: (spell: Spell) => void
  onClose: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // Close when clicking anywhere outside the picker (including in the editor).
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

  // Keep the highlighted row scrolled into view as it moves.
  useEffect(() => {
    rowRefs.current[highlighted]?.scrollIntoView({ block: 'nearest' })
  }, [highlighted])

  if (!open || typeof document === 'undefined') return null

  // Clamp within the viewport; flip above the cursor if it would overflow below.
  const width = 360
  const estHeight = 320
  const left = Math.max(8, Math.min(position.left, window.innerWidth - width - 8))
  const flipUp = position.top + estHeight + 24 > window.innerHeight
  const top = flipUp ? undefined : position.top + 4
  const bottom = flipUp ? window.innerHeight - position.top + 4 : undefined

  return createPortal(
    <div
      ref={containerRef}
      className="spell-picker"
      // Don't steal focus from the editor on click.
      onMouseDown={(e) => e.preventDefault()}
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
                    onMouseEnter={() => onHover(i)}
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

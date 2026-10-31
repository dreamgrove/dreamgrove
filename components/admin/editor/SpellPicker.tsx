'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MONO_FONT } from '@/lib/admin/palette'
import type { Spell } from '@/lib/admin/spells'
import type { PickerPosition } from '@/hooks/admin/useInlineSpellSearch'

const C = {
  panel: '#2b2b2b',
  border: '#3c3f41',
  active: '#37393d',
  text: '#d8d8d8',
  dim: '#7c7f83',
  faint: '#6a6d70',
  accent: '#ffb86c',
}

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

const ROW_GRID = '16px minmax(0,1fr) 52px 56px'

const SPEC_ICON: Record<string, string> = {
  Balance: 'spell_nature_starfall',
  Feral: 'ability_druid_catform',
  Guardian: 'ability_racial_bearform',
  Restoration: 'spell_nature_healingtouch',
}

function specParts(spec: string): string[] {
  return spec
    .split(',')
    .map((s) => s.trim())
    .filter((s) => SPEC_ICON[s])
}

// Presentational dropdown. The query is typed inline in the editor; this only
// renders the results and reports hover/click. Keyboard navigation (<UP><DOWN><ENTER><ESC>)
// is handled by the editor keymap while a search session is active
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
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])

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
        fontFamily: MONO_FONT,
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
                    {/* eslint-disable-next-line @next/next/no-img-element -- tiny CDN icons; next/image would need the hosts in next.config */}
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
                          // eslint-disable-next-line @next/next/no-img-element -- tiny CDN icons; next/image would need the hosts in next.config
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

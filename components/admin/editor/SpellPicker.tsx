'use client'

import { useEffect, useRef } from 'react'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { createPortal } from 'react-dom'
import { MONO_FONT } from '@/lib/admin/palette'
import type { Spell } from '@/lib/admin/spells'
import type { PickerPosition } from '@/hooks/admin/useInlineSpellSearch'

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

  useOutsideClick(containerRef, onClose, open)

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
      className="fixed z-[10000] box-border flex flex-col border border-[#3c3f41] bg-[#2b2b2b] text-[13px] text-[#d8d8d8] shadow-[0_10px_28px_rgba(0,0,0,0.5)]"
      // Don't steal focus from the editor on click.
      onMouseDown={(e) => e.preventDefault()}
      style={{ left, top, bottom, width, fontFamily: MONO_FONT }}
    >
      {!hasQuery ? (
        <div className="px-3 py-2.5 text-[#6a6d70]">Type to search spells</div>
      ) : (
        <>
          <div className="spell-picker-list max-h-72 overflow-x-hidden overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-3 py-2.5 text-[#6a6d70]">No matching spells</div>
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
                    className={`box-border grid cursor-pointer grid-cols-[16px_minmax(0,1fr)_52px_56px] items-center gap-x-2.5 px-3 py-[5px] text-inherit no-underline ${
                      active ? 'bg-[#37393d]' : 'bg-transparent'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- tiny CDN icons; next/image would need the hosts in next.config */}
                    <img
                      src={`https://cdn.simcode.dev/${spell.id}.jpg`}
                      alt=""
                      width={16}
                      height={16}
                      className="block h-4 w-4 border border-black/45"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.visibility = 'hidden'
                      }}
                    />
                    <span
                      className={`min-w-0 truncate ${active ? 'text-white' : 'text-[#d8d8d8]'}`}
                    >
                      {spell.name}
                    </span>
                    <span className="flex items-center justify-end gap-0.5">
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
                            className={`block h-3.5 w-3.5 border ${
                              sp === currentSpec ? 'border-dg-highlight' : 'border-black/45'
                            }`}
                          />
                        ))}
                    </span>
                    <span className="text-right text-[#7c7f83] tabular-nums">{spell.id}</span>
                  </a>
                )
              })
            )}
          </div>

          <div className="box-border flex items-center justify-between border-t border-[#3c3f41] px-3 py-[5px] text-[11px] tracking-[0.02em] text-[#6a6d70]">
            <span>{results.length} shown</span>
            <span>↑↓ move · ⏎ insert · esc close</span>
          </div>
        </>
      )}
    </div>,
    document.body
  )
}

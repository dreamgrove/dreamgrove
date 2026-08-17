'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CiWarning } from 'react-icons/ci'
import { Cast } from '@/models/Cast'
import { SpellInfo, SpellToRender } from '@/types/timeline'
import { simulateLoadout, splitCastsByCharges, SimulatedLoadout } from '@/lib/embed/loadoutTimeline'
import CastBars from '@/components/TimelinePlanner/Cast/CastBars'
import CustomSpellIcon from '@/components/TimelinePlanner/CustomSpell/CustomSpellIcon'
import { CustomSpell, isCustomSpell } from '@/lib/utils/customSpellStorage'

const ROW_H = 40 // h-10, matches the planner's cast rows
const ROW_GAP = 16 // my-2 top+bottom
const HEADER_H = 24 // time label band above the rows
const NAME_COL_W = 160

interface PlannerEmbedCoreProps {
  code: string
  spells: SpellInfo[]
  spellNames: Record<number, React.ReactNode>
  minPixelsPerSecond?: number
  maxPixelsPerSecond?: number
  children?: React.ReactNode
}

function formatTimestamp(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60)
    const remaining = Math.floor(seconds % 60)
    return `${minutes}:${remaining.toString().padStart(2, '0')}`
  }
  return `${seconds}s`
}

function pickMarkerSpacing(pixelsPerSecond: number): number {
  const candidates = [5, 10, 15, 30, 60, 120]
  for (const spacing of candidates) {
    if (spacing * pixelsPerSecond >= 48) return spacing
  }
  return candidates[candidates.length - 1]
}

function rowCount(spell: SpellToRender): number {
  return spell.spell.charges > 1 ? Math.max(spell.chargesUsed, 1) : 1
}

function EmbedFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="planner-embed not-prose my-6 rounded-md border border-gray-700/60 bg-black/20 p-3">
      {children}
    </div>
  )
}

function OpenInPlannerLink({ code }: { code: string }) {
  return (
    <a
      href={`/planner?loadout=${encodeURIComponent(code)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-main text-xs hover:underline"
    >
      Open in planner →
    </a>
  )
}

function EmbedCast({ cast, pixelsPerSecond }: { cast: Cast; pixelsPerSecond: number }) {
  return (
    <div
      className="absolute focus:outline-hidden"
      style={{
        left: `${cast.start_s * pixelsPerSecond}px`,
        width: `${cast.duration_s * pixelsPerSecond}px`,
        zIndex: 10,
      }}
    >
      <div className="relative select-none">
        <div className="flex h-10 items-center">
          {cast.is_interruped && (
            <div
              style={{ left: cast.effect_duration * pixelsPerSecond + 14, bottom: -2 }}
              className="absolute z-20 flex items-center text-[0.75rem] text-yellow-500/80"
            >
              <CiWarning className="text-yellow-500/80" />
              <span className="pl-2">interrupted</span>
            </div>
          )}
          <CastBars cast={cast} pixelsPerSecond={pixelsPerSecond} transitionStyle="" />
        </div>
      </div>
    </div>
  )
}

export default function PlannerEmbedCore({
  code,
  spells,
  spellNames,
  minPixelsPerSecond = 4,
  maxPixelsPerSecond = 16,
  children,
}: PlannerEmbedCoreProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState(0)

  const result = useMemo<{ sim?: SimulatedLoadout; error?: boolean }>(() => {
    try {
      return { sim: simulateLoadout(code, spells) }
    } catch {
      return { error: true }
    }
  }, [code, spells])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTrackWidth(entry.contentRect.width)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [result.error])

  if (result.error || !result.sim) {
    return (
      <EmbedFrame>
        <div className="py-4 text-center text-sm text-red-400/80">
          Invalid planner code — could not display this timeline.
        </div>
      </EmbedFrame>
    )
  }

  const sim = result.sim

  if (sim.spells.length === 0) {
    return (
      <EmbedFrame>
        <div className="py-4 text-center text-sm text-gray-500">This loadout has no casts.</div>
        <div className="flex justify-end">
          <OpenInPlannerLink code={code} />
        </div>
      </EmbedFrame>
    )
  }

  const fitPps = trackWidth > 0 ? trackWidth / sim.timelineLengthS : 0
  const pixelsPerSecond = Math.min(Math.max(fitPps, minPixelsPerSecond), maxPixelsPerSecond)
  const contentWidth = sim.timelineLengthS * pixelsPerSecond
  const measured = trackWidth > 0

  const totalRows = sim.spells.reduce((acc, s) => acc + rowCount(s), 0)
  const rowsHeight = totalRows * (ROW_H + ROW_GAP)

  const markerSpacing = pickMarkerSpacing(pixelsPerSecond)
  const markerPositions: number[] = []
  if (measured) {
    for (let pos = 0; pos <= sim.timelineLengthS; pos += markerSpacing) {
      markerPositions.push(pos)
    }
  }

  return (
    <EmbedFrame>
      <div className="flex flex-row">
        {/* Left: spell names */}
        <div className="shrink-0" style={{ width: NAME_COL_W, minWidth: 100 }}>
          <div style={{ height: HEADER_H }} />
          {sim.spells.map((spellRow) => {
            const isCustom = isCustomSpell(spellRow.spell)
            const extraRows = rowCount(spellRow) - 1
            return (
              <div
                key={`embed-name-${spellRow.spell.spellId}`}
                className="flex w-full flex-col border-r-2 border-orange-500/50"
              >
                <div className="my-2 flex h-10 w-full flex-row items-center justify-end gap-2 truncate pr-2 text-center text-sm">
                  {isCustom && (
                    <CustomSpellIcon
                      spell={spellRow.spell as CustomSpell}
                      size="sm"
                      className="inline-block shrink-0"
                    />
                  )}
                  {spellNames[spellRow.spell.spellId] || spellRow.spell.name}
                  {extraRows > 0 && (
                    <span className="shrink-0 text-[0.7rem] text-orange-300/80">
                      ×{spellRow.chargesUsed}
                    </span>
                  )}
                </div>
                {Array.from({ length: extraRows }).map((_, i) => (
                  <div key={`embed-name-pad-${i}`} className="my-2 h-10 w-full" />
                ))}
              </div>
            )
          })}
        </div>

        {/* Right: timeline track */}
        <div ref={trackRef} className="relative flex-1 overflow-x-auto overflow-y-hidden">
          <div
            className="relative"
            style={{ width: measured ? contentWidth : '100%', height: HEADER_H + rowsHeight }}
          >
            {/* Time markers */}
            {measured && (
              <div className="pointer-events-none absolute inset-0 z-0">
                {markerPositions.map((pos) => (
                  <div
                    key={`embed-marker-${pos}`}
                    className="absolute top-0 h-full"
                    style={{ left: `${pos * pixelsPerSecond}px` }}
                  >
                    <div
                      className="absolute w-px bg-gray-400/30 opacity-40"
                      style={{ top: HEADER_H, bottom: 0 }}
                    />
                    {pos > 0 && (
                      <span className="absolute top-0 -translate-x-1/2 text-xs whitespace-nowrap text-gray-400">
                        {formatTimestamp(pos)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Cast rows */}
            <div className="absolute right-0 left-0" style={{ top: HEADER_H }}>
              {measured &&
                sim.spells.map((spellRow) => {
                  const chargeRows =
                    spellRow.spell.charges > 1
                      ? splitCastsByCharges(spellRow.casts, Math.max(spellRow.chargesUsed, 1))
                      : [spellRow.casts]
                  return (
                    <div key={`embed-row-${spellRow.spell.spellId}`}>
                      {chargeRows.map((casts, chargeIndex) => (
                        <div key={`embed-charge-${chargeIndex}`} className="relative my-2 h-10">
                          {casts.map((cast, i) => (
                            <EmbedCast
                              key={cast.id || `embed-cast-${i}`}
                              cast={cast}
                              pixelsPerSecond={pixelsPerSecond}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 flex flex-row items-center justify-between gap-2 border-t border-gray-700/40 pt-2">
        <div className="min-w-0 text-xs text-gray-400">
          {children}
          {sim.skippedSpellIds.length > 0 && (
            <span className="ml-2 text-yellow-500/70">
              {sim.skippedSpellIds.length} unknown spell
              {sim.skippedSpellIds.length > 1 ? 's' : ''} omitted
            </span>
          )}
        </div>
        <div className="shrink-0">
          <OpenInPlannerLink code={code} />
        </div>
      </div>
    </EmbedFrame>
  )
}

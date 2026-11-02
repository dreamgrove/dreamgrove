import Icon from '@/components/Icon'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { isCustomSpell, CustomSpell } from '@/lib/utils/customSpellStorage'
import { encodeLoadout } from '@/lib/utils/loadoutCode'
import { useTimelineContext } from './TimelineProvider/useTimelineContext'
import { formatTime } from '@/lib/utils/utilityFunctions'

type ExportFormat = 'mrt' | 'loadout'

const EXPORT_OPTIONS: { format: ExportFormat; label: string }[] = [
  { format: 'mrt', label: 'MRT Note' },
  { format: 'loadout', label: 'Loadout String' },
]

export default function MRTExport() {
  const { processedState, currentSpec, activeTalents, inputEvents } = useTimelineContext()
  const timeline = processedState.spells
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Generate MRT note from timeline
  const mrtNote = useMemo(() => {
    // Collect all casts from all spells
    const allCasts = timeline
      .flatMap((spellTimeline) => {
        // For custom spells, use mrtSpellId if available, otherwise use spellId
        const effectiveSpellId =
          isCustomSpell(spellTimeline.spell) && (spellTimeline.spell as CustomSpell).mrtSpellId
            ? (spellTimeline.spell as CustomSpell).mrtSpellId
            : spellTimeline.spell.spellId

        return spellTimeline.casts.map((cast) => ({
          time: cast.start_s,
          spellId: effectiveSpellId,
        }))
      })
      // Sort by cast time
      .sort((a, b) => a.time - b.time)

    // Format as MRT note
    return allCasts
      .map((cast) => {
        return `{time:${formatTime(cast.time)}} - {spell:${cast.spellId}}`
      })
      .join('\n')
  }, [timeline])

  const handleExport = async (format: ExportFormat) => {
    setIsOpen(false)
    try {
      const text =
        format === 'mrt' ? mrtNote : encodeLoadout(currentSpec, activeTalents, inputEvents)
      await navigator.clipboard.writeText(text)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  if (timeline.length === 0) {
    return null
  }

  return (
    <div className="pr-2">
      <div ref={panelRef} className="relative">
        <button
          onClick={() => setIsOpen((p) => !p)}
          id="mrt-export-selector"
          className={`flex min-w-[140px] shrink-0 items-center justify-center gap-1 rounded-sm border border-transparent px-3 py-[5px] text-sm font-medium text-white transition-colors duration-200 focus:ring-0 focus:ring-offset-0 focus:outline-none ${
            copyStatus === 'copied'
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : copyStatus === 'error'
                ? 'bg-red-600 hover:bg-red-700'
                : 'border border-emerald-700/40 bg-emerald-500/30 hover:bg-emerald-500/50'
          }`}
        >
          {copyStatus === 'copied' ? (
            <span className="flex gap-1">
              <Icon name="checkBold" className="h-5 w-5" />
              Copied!
            </span>
          ) : copyStatus === 'error' ? (
            <span className="flex items-center gap-1">
              <Icon name="alert" className="h-4 w-4" />
              Error
            </span>
          ) : (
            <>
              Export as...
              <Icon
                name="chevronDownThin"
                className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </>
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 z-50 mt-1.5 w-40 overflow-hidden rounded border border-neutral-600/60 bg-neutral-900/98 shadow-xl shadow-black/40 backdrop-blur-md">
            {EXPORT_OPTIONS.map((option) => (
              <button
                key={option.format}
                onClick={() => handleExport(option.format)}
                className="group flex w-full items-center border-b border-neutral-800/60 px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-neutral-800/40"
              >
                <span className="text-sm font-medium text-neutral-200 transition-colors group-hover:text-white">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

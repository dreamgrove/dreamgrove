import React, { useState, useMemo } from 'react'
import { isCustomSpell, CustomSpell } from '@/lib/utils/customSpellStorage'
import { useTimelineContext } from './TimelineProvider/useTimelineContext'

export default function MRTExport() {
  const { processedState } = useTimelineContext()
  const timeline = processedState.spells
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

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
        const minutes = Math.floor(cast.time / 60)
        const seconds = Math.floor(cast.time % 60)
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`
        return `{time:${timeStr}} - {spell:${cast.spellId}}`
      })
      .join('\n')
  }, [timeline])

  const handleExportClick = async () => {
    try {
      await navigator.clipboard.writeText(mrtNote)
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
      <div className="">
        <button
          onClick={handleExportClick}
          id="mrt-export-selector"
          className={`min-w-[140px] shrink-0 rounded-sm border border-transparent px-3 py-[5px] text-sm font-medium text-white transition-colors duration-200 focus:ring-0 focus:ring-offset-0 focus:outline-none ${
            copyStatus === 'copied'
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : copyStatus === 'error'
                ? 'bg-red-600 hover:bg-red-700'
                : 'border border-emerald-700/40 bg-emerald-500/30 hover:bg-emerald-500/50'
          }`}
        >
          {copyStatus === 'copied' ? (
            <span className="flex gap-1">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copied!
            </span>
          ) : copyStatus === 'error' ? (
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Error
            </span>
          ) : (
            'Export MRT Note'
          )}
        </button>
      </div>
    </div>
  )
}

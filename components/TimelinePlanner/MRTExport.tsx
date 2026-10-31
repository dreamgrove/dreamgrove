import Icon from '@/components/Icon'
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
              <Icon name="checkBold" className="h-5 w-5" />
              Copied!
            </span>
          ) : copyStatus === 'error' ? (
            <span className="flex items-center gap-1">
              <Icon name="alert" className="h-4 w-4" />
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

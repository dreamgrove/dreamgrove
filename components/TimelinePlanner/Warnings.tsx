import React, { useState, useMemo } from 'react'
import { SpellToRender } from 'lib/types/cd_planner'
import type { Warning } from 'lib/warnings/registerWarnings'
import { registerWarnings } from 'lib/warnings/registerWarnings'
import { useTimeline } from './TimelineContext'
import { isCustomSpell, CustomSpell } from 'lib/utils/customSpellStorage'

export default function Warnings({
  timeline,
  current_spec,
}: {
  timeline: SpellToRender[]
  current_spec: string
}) {
  const { total_length_s } = useTimeline()
  const [isOpen, setIsOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  // Get all warnings from registered warning functions that apply to current spec
  const allWarnings = registerWarnings.flatMap((warningModule) => {
    // Skip if this warning doesn't apply to the current spec
    if (!warningModule.spec.includes(current_spec)) {
      return []
    }

    // Run the warning function and return its results
    return warningModule.warning(timeline, total_length_s)
  })

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

  // Group warnings by spell name
  const groupedWarnings = allWarnings.reduce<Record<string, string[]>>((acc, warning) => {
    if (!acc[warning.spellName]) {
      acc[warning.spellName] = []
    }
    acc[warning.spellName].push(warning.warning)
    return acc
  }, {})

  return (
    <div className={`mt-8 space-y-2 pb-12 pl-2`} id="timeline-warnings-selector">
      <div className="flex items-center justify-between">
        <div
          className="flex cursor-pointer items-center select-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {allWarnings.length > 0 && (
            <>
              <h3 className="text-lg font-semibold">Timeline Warnings</h3>
              <span className="ml-2 text-yellow-500/80">({allWarnings.length})</span>
              <svg
                className={`ml-2 h-5 w-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </>
          )}
        </div>

        {timeline.length > 0 && (
          <button
            onClick={handleExportClick}
            id="mrt-export-selector"
            className={`px-4 py-2 text-sm font-medium text-white transition-colors duration-200 focus:ring-0 focus:ring-offset-0 focus:outline-none ${
              copyStatus === 'copied'
                ? 'bg-green-600 hover:bg-green-700 focus:ring-0'
                : copyStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-0'
                  : 'border-main/55 hover:bg-main/80 border bg-neutral-900/70 focus:ring-0'
            }`}
          >
            {copyStatus === 'copied' ? (
              <span className="flex gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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
        )}
      </div>

      {isOpen && allWarnings.length > 0 && (
        <div className="space-y-2">
          {Object.entries(groupedWarnings).map(([spellName, warnings], index) => (
            <SpellWarningItem key={index} spellName={spellName} warnings={warnings} />
          ))}
        </div>
      )}
    </div>
  )
}

const SpellWarningItem = ({ spellName, warnings }: { spellName: string; warnings: string[] }) => {
  return (
    <div className="rounded border-l-4 border-yellow-500/40 bg-neutral-900/80 p-3 shadow">
      <div className="flex flex-col">
        <div className="text-md font-bold text-yellow-500/80">{spellName}</div>
        <ul className="mt-1 list-disc pl-5">
          {warnings.map((warning, idx) => (
            <li key={idx} className="text-sm text-neutral-300">
              {warning}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

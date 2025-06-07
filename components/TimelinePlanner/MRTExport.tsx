import React, { useState, useMemo } from 'react'
import { SpellToRender } from '../../lib/types/cd_planner'

export default function MRTExport({ timeline }: { timeline: SpellToRender[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  // Generate MRT note from timeline
  const mrtNote = useMemo(() => {
    // Collect all casts from all spells
    const allCasts = timeline
      .flatMap((spellTimeline) =>
        spellTimeline.casts.map((cast) => ({
          time: cast.start_s,
          spellId: spellTimeline.spell.spellId,
        }))
      )
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
    <div className="mt-8 space-y-2 pl-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handleExportClick}
          className={`px-4 py-2 text-sm font-medium text-white transition-colors duration-200 focus:ring-0 focus:ring-offset-0 focus:outline-none ${
            copyStatus === 'copied'
              ? 'bg-green-600 hover:bg-green-700 focus:ring-0'
              : copyStatus === 'error'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-0'
                : 'border-main/55 hover:bg-main/80 border bg-neutral-900/70 focus:ring-0'
          }`}
        >
          {copyStatus === 'copied' ? (
            <span className="flex items-center gap-1">
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
        <div
          className="flex cursor-pointer items-center select-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm text-neutral-400">Show</span>
          <svg
            className={`ml-1 h-4 w-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-2">
          <textarea
            className="focus:border-main/20 w-full rounded border border-neutral-600 bg-neutral-800 p-3 font-mono text-sm text-neutral-200 focus:ring-0 focus:outline-none"
            rows={Math.min(mrtNote.split('\n').length, 15)}
            value={mrtNote}
            readOnly
            placeholder="No casts in timeline"
          />
        </div>
      )}
    </div>
  )
}

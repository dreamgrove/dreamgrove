import React, { useState, useMemo } from 'react'
import { SpellToRender } from 'lib/types/cd_planner'
import type { Warning } from 'lib/warnings/registerWarnings'
import { registerWarnings } from 'lib/warnings/registerWarnings'
import { useTimeline } from './TimelineContext'

export default function Warnings({
  timeline,
  current_spec,
}: {
  timeline: SpellToRender[]
  current_spec: string
}) {
  const { total_length_s } = useTimeline()
  const [isOpen, setIsOpen] = useState(false)

  // Get all warnings from registered warning functions that apply to current spec
  const allWarnings = registerWarnings.flatMap((warningModule) => {
    // Skip if this warning doesn't apply to the current spec
    if (!warningModule.spec.includes(current_spec)) {
      return []
    }

    // Run the warning function and return its results
    return warningModule.warning(timeline, total_length_s)
  })

  // Group warnings by spell name
  const groupedWarnings = allWarnings.reduce<Record<string, string[]>>((acc, warning) => {
    if (!acc[warning.spellName]) {
      acc[warning.spellName] = []
    }
    acc[warning.spellName].push(warning.warning)
    return acc
  }, {})

  return (
    <div className={`space-y-2 pb-12 pl-2`} id="timeline-warnings-selector">
      <div className="mb-0 flex items-center justify-between">
        <div
          className="flex cursor-pointer items-center self-end pl-1 select-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {allWarnings.length > 0 && (
            <>
              <span className="mr-2 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                {allWarnings.length}
              </span>
              <h3 className="text-lg font-semibold">Timeline Warnings</h3>
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
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen && allWarnings.length > 0 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-2 pt-2">
          {Object.entries(groupedWarnings).map(([spellName, warnings], index) => (
            <div
              key={index}
              className={`transform transition-all duration-300 ease-out ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <SpellWarningItem spellName={spellName} warnings={warnings} />
            </div>
          ))}
        </div>
      </div>
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

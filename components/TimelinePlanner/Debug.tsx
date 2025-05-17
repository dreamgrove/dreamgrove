import React from 'react'
import { SpellTimeline, SpellInfo, TimelineToRender, Cast } from '../../lib/types/cd_planner'

interface DebugProps {
  processedTimeline: TimelineToRender
  timelineSettings: {
    totalLength: number
    timelineWidth: number
    markerSpacing: number
  }
  warnings: WarningInfo[]
  showDebug: boolean
  toggleDebug: () => void
}

interface WarningInfo {
  id: string
  castId: string
  type: string
  message: string
}

/**
 * Debug: A collapsible panel showing debug information about the timeline and casts
 */
export default function Debug({
  processedTimeline,
  timelineSettings,
  warnings = [],
  showDebug = false,
  toggleDebug,
}: DebugProps) {
  const totalCasts = processedTimeline.spells.reduce((acc, spell) => acc + spell.casts.length, 0)

  const totalChargeIntervals = processedTimeline.spells.reduce(
    (acc, spell) => acc + (spell.chargeIntervals?.length || 0),
    0
  )

  return (
    <div className="mt-4 rounded-lg bg-gray-800 p-4 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Debug Panel</h3>
        <button
          onClick={toggleDebug}
          className="rounded bg-blue-600 px-2 py-1 text-sm text-white transition hover:bg-blue-700"
        >
          {showDebug ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <div className="mt-2 text-sm">
        <span className="mr-4">
          Timeline Length: <strong>{timelineSettings.totalLength}s</strong>
        </span>
        <span className="mr-4">
          Timeline Width: <strong>{Math.round(timelineSettings.timelineWidth)}px</strong>
        </span>
        <span className="mr-4">
          Marker Spacing: <strong>{timelineSettings.markerSpacing}s</strong>
        </span>
        <span className="mr-4">
          Total Casts: <strong>{totalCasts}</strong>
        </span>
        <span>
          Charge Events: <strong>{totalChargeIntervals}</strong>
        </span>
        {warnings.length > 0 && (
          <span className="ml-4 rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-black">
            {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Collapsible details */}
      {showDebug && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="mb-2 font-medium">Cast Details</h4>
            <table className="min-w-full divide-y divide-gray-600 overflow-hidden rounded-lg bg-gray-700 text-sm">
              <thead className="bg-gray-600">
                <tr>
                  <th className="pb-2 pr-4">Spell</th>
                  <th className="pb-2 pr-4">Start</th>
                  <th className="pb-2 pr-4">End</th>
                  <th className="pb-2 pr-4">Duration</th>
                  <th className="pb-2 pr-4">Channel</th>
                  <th className="pb-2 pr-4">Effect</th>
                  <th className="pb-2">Cooldown</th>
                </tr>
              </thead>
              <tbody>
                {processedTimeline.spells.flatMap((spellInfo) =>
                  spellInfo.casts.map((cast) => (
                    <tr key={cast.id} className="border-b border-gray-600">
                      <td className="py-2 pr-4">{spellInfo.spell.name}</td>
                      <td className="py-2 pr-4">{cast.start_s.toFixed(1)}s</td>
                      <td className="py-2 pr-4">{cast.end_s.toFixed(1)}s</td>
                      <td className="py-2 pr-4">{(cast.end_s - cast.start_s).toFixed(1)}s</td>
                      <td className="py-2 pr-4">{cast.channel_duration.toFixed(1)}s</td>
                      <td className="py-2 pr-4">{cast.effect_duration.toFixed(1)}s</td>
                      <td className="py-2">{cast.cooldown_duration.toFixed(1)}s</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Charge Intervals Section */}
          {totalChargeIntervals > 0 && (
            <div>
              <h4 className="mb-2 font-medium">Charge Details</h4>
              <table className="min-w-full divide-y divide-gray-600 overflow-hidden rounded-lg bg-gray-700 text-sm">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="pb-2 pr-4">Spell</th>
                    <th className="pb-2 pr-4">Time</th>
                    <th className="pb-2">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {processedTimeline.spells
                    .filter(
                      (spellInfo) =>
                        spellInfo.chargeIntervals && spellInfo.chargeIntervals.length > 0
                    )
                    .flatMap((spellInfo) =>
                      (spellInfo.chargeIntervals || []).map((interval, idx) => (
                        <tr
                          key={`${spellInfo.spell.id}-charge-${idx}`}
                          className="border-b border-gray-600"
                        >
                          <td className="py-2 pr-4">{spellInfo.spell.name}</td>
                          <td className="py-2 pr-4">{interval.instant.toFixed(1)}s</td>
                          <td
                            className={`py-2 ${interval.change > 0 ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {interval.change > 0 ? '+' : ''}
                            {interval.change}
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Warnings List */}
      {warnings.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium">Warning Details</h4>
          <div className="max-h-60 overflow-y-auto rounded bg-gray-700 p-3">
            <ul className="space-y-2 text-sm">
              {warnings.map((warning) => (
                <li key={warning.id} className="rounded bg-yellow-500/10 p-2">
                  <span className="mr-2 inline-block rounded bg-yellow-500/30 px-1.5 py-0.5 text-xs">
                    {warning.type}
                  </span>
                  {warning.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* JSON Data View */}
      <div className="mt-4">
        <details>
          <summary className="cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
            View Raw JSON Data
          </summary>
          <pre className="mt-2 max-h-60 overflow-y-auto rounded bg-gray-900 p-3 text-xs">
            {JSON.stringify(
              {
                timelineSettings,
                spells: processedTimeline.spells.map((spell) => ({
                  name: spell.spell.name,
                  id: spell.spell.id,
                  castCount: spell.casts.length,
                  charges: spell.chargeIntervals?.length || 0,
                })),
                castCount: totalCasts,
                chargeEvents: totalChargeIntervals,
                warnings: warnings.length,
              },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    </div>
  )
}

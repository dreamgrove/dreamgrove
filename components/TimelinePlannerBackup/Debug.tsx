import React from 'react'
import { CastInfo } from './Cast'
import { SpellCasts, SpellInfo } from './types'

interface DebugProps {
  currentSpells: SpellCasts[]
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
  currentSpells,
  timelineSettings,
  warnings = [],
  showDebug = false,
  toggleDebug,
}: DebugProps) {
  // Calculate total cast count
  const totalCasts = currentSpells.reduce((acc, spell) => acc + spell.casts.length, 0)

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
        <span>
          Total Casts: <strong>{totalCasts}</strong>
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
                {currentSpells.flatMap((spellCast) =>
                  spellCast.casts.map((cast) => (
                    <tr key={cast.id} className="border-b border-gray-600">
                      <td className="py-2 pr-4">{spellCast.spell.name}</td>
                      <td className="py-2 pr-4">{cast.start_s.toFixed(1)}s</td>
                      <td className="py-2 pr-4">{cast.end_s.toFixed(1)}s</td>
                      <td className="py-2 pr-4">{(cast.end_s - cast.start_s).toFixed(1)}s</td>
                      <td className="py-2 pr-4">{spellCast.spell.channel_duration.toFixed(1)}s</td>
                      <td className="py-2 pr-4">{spellCast.spell.effect_duration.toFixed(1)}s</td>
                      <td className="py-2">{spellCast.spell.cooldown.toFixed(1)}s</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
                spells: currentSpells.map((spell) => ({
                  name: spell.spell.name,
                  id: spell.spell.id,
                  castCount: spell.casts.length,
                })),
                castCount: totalCasts,
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

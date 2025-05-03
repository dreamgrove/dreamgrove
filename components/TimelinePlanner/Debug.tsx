import React from 'react'
import { CastInfo } from './Cast'

interface DebugProps {
  currentSpells: {
    spellName: string
    spellId: string | number
    casts: (CastInfo & { id: string })[]
  }[]
  timelineSettings: {
    totalLength: number
    timelineWidth: number
    gapDistance: number
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

export default function Debug({
  currentSpells,
  timelineSettings,
  warnings = [],
  showDebug = false,
  toggleDebug,
}: DebugProps) {
  if (!showDebug) {
    return (
      <div className="mt-4 flex justify-end">
        <button
          onClick={toggleDebug}
          className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600"
        >
          Show Debug Info
        </button>
      </div>
    )
  }

  // Count total casts
  const totalCasts = currentSpells.reduce((total, spell) => total + spell.casts.length, 0)

  // Find earliest and latest cast times
  let earliestCast = Number.MAX_SAFE_INTEGER
  let latestCast = 0

  if (totalCasts > 0) {
    currentSpells.forEach((spell) => {
      spell.casts.forEach((cast) => {
        earliestCast = Math.min(earliestCast, cast.start_s)
        latestCast = Math.max(latestCast, cast.end_s)
      })
    })
  } else {
    earliestCast = 0
  }

  return (
    <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Timeline Debug Info</h3>
        <button
          onClick={toggleDebug}
          className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600"
        >
          Hide Debug Info
        </button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="rounded bg-gray-700 p-3">
          <h4 className="mb-2 font-medium">Timeline Settings</h4>
          <div className="text-sm">
            <p>Total Length: {timelineSettings.totalLength}s</p>
            <p>Timeline Width: {timelineSettings.timelineWidth}px</p>
            <p>Gap Distance: {timelineSettings.gapDistance}px</p>
            <p>
              Pixels per Second:{' '}
              {(timelineSettings.timelineWidth / timelineSettings.totalLength).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="rounded bg-gray-700 p-3">
          <h4 className="mb-2 font-medium">Spell Summary</h4>
          <div className="text-sm">
            <p>Total Spells: {currentSpells.length}</p>
            <p>Total Casts: {totalCasts}</p>
            <p>
              Cast Range: {earliestCast.toFixed(1)}s - {latestCast.toFixed(1)}s
            </p>
          </div>
        </div>

        <div className="rounded bg-gray-700 p-3">
          <h4 className="mb-2 font-medium">Warnings</h4>
          <div className="text-sm">
            <p>Total Warnings: {warnings.length}</p>
            {warnings.length > 0 && (
              <p>Types: {Array.from(new Set(warnings.map((w) => w.type))).join(', ')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Spell Information */}
      {currentSpells.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 font-medium">Spell Details</h4>
          <div className="max-h-60 overflow-y-auto rounded bg-gray-700 p-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600 text-left">
                  <th className="pb-2 pr-4">Spell</th>
                  <th className="pb-2 pr-4">ID</th>
                  <th className="pb-2 pr-4">Casts</th>
                  <th className="pb-2 pr-4">Coverage</th>
                  <th className="pb-2">Cast Times</th>
                </tr>
              </thead>
              <tbody>
                {currentSpells.map((spell) => {
                  // Calculate coverage percentage if timeline total length > 0
                  let coveragePercent = 0
                  if (timelineSettings.totalLength > 0 && spell.casts.length > 0) {
                    const totalCoverage = spell.casts.reduce((total, cast) => {
                      return total + (cast.spell_cooldown_s || 0)
                    }, 0)
                    coveragePercent = Math.min(
                      100,
                      Math.round((totalCoverage / timelineSettings.totalLength) * 100)
                    )
                  }

                  return (
                    <tr key={spell.spellId} className="border-b border-gray-600">
                      <td className="py-2 pr-4">{spell.spellName}</td>
                      <td className="py-2 pr-4">{spell.spellId}</td>
                      <td className="py-2 pr-4">{spell.casts.length}</td>
                      <td className="py-2 pr-4">
                        <div className="h-2 w-28 rounded bg-gray-600">
                          <div
                            className="h-2 rounded bg-green-500"
                            style={{ width: `${coveragePercent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{coveragePercent}%</span>
                      </td>
                      <td className="py-2">
                        <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          {spell.casts.length > 0
                            ? spell.casts.map((cast) => `${cast.start_s.toFixed(1)}s`).join(', ')
                            : '-'}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cast Timing Details */}
      {totalCasts > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 font-medium">Cast Timing Details</h4>
          <div className="max-h-60 overflow-y-auto rounded bg-gray-700 p-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600 text-left">
                  <th className="pb-2 pr-4">Spell</th>
                  <th className="pb-2 pr-4">Start</th>
                  <th className="pb-2 pr-4">End</th>
                  <th className="pb-2 pr-4">Channel</th>
                  <th className="pb-2 pr-4">Effect</th>
                  <th className="pb-2">Cooldown</th>
                </tr>
              </thead>
              <tbody>
                {currentSpells.flatMap((spell) =>
                  spell.casts.map((cast) => (
                    <tr key={cast.id} className="border-b border-gray-600">
                      <td className="py-2 pr-4">{spell.spellName}</td>
                      <td className="py-2 pr-4">{cast.start_s.toFixed(1)}s</td>
                      <td className="py-2 pr-4">{cast.end_s.toFixed(1)}s</td>
                      <td className="py-2 pr-4">{cast.channel_duration_s.toFixed(1)}s</td>
                      <td className="py-2 pr-4">{cast.effect_duration_s.toFixed(1)}s</td>
                      <td className="py-2">{cast.spell_cooldown_s.toFixed(1)}s</td>
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
                  name: spell.spellName,
                  id: spell.spellId,
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

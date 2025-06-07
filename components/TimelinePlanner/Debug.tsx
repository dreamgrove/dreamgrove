import React, { useState } from 'react'
import { SpellTimeline, SpellInfo, TimelineToRender, Cast } from '../../lib/types/cd_planner'
import { useSettings } from './SettingsProvider'

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

type TabType = 'debug' | 'settings' | 'about'

export default function Debug({
  processedTimeline,
  timelineSettings,
  warnings = [],
  showDebug = false,
  toggleDebug,
}: DebugProps) {
  const [activeTab, setActiveTab] = useState<TabType>('debug')
  const { showEventMarkers, setShowEventMarkers } = useSettings()

  const totalCasts = processedTimeline.spells.reduce((acc, spell) => acc + spell.casts.length, 0)

  const totalChargeIntervals = processedTimeline.spells.reduce(
    (acc, spell) => acc + (spell.chargeIntervals?.length || 0),
    0
  )

  // Get all casts and sort them by start_s
  const allCasts = processedTimeline.spells
    .flatMap((spellInfo) =>
      spellInfo.casts.map((cast) => ({
        cast,
        spellName: spellInfo.spell.name,
        spellId: spellInfo.spell.spellId,
      }))
    )
    .sort((a, b) => a.cast.start_s - b.cast.start_s)

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 bg-neutral-900 transition-all duration-500 ease-in-out ${
        showDebug ? 'h-[55vh]' : 'h-12'
      }`}
    >
      <div
        className={`flex h-12 items-center border-t border-neutral-700 ${showDebug ? 'justify-between' : 'justify-end'}`}
      >
        {/* Left side: tabs (only show when debug is open) */}
        {showDebug && (
          <div className="flex items-center gap-1 pl-21">
            {[
              { id: 'debug' as const, label: 'Debug' },
              { id: 'settings' as const, label: 'Settings' },
              { id: 'about' as const, label: 'About' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded px-3 py-1 text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Right side: toggle button */}
        <button
          onClick={toggleDebug}
          id="tour-debug-selector"
          className="flex items-center rounded py-1 pr-24 text-sm text-neutral-400 transition-colors duration-300 hover:text-neutral-300 focus:outline-none"
        >
          <span className="mr-2 text-2xl font-bold transition-transform duration-300">
            {showDebug ? '-' : '+'}
          </span>
          {showDebug ? 'Hide Additional Details' : 'Show Additional Details'}
        </button>
      </div>

      <div className={`h-[calc(100%-3rem)] overflow-y-auto border-t border-neutral-700 px-24`}>
        <div className="pb-6">
          {activeTab === 'debug' && (
            <>
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
                  <span className="ml-4 rounded-sm bg-yellow-400 px-2 py-0.5 text-xs font-bold text-black">
                    {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Debug details */}
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Cast Details: </h4>
                  <table className="min-w-full divide-y divide-neutral-800 overflow-hidden rounded-lg bg-neutral-700 text-sm shadow-md">
                    <thead className="bg-neutral-800">
                      <tr className="">
                        <th className="py-2 pr-4 text-neutral-200">#</th>
                        <th className="py-2 pr-4 text-neutral-200">Spell</th>
                        <th className="py-2 pr-4 text-neutral-200">Start</th>
                        <th className="py-2 pr-4 text-neutral-200">Channel End</th>
                        <th className="py-2 pr-4 text-neutral-200">Effect End</th>
                        <th className="py-2 pr-4 text-neutral-200">Cast End</th>
                        <th className="py-2 pr-4 text-neutral-200">Duration</th>
                        <th className="py-2 pr-4 text-neutral-200">Channel</th>
                        <th className="py-2 pr-4 text-neutral-200">Effect</th>
                        <th className="py-2 text-neutral-200">Cooldown</th>
                        <th className="py-2 text-neutral-200">CDR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allCasts.map(({ cast, spellName }, index) => {
                        const channelEnd = cast.start_s + cast.channel_visual_duration
                        const effectEnd =
                          cast.start_s + cast.channel_visual_duration + cast.effect_visual_duration
                        return (
                          <tr key={cast.id} className="border-b border-neutral-800/60 text-center">
                            <td className="py-2 pr-4">{index + 1}</td>
                            <td className="py-2 pr-4">{spellName}</td>
                            <td className="py-2 pr-4">{cast.start_s.toFixed(1)}s</td>
                            <td className="py-2 pr-4">{channelEnd.toFixed(1)}s</td>
                            <td className="py-2 pr-4">{effectEnd.toFixed(1)}s</td>
                            <td className="py-2 pr-4">{cast.end_s.toFixed(1)}s</td>
                            <td className="py-2 pr-4">{cast.duration_s.toFixed(1)}s</td>
                            <td className="py-2 pr-4">{cast.channel_duration.toFixed(1)}s</td>
                            <td className="py-2 pr-4">{cast.effect_duration.toFixed(1)}s</td>
                            <td className="py-2">{cast.cooldown_duration.toFixed(1)}s</td>
                            <td className="py-2">{cast.cooldown_delay_s.toFixed(1)}s</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Charge Intervals Section */}
                {totalChargeIntervals > 0 && (
                  <div>
                    <h4 className="mb-2 font-medium">Charge Details</h4>
                    <table className="min-w-full divide-y divide-neutral-800 overflow-hidden rounded-lg bg-neutral-700 text-sm shadow-md">
                      <thead className="bg-neutral-800">
                        <tr>
                          <th className="pr-4 pb-2">Spell</th>
                          <th className="pr-4 pb-2">Time</th>
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
                                key={`${spellInfo.spell.spellId}-charge-${idx}`}
                                className="border-b border-neutral-800/50 text-center"
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

                {/* Warnings List */}
                {warnings.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-medium">Warning Details</h4>
                    <div className="max-h-60 overflow-y-auto rounded-sm bg-gray-700 p-3">
                      <ul className="space-y-2 text-sm">
                        {warnings.map((warning) => (
                          <li key={warning.id} className="rounded bg-yellow-500/10 p-2">
                            <span className="mr-2 inline-block rounded-sm bg-yellow-500/30 px-1.5 py-0.5 text-xs">
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
                    <pre className="mt-2 max-h-60 overflow-y-auto rounded-sm bg-neutral-900 p-3 text-xs">
                      {JSON.stringify(
                        {
                          timelineSettings,
                          spells: processedTimeline.spells.map((spell) => ({
                            name: spell.spell.name,
                            id: spell.spell.spellId,
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
            </>
          )}

          {activeTab === 'settings' && (
            <div className="mt-4">
              <h3 className="mb-4 text-lg font-medium">Timeline Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showEventMarkers}
                    onChange={(e) => setShowEventMarkers(e.target.checked)}
                    className="rounded border-neutral-600 bg-neutral-800 focus:ring-orange-500"
                  />
                  <span className="text-sm">Show Event Markers</span>
                  <span className="text-xs text-neutral-400">
                    Display event markers on the timeline for debugging purposes
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="mt-4">
              <h3 className="mb-4 text-lg font-medium">About</h3>
              <div className="text-sm text-neutral-300">
                <p>More information coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

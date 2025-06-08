import React, { useState } from 'react'
import { SpellTimeline, SpellInfo, TimelineToRender, Cast } from '../../lib/types/cd_planner'
import { useSettings } from './SettingsProvider'
import { PiCaretDoubleUpBold, PiCaretDoubleDownBold } from 'react-icons/pi'

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
  const [activeTab, setActiveTab] = useState<TabType>('about')
  const { showEventMarkers, setShowEventMarkers } = useSettings()
  const [debugHeight, setDebugHeight] = useState(55) // vh units
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragStartHeight, setDragStartHeight] = useState(0)

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

  // Drag handlers for resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStartY(e.clientY)
    setDragStartHeight(debugHeight)
    e.preventDefault()
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaY = dragStartY - e.clientY // Inverted because we want dragging up to increase height
      const viewportHeight = window.innerHeight
      const deltaVh = (deltaY / viewportHeight) * 100
      const newHeight = Math.max(15, Math.min(80, dragStartHeight + deltaVh)) // Min 15vh, max 80vh

      // Use requestAnimationFrame to throttle updates
      requestAnimationFrame(() => {
        setDebugHeight(newHeight)
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStartY, dragStartHeight])

  return (
    <>
      {/* Backdrop */}
      {showDebug && (
        <div
          className="fixed inset-0 z-40 bg-black/20 transition-opacity duration-500"
          onClick={toggleDebug}
        />
      )}
      <div
        className={`fixed right-0 bottom-0 left-0 z-50 bg-neutral-900 transition-[height] ease-in-out ${
          showDebug ? '' : 'h-12'
        } ${isDragging ? 'duration-0' : 'duration-500'}`}
        style={showDebug ? { height: `${debugHeight}vh` } : undefined}
      >
        {/* Drag handle - only show when debug is open */}
        {showDebug && (
          <div
            className={`relative h-1 w-full cursor-ns-resize bg-neutral-600 transition-colors hover:bg-neutral-500 ${isDragging ? 'bg-main/80' : ''}`}
            onMouseDown={handleMouseDown}
          >
            {/* Visual grip dots */}
            <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-1">
              <div className="h-0.5 w-0.5 rounded-full bg-neutral-400"></div>
              <div className="h-0.5 w-0.5 rounded-full bg-neutral-400"></div>
              <div className="h-0.5 w-0.5 rounded-full bg-neutral-400"></div>
            </div>
          </div>
        )}
        <div
          className={`flex h-12 items-center border-t border-neutral-700 ${showDebug ? 'justify-between' : 'justify-end'}`}
        >
          {/* Left side: tabs (only show when debug is open) */}
          {showDebug && (
            <div className="flex items-center gap-1 pl-8 xl:pl-13">
              {[
                { id: 'about' as const, label: 'About' },
                { id: 'settings' as const, label: 'Settings' },
                { id: 'debug' as const, label: 'Debug' },
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
            className="text-main/80 hover:text-main flex items-center gap-2 rounded py-1 pr-10 text-sm transition-colors duration-300 focus:outline-none xl:pr-15"
          >
            {showDebug ? 'Hide Additional Details' : 'Show Additional Details'}
            {showDebug ? (
              <PiCaretDoubleDownBold
                className="text-current transition-all duration-300"
                size={16}
              />
            ) : (
              <PiCaretDoubleUpBold className="text-current transition-all duration-300" size={16} />
            )}
          </button>
        </div>

        <div
          className={`${showDebug ? 'h-[calc(100%-3.25rem)]' : 'h-[calc(100%-3rem)]'} overflow-y-auto border-t border-neutral-700 px-8 xl:px-14`}
          style={{ scrollbarGutter: 'stable', contain: 'layout style' }}
        >
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
                    Total Casts: <strong>{totalCasts}</strong>
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
                    <table className="min-w-full divide-y divide-neutral-800 overflow-hidden rounded-sm bg-neutral-700 text-xs shadow-md">
                      <thead className="bg-neutral-800">
                        <tr className="">
                          <th className="py-2 pr-4 text-xs text-neutral-200">#</th>
                          <th className="py-2 pr-4 text-xs text-neutral-200">Spell</th>
                          <th className="py-2 pr-4 text-xs text-neutral-200">Start</th>
                          <th className="py-2 pr-4 text-xs text-neutral-200">Channel End</th>
                          <th className="py-2 pr-4 text-xs text-neutral-200">Effect End</th>
                          <th className="py-2 pr-4 text-xs text-neutral-200">Cast End</th>
                          <th className="py-2 pr-4 text-xs text-neutral-200">Duration</th>
                          <th className="py-2 pr-4 text-xs text-neutral-200">Channel Duration</th>
                          <th className="py-2 pr-4 text-xs text-neutral-200">Effect Duration</th>
                          <th className="py-2 text-xs text-neutral-200">Cooldown</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allCasts.map(({ cast, spellName }, index) => {
                          const channelEnd = cast.start_s + cast.channel_visual_duration
                          const effectEnd =
                            cast.start_s +
                            cast.channel_visual_duration +
                            cast.effect_visual_duration
                          return (
                            <tr
                              key={cast.id}
                              className="border-b border-neutral-800/60 text-center"
                            >
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
                      <table className="min-w-full divide-y divide-neutral-800 overflow-hidden rounded-lg bg-neutral-700 text-xs shadow-md">
                        <thead className="bg-neutral-800">
                          <tr>
                            <th className="py-2 pr-4">Spell</th>
                            <th className="py-2 pr-4">Time</th>
                            <th className="py-2">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {processedTimeline.spells
                            .filter(
                              (spellInfo) =>
                                spellInfo.chargeIntervals && spellInfo.chargeIntervals.length > 0
                            )
                            .flatMap((spellInfo) =>
                              (spellInfo.chargeIntervals || []).map((interval, idx) => ({
                                spellName: spellInfo.spell.name,
                                spellId: spellInfo.spell.spellId,
                                interval,
                                idx,
                              }))
                            )
                            .sort((a, b) => a.interval.instant - b.interval.instant)
                            .map(({ spellName, spellId, interval, idx }) => (
                              <tr
                                key={`${spellId}-charge-${idx}`}
                                className="border-b border-neutral-800/50 text-center"
                              >
                                <td className="py-2 pr-4">{spellName}</td>
                                <td className="py-2 pr-4">{interval.instant.toFixed(1)}s</td>
                                <td
                                  className={`py-2 ${interval.change > 0 ? 'text-green-400' : 'text-red-400'}`}
                                >
                                  {interval.change > 0 ? '+' : ''}
                                  {interval.change}
                                </td>
                              </tr>
                            ))}
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
                  <div className="flex items-start gap-3">
                    <label
                      className="relative flex cursor-pointer items-start"
                      htmlFor="show-event-markers"
                    >
                      <input
                        type="checkbox"
                        checked={showEventMarkers}
                        onChange={(e) => setShowEventMarkers(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-neutral-600 bg-neutral-800 shadow transition-all checked:border-neutral-700 checked:bg-neutral-700 hover:shadow-md"
                        id="show-event-markers"
                      />
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </label>
                    <label
                      className="ml-2 cursor-pointer text-sm text-neutral-300"
                      htmlFor="show-event-markers"
                    >
                      <div>
                        <p className="font-medium">Show Event Markers</p>
                        <p className="text-neutral-400">
                          Displays event markers on the timeline for debugging purposes. NB: the
                          events that will be displayed do not always correspond to the final
                          timeline
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="mt-4">
                <div className="space-y-2 text-sm text-neutral-300">
                  {/* Development Status */}
                  <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                    <h4 className="mb-2 text-sm font-medium text-yellow-400">
                      ⚠️ Development Status
                    </h4>
                    <p>
                      The software is in early development and can contain bugs. Please open issues
                      on the GitHub repository for any bugs or feature requests.
                    </p>
                  </div>

                  {/* Support Info */}
                  <div className="rounded-lg border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-4">
                    <h4 className="mb-2 text-sm font-medium text-orange-400/80">
                      💝 Support Development
                    </h4>
                    <p className="mb-3">
                      The Cooldown Planner is a free and ad-free tool. However, if you enjoyed it,
                      or found it useful, please consider donating to help cover server costs and
                      support future development!
                    </p>
                    <a
                      href="https://buymeacoffee.com/vinter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-yellow-500/20 px-3 py-2 text-sm font-medium text-yellow-400 transition-colors hover:bg-yellow-500/30"
                    >
                      ☕ Buy me a coffee
                    </a>
                  </div>

                  {/* Developer Info */}
                  <div className="space-y-1 rounded-lg bg-neutral-800/50 p-4">
                    <p>
                      This tool has been developed by{' '}
                      <a href="https://github.com/thevinter" className="text-main/80 underline">
                        vinter
                      </a>
                    </p>
                  </div>

                  {/* Roadmap */}
                  <div className="rounded-lg bg-neutral-800/50 p-4">
                    <h4 className="mb-3 font-medium text-gray-300">📝 Roadmap</h4>
                    <p className="mb-1 text-sm">
                      There is a public roadmap for the website available at the following link:
                    </p>
                    <a
                      href="https://github.com/orgs/dreamgrove/projects/3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-main/80 hover:text-main/90 text-sm underline transition-colors"
                    >
                      https://github.com/orgs/dreamgrove/projects/3
                    </a>

                    <p className="mt-1 text-sm">
                      If you have any ideas for features or improvements, first check the roadmap to
                      see if it has already been suggested. If it has not, feel free to open a
                      github issue.
                    </p>
                    <p className="pt-2">
                      You can also find the source code on the same github repository:{' '}
                      <a
                        href="https://github.com/dreamgrove/dreamgrove"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-main/80 underline transition-colors hover:text-orange-300/90"
                      >
                        https://github.com/dreamgrove/dreamgrove
                      </a>
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="rounded-lg bg-neutral-800/50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-white">Contact Me</h4>
                    <p>
                      GitHub is the preferred way to discuss topics related to the website. If
                      you're unable to use GitHub or have something that needs to be discussed
                      privately, you can find me as{' '}
                      <span className="text-main/80 font-medium">thevinter</span> on the dreamgrove
                      Discord server.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

import React, { useState } from 'react'
import { TimelineToRender } from '@/types/index'
import { PiCaretDoubleUpBold, PiCaretDoubleDownBold } from 'react-icons/pi'
import Settings from './SidebarSections/Settings'
import About from './SidebarSections/About'
import DebugTab from './SidebarSections/Debug'
import { useTimelineContext } from '../TimelineProvider/useTimelineContext'

interface SidebarProps {
  markerSpacing: number
}

type TabType = 'debug' | 'settings' | 'about'

export default function Sidebar({ markerSpacing }: SidebarProps) {
  const { processedState } = useTimelineContext()
  const processedTimeline = processedState
  const [activeTab, setActiveTab] = useState<TabType>('about')
  const [debugHeight, setDebugHeight] = useState(55) // vh units
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragStartHeight, setDragStartHeight] = useState(0)

  const [showPanel, setShowPanel] = useState(false)

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
      {showPanel && (
        <div
          className="fixed inset-0 z-40 bg-black/20 transition-opacity duration-500"
          onClick={() => setShowPanel((prev) => !prev)}
        />
      )}
      <div
        className={`fixed right-0 bottom-0 left-0 z-50 bg-neutral-900 transition-[height] ease-in-out ${
          showPanel ? '' : 'h-12'
        } ${isDragging ? 'duration-0' : 'duration-500'}`}
        style={showPanel ? { height: `${debugHeight}vh` } : undefined}
      >
        {/* Drag handle - only show when debug is open */}
        {showPanel && (
          <div
            className={`relative h-2 w-full cursor-ns-resize bg-neutral-600 transition-colors hover:bg-neutral-500 ${isDragging ? 'bg-main/80' : ''}`}
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
          className={`flex h-12 items-center border-t border-neutral-700 ${showPanel ? 'justify-between' : 'justify-end'}`}
        >
          {/* Left side: tabs (only show when debug is open) */}
          {showPanel && (
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
            onClick={() => setShowPanel((prev) => !prev)}
            id="tour-debug-selector"
            className="text-main/80 hover:text-main flex items-center gap-2 rounded py-1 pr-10 text-sm transition-colors duration-300 focus:outline-none xl:pr-15"
          >
            Additional Details
            {showPanel ? (
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
          className={`${showPanel ? 'h-[calc(100%-3.25rem)]' : 'h-[calc(100%-3rem)]'} overflow-y-auto border-t border-neutral-700 px-8 xl:px-14`}
          style={{ scrollbarGutter: 'stable', contain: 'layout style' }}
        >
          <div className="pb-6">
            {activeTab === 'debug' && (
              <DebugTab
                processedTimeline={processedTimeline}
                markerSpacing={markerSpacing}
                totalCasts={totalCasts}
                totalChargeIntervals={totalChargeIntervals}
                allCasts={allCasts}
              />
            )}

            {activeTab === 'settings' && <Settings />}

            {activeTab === 'about' && <About />}
          </div>
        </div>
      </div>
    </>
  )
}

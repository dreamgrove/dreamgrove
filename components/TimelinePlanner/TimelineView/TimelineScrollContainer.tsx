import EventMarkers from '../Markers/EventMarkers'
import Markers from '../Markers/Markers'
import SpellMarkers from '../Markers/SpellMarkers'
import { EventType, SpellToRender, TimelineEvent } from '@/types/index'
import { CustomSpell, isCustomSpell } from '@/lib/utils/customSpellStorage'
import CustomSpellIcon from '../CustomSpell/CustomSpellIcon'
import { useTimelineControls } from '../Providers/TimelineLengthProvider'
import SpellRow from './SpellRow/SpellRow'

export default function TimelineScrollContainer({
  spells,
  wowheadNameMap,
  marker_spacing_s,
  averageTimestamps,
  wowheadMarkerMap,
  showEventMarkers,
  processedEvents,
  handleCastDelete,
  handleCastMove,
}: {
  spells: SpellToRender[]
  wowheadNameMap: Record<string, React.ReactNode>
  marker_spacing_s: number
  averageTimestamps: Record<string, number[]>
  wowheadMarkerMap: Record<string, React.ReactNode>
  showEventMarkers: boolean
  processedEvents: TimelineEvent<EventType>[]
  handleCastDelete: (castId: string) => void
  handleCastMove: (castId: string, newStartTime: number) => void
}) {
  const { total_length_s, pixelsPerSecond } = useTimelineControls()

  return (
    <>
      {/* Markers overlay */}
      {spells.length > 0 && (
        <>
          {/* Timestamps */}
          <Markers
            marker_spacing_s={marker_spacing_s}
            total_length_s={total_length_s}
            pixelsPerSecond={pixelsPerSecond}
          />
          {/* Wclog markers */}
          <SpellMarkers
            spellInfo={averageTimestamps}
            wowheadMap={wowheadMarkerMap}
            total_length_s={total_length_s}
          />
          {/* Event markers */}
          {showEventMarkers && <EventMarkers eventInfo={processedEvents} />}
        </>
      )}

      {/* Casts/timeline rows */}
      <div className="relative mt-5 flex flex-col">
        {/* Render a SpellCastsRow for each spell, sorted by spell.id*/}
        {spells.length > 0 ? (
          spells
            .sort((a, b) => a.spell.spellId - b.spell.spellId)
            .map((spellCast) => (
              <SpellRow
                key={`spell-row-${spellCast.spell.spellId}`}
                spellTimeline={spellCast}
                wowheadComponent={
                  isCustomSpell(spellCast.spell) ? (
                    <CustomSpellIcon spell={spellCast.spell as CustomSpell} size="md" />
                  ) : (
                    wowheadNameMap[spellCast.spell.spellId] || <span>{spellCast.spell.name}</span>
                  )
                }
                onCastDelete={handleCastDelete}
                onCastMove={handleCastMove}
              />
            ))
        ) : (
          <div className="absolute top-0 mt-16 w-full text-center text-sm text-gray-500 select-none">
            <span className="-ml-[13%]">Add a spell to get started</span>
          </div>
        )}
      </div>
    </>
  )
}

import BossAbilityMarkers from '../Markers/BossAbilityMarkers'
import EventMarkers from '../Markers/EventMarkers'
import Markers from '../Markers/Markers'
import SpellMarkers from '../Markers/SpellMarkers'
import SpellRow from './SpellRow/SpellRow'
import { useTimelineContext } from '../TimelineProvider/useTimelineContext'
import { useMemo } from 'react'
import type { BossAbilitiesResponse } from '@/types/bossAbilities'

export default function TimelineScrollContainer({
  averageTimestamps,
  wowheadMarkerMap,
  bossAbilities,
  visibleBossAbilityKeys,
}: {
  averageTimestamps: Record<string, number[]>
  wowheadMarkerMap: Record<string, React.ReactNode>
  bossAbilities?: BossAbilitiesResponse | null
  visibleBossAbilityKeys: Set<string>
}) {
  const { processedState } = useTimelineContext()
  const sortedSpells = useMemo(
    () => processedState.spells.sort((a, b) => a.spell.spellId - b.spell.spellId),
    [processedState.spells]
  )

  return (
    <>
      {/* Markers overlay */}
      {sortedSpells.length > 0 && (
        <>
          {/* Timestamps */}
          <Markers />
          {/* Wclog markers */}
          <SpellMarkers spellInfo={averageTimestamps} wowheadMap={wowheadMarkerMap} />
          {/* Event markers */}
          <EventMarkers />
        </>
      )}
      {/* Boss ability markers from WCL, shown regardless of user spell rows */}
      <BossAbilityMarkers
        abilities={bossAbilities?.abilities ?? []}
        visibleKeys={visibleBossAbilityKeys}
      />

      {/* Casts/timeline rows */}
      <div className="relative mt-12 flex flex-col">
        {/* Render a SpellCastsRow for each spell, sorted by spell.id*/}
        {sortedSpells.length > 0 ? (
          sortedSpells.map((singleSpellRow) => (
            <SpellRow
              key={`spell-row-${singleSpellRow.spell.spellId}`}
              spellTimeline={singleSpellRow}
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

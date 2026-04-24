'use client'
import { useTimelineControls } from '../Providers/TimelineLengthProvider'
import WowheadClientIcon from '@/components/csm/WowheadClientIcon'
import type { BossAbilityCast } from '@/types/bossAbilities'
import { BOSS_ABILITY_PALETTE, computeAbilityColors } from '../bossAbilityPalette'

const ICON_SIZE = 24
const ICON_TOP = 4

function BossMarker({
  position,
  colorClass,
  name,
  spellId,
}: {
  position: number
  colorClass: string
  name: string
  spellId: number
}) {
  return (
    <div
      className="pointer-events-none relative top-0 z-10 flex h-full flex-row items-start"
      style={{ left: position }}
    >
      <div className={`absolute bottom-0 left-0 h-[87%] w-px ${colorClass} opacity-50`} />
      <span
        className="pointer-events-auto absolute -translate-x-1/2 rounded-xs"
        style={{ top: ICON_TOP, width: ICON_SIZE, height: ICON_SIZE }}
        title={name}
      >
        <WowheadClientIcon
          id={String(spellId)}
          type="spell"
          name={name}
          size={ICON_SIZE}
          noMargin
        />
      </span>
    </div>
  )
}

interface Props {
  abilities: BossAbilityCast[]
  visibleKeys: Set<string>
}

export default function BossAbilityMarkers({ abilities, visibleKeys }: Props) {
  const { timeToPixels, total_length_s } = useTimelineControls()
  if (!abilities || abilities.length === 0) return null

  const colorByName = computeAbilityColors(abilities)
  const visibleAbilities = abilities.filter((a) => visibleKeys.has(a.key))
  if (visibleAbilities.length === 0) return null

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-10 flex h-full pl-6"
      style={{ width: timeToPixels(total_length_s) }}
    >
      {visibleAbilities.flatMap((ability) => {
        const colorClass = colorByName.get(ability.name) ?? BOSS_ABILITY_PALETTE[0]
        return ability.timestamps
          .filter((t) => t >= 0 && t <= total_length_s)
          .map((t, i) => (
            <BossMarker
              key={`${ability.key}-${i}`}
              position={timeToPixels(t)}
              colorClass={colorClass}
              name={ability.name}
              spellId={ability.spellId}
            />
          ))
      })}
    </div>
  )
}

'use client'

import WowheadClientIcon from '@/components/csm/WowheadClientIcon'
import type { BossAbilityCast } from '@/types/bossAbilities'
import { BOSS_ABILITY_PALETTE, computeAbilityColors } from './bossAbilityPalette'

interface Props {
  abilities: BossAbilityCast[]
  visibleKeys: Set<string>
  onToggle: (key: string) => void
  onToggleAll: (visible: boolean) => void
}

export default function BossAbilityToggles({
  abilities,
  visibleKeys,
  onToggle,
  onToggleAll,
}: Props) {
  if (!abilities || abilities.length === 0) return null

  const colorByName = computeAbilityColors(abilities)
  const allVisible = abilities.every((a) => visibleKeys.has(a.key))
  const noneVisible = abilities.every((a) => !visibleKeys.has(a.key))

  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] tracking-[0.18em] text-neutral-400 uppercase">
          Boss abilities
        </span>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.15em] text-neutral-500 uppercase">
          <button
            type="button"
            onClick={() => onToggleAll(true)}
            disabled={allVisible}
            className="transition-colors hover:text-orange-400 disabled:cursor-default disabled:opacity-40 disabled:hover:text-neutral-500"
          >
            Show all
          </button>
          <span aria-hidden className="text-neutral-700">
            /
          </span>
          <button
            type="button"
            onClick={() => onToggleAll(false)}
            disabled={noneVisible}
            className="transition-colors hover:text-orange-400 disabled:cursor-default disabled:opacity-40 disabled:hover:text-neutral-500"
          >
            Hide all
          </button>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {abilities.map((ability) => {
          const id = `boss-ability-toggle-${ability.key}`
          const checked = visibleKeys.has(ability.key)
          const colorClass = colorByName.get(ability.name) ?? BOSS_ABILITY_PALETTE[0]
          return (
            <li key={ability.key}>
              <label
                htmlFor={id}
                className="group flex cursor-pointer items-center gap-2 rounded-sm px-1.5 py-1 text-sm text-neutral-200 transition-colors hover:bg-white/[0.04]"
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(ability.key)}
                  className="h-3.5 w-3.5 cursor-pointer accent-orange-500"
                />
                <span
                  aria-hidden
                  className={`h-3 w-[2px] rounded-sm ${colorClass} ${
                    checked ? 'opacity-90' : 'opacity-40'
                  }`}
                />
                <span className="h-5 w-5 flex-shrink-0">
                  <WowheadClientIcon
                    id={String(ability.spellId)}
                    type="spell"
                    name={ability.name}
                    size={20}
                    noMargin
                    noLink
                  />
                </span>
                <span className="truncate" title={ability.name}>
                  {ability.name}
                </span>
                <span className="ml-auto text-[10px] tracking-wider text-neutral-500 tabular-nums">
                  {ability.timestamps.length}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

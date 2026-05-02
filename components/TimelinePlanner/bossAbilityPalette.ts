import type { BossAbilityCast } from '@/types/bossAbilities'

export const BOSS_ABILITY_PALETTE = [
  'bg-red-400',
  'bg-orange-400',
  'bg-yellow-300',
  'bg-lime-400',
  'bg-emerald-400',
  'bg-cyan-400',
  'bg-blue-400',
  'bg-violet-400',
  'bg-fuchsia-400',
  'bg-pink-400',
]

export function computeAbilityColors(abilities: BossAbilityCast[]): Map<string, string> {
  const byName = new Map<string, string>()
  const sorted = [...abilities].sort(
    (a, b) => (a.timestamps[0] ?? Infinity) - (b.timestamps[0] ?? Infinity)
  )
  for (const ability of sorted) {
    if (!byName.has(ability.name)) {
      byName.set(ability.name, BOSS_ABILITY_PALETTE[byName.size % BOSS_ABILITY_PALETTE.length])
    }
  }
  return byName
}

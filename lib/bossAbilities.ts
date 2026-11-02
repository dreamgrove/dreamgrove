import type { BossAbilityCast } from '@/types/bossAbilities'

/**
 * Parses a guide's `abilities` prop: an array of spell names and/or ids, or a
 * comma-separated string of them.
 */
export function parseAbilityRefs(refs: unknown): (string | number)[] {
  const list = Array.isArray(refs) ? refs : typeof refs === 'string' ? refs.split(',') : []
  return list
    .map((r) => (typeof r === 'number' ? r : String(r).trim()))
    .filter((r) => r !== '')
    .map((r) => (typeof r === 'string' && /^\d+$/.test(r) ? Number(r) : r))
}

/**
 * The abilities matching `refs`, in the response's order. An id matches any of an
 * ability's merged spell ids; a name matches case-insensitively.
 */
export function selectBossAbilities(
  abilities: BossAbilityCast[],
  refs: (string | number)[]
): BossAbilityCast[] {
  const ids = new Set(refs.filter((r): r is number => typeof r === 'number'))
  const names = new Set(
    refs.filter((r): r is string => typeof r === 'string').map((r) => r.toLowerCase())
  )
  return abilities.filter(
    (a) => names.has(a.name.toLowerCase()) || (a.spellIds ?? [a.spellId]).some((id) => ids.has(id))
  )
}

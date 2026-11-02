'use client'

import WowheadClientIcon from '@/components/cms/WowheadClientIcon'
import { CHECKBOX, HELP, LABEL } from '@/components/admin/ui/styles'
import { buildWowheadUrl } from '@/lib/wowhead/urls'
import { useBossAbilities } from '@/hooks/useBossAbilities'
import { parseAbilityRefs, selectBossAbilities } from '@/lib/bossAbilities'
import type { BossAbilityCast } from '@/types/bossAbilities'

/**
 * Checkbox list of an encounter's boss abilities, like the planner's. Picked
 * abilities are stored by name; refs the current log doesn't have (an id or name
 * typed in the source) stay listed so they aren't dropped on save.
 */
export default function BossAbilityPicker({
  id,
  label,
  encounterId,
  value,
  onChange,
}: {
  id: string
  /** Rendered here rather than by FieldRow so Show all / Hide all can share its line */
  label: string
  encounterId: string
  value: string[]
  onChange: (v: string[]) => void
}) {
  const { data, loading } = useBossAbilities(encounterId)
  const abilities = data?.abilities ?? []
  const refsOf = (ability: BossAbilityCast) =>
    value.filter((v) => selectBossAbilities([ability], parseAbilityRefs([v])).length > 0)
  const unmatched = value.filter(
    (v) => selectBossAbilities(abilities, parseAbilityRefs([v])).length === 0
  )

  const toggle = (ability: BossAbilityCast) => {
    const refs = refsOf(ability)
    onChange(refs.length ? value.filter((v) => !refs.includes(v)) : [...value, ability.name])
  }

  const header = (actions: boolean) => (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className={`${LABEL} mb-0`}>{label}</span>
      {actions && (
        <span className="flex gap-2 text-[.75rem] text-[#8a8a8a]">
          <button
            type="button"
            className="hover:text-white"
            onClick={() => onChange([...unmatched, ...abilities.map((a) => a.name)])}
          >
            Show all
          </button>
          <span aria-hidden>/</span>
          <button type="button" className="hover:text-white" onClick={() => onChange([])}>
            Hide all
          </button>
        </span>
      )}
    </div>
  )

  if (loading || (!abilities.length && !unmatched.length)) {
    return (
      <div id={id}>
        {header(false)}
        <p className={`m-0 ${HELP}`}>
          {loading
            ? 'Loading boss abilities…'
            : data?.warning
              ? `No boss abilities found (${data.warning}).`
              : 'No boss abilities found for this encounter.'}
        </p>
      </div>
    )
  }

  const row = 'flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 hover:bg-[#2a2a2a]'
  return (
    <div id={id}>
      {header(abilities.length > 0)}
      <ul className="m-0 grid list-none grid-cols-1 gap-0.5 rounded-md border border-dg-line-soft p-1.5 sm:grid-cols-2">
        {abilities.map((ability) => (
          <li key={ability.key} className="m-0">
            <label className={row}>
              <input
                type="checkbox"
                checked={refsOf(ability).length > 0}
                onChange={() => toggle(ability)}
                className={CHECKBOX}
              />
              {/* The href only exists so Wowhead's tooltips.js attaches a tooltip; links
                  inside a label don't activate it, so the click toggles here instead */}
              <a
                href={buildWowheadUrl('spell', String(ability.spellId), ability.name)}
                onClick={(e) => {
                  e.preventDefault()
                  toggle(ability)
                }}
                className="h-5 w-5 shrink-0"
              >
                <WowheadClientIcon
                  id={String(ability.spellId)}
                  type="spell"
                  name={ability.name}
                  icon={ability.icon}
                  iconSize={20}
                  noMargin
                  noLink
                />
              </a>
              <span className="truncate text-[.875rem] text-[#e5e5e5]">{ability.name}</span>
              <span className="ml-auto text-[.75rem] text-[#7a7a7a] tabular-nums">
                {ability.timestamps.length}
              </span>
            </label>
          </li>
        ))}
        {unmatched.map((ref) => (
          <li key={`ref-${ref}`} className="m-0">
            <label className={row} title="Not in the current top log for this encounter">
              <input
                type="checkbox"
                checked
                onChange={() => onChange(value.filter((v) => v !== ref))}
                className={CHECKBOX}
              />
              <span className="truncate text-[.875rem] text-[#a3a3a3] italic">{ref}</span>
              <span className="ml-auto text-[.75rem] text-[#7a7a7a]">not in log</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

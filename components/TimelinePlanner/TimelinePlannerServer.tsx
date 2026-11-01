import spellsData from '@/other/timelineSpells.json'
import TimelinePlanner from './TimelinePlanner'
import Wowhead from '../custom/Wowhead'
import { bindings } from '@/lib/talent_handlers/bindings'
import WowheadIcon from '../custom/WowheadIcon'

export default async function TimelinePlannerServer() {
  // Prerender all Wowhead components for cast blocks
  const prerenderedWowheads = spellsData.spells.map((spell) => {
    const component = (
      <WowheadIcon
        id={spell.spellId.toString()}
        noLink
        name={spell.name}
        fill={true}
        iconSize={23}
      />
    )
    return [spell.spellId, component] as const
  })

  // Prerender Wowhead components for bindings/talents
  const prerenderedBindings = bindings.map((binding) => {
    const component = (
      <WowheadIcon
        noLink
        id={binding.spellId.toString()}
        name={binding.label}
        iconSize={33}
        fill={true}
      />
    )
    return [binding.spellId.toString(), component] as const
  })

  // Prerender Wowhead for spell name column (no icon, disabled)
  const prerenderedWowheadNames = spellsData.spells.map((spell) => {
    const component = (
      <Wowhead
        type="spell"
        id={spell.spellId}
        name={spell.name}
        noIcon={false}
        fill={true}
        disabled={false}
        ellipsis={true}
        align="center"
        textColor="#ffffff"
      />
    )
    return [spell.spellId, component] as const
  })

  // Combine all prerendered icons
  const wowheadIcons = Object.fromEntries([...prerenderedWowheads, ...prerenderedBindings])
  const wowheadIconNames = Object.fromEntries(prerenderedWowheadNames)

  return (
    <TimelinePlanner
      spells={spellsData.spells.map((spell) => ({
        ...spell,
        charges: spell.charges || 1,
        can_interrupt: spell.can_interrupt ?? true,
      }))}
      wowheadMap={wowheadIcons}
      wowheadNameMap={wowheadIconNames}
    />
  )
}

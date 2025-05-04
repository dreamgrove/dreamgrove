import spellsData from '../../cursor/spells.json'
import TimelinePlanner from './TimelinePlanner'
import Wowhead from '../custom/Wowhead'

export default function TimelinePlannerServer() {
  // Prerender all Wowhead components for cast blocks
  const prerenderedWowheads = spellsData.spells.map((spell) => {
    const component = (
      <Wowhead
        type="spell"
        id={spell.spellId || spell.id}
        name={spell.name}
        disabled={true}
        ellipsis={true}
        showLabel={false}
      />
    )
    return [spell.id, component] as const
  })

  // Prerender Wowhead for spell name column (no icon, disabled)
  const prerenderedWowheadNames = spellsData.spells.map((spell) => {
    const component = (
      <Wowhead
        type="spell"
        id={spell.spellId || spell.id}
        name={spell.name}
        noIcon={false}
        disabled={false}
        ellipsis={true}
      />
    )
    return [spell.id, component] as const
  })

  const wowheadMap = Object.fromEntries(prerenderedWowheads)
  const wowheadNameMap = Object.fromEntries(prerenderedWowheadNames)

  // Pass spells data and both Wowhead maps to TimelinePlanner
  return (
    <TimelinePlanner
      spells={spellsData.spells}
      wowheadMap={wowheadMap}
      wowheadNameMap={wowheadNameMap}
    />
  )
}

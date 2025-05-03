import spellsData from '../../cursor/spells.json'
import { TimelinePlanner } from './TimelinePlannerReference'
import Wowhead from '../custom/Wowhead'

export default function TimelinePlannerServerReference() {
  // Prerender all Wowhead components for cast blocks
  const prerenderedWowheads = spellsData.spells.map((spell) => {
    const component = (
      <Wowhead
        type="spell"
        id={spell.spellId || spell.id}
        name={spell.name}
        disabled={true}
        ellipsis={true}
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

  // Pass both maps to TimelinePlanner
  return (
    <TimelinePlanner
      spells={spellsData.spells}
      prerenderedWowheads={wowheadMap}
      prerenderedWowheadNames={wowheadNameMap}
    />
  )
}

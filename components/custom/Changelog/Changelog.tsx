import diff from '../../../news/diff.json'
import EntityEntry from './EntityEntry'

export default function Changelog() {
  const specNames = ['Druid', 'Restoration Druid', 'Feral Druid', 'Guardian Druid', 'Balance Druid']

  const specEntries = diff.delta.filter((entity) => entity.name && specNames.includes(entity.name))

  const spellEntries = diff.delta
    .filter((entity) => entity.name && !specNames.includes(entity.name))
    .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))

  return (
    <div>
      {specEntries.map((entity, idx) => (
        <EntityEntry key={idx} entity={entity} />
      ))}
      {spellEntries.map((entity, idx) => (
        <EntityEntry key={idx} entity={entity} />
      ))}
    </div>
  )
}

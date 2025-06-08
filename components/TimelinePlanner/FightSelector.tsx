import React from 'react'

export interface EncounterOption {
  id: string
  name: string
}

interface FightSelectorProps {
  currentEncounterId: string
  onEncounterChange: (encounterId: string) => void
}

export const encounterOptions: EncounterOption[] = [
  { id: 'empty', name: 'Empty' },
  { id: '3009', name: 'Vexie and the Geargrinders' },
  { id: '3010', name: 'Cauldron of Carnage' },
  { id: '3011', name: 'Rik Reverb' },
  { id: '3012', name: 'Stix Bunkjunker' },
  { id: '3013', name: 'Sprocketmonger Lockenstock' },
  { id: '3014', name: 'One-Armed Bandit' },
  { id: '3015', name: "Mug'Zee, Heads of Security" },
  { id: '3016', name: 'Chrome King Gallywix' },
]

export default function FightSelector({
  currentEncounterId,
  onEncounterChange,
}: FightSelectorProps) {
  return (
    <div className="mb-4">
      <label htmlFor="encounter-select" className="mr-2 font-medium">
        Select Encounter:
      </label>
      <select
        id="encounter-select"
        value={currentEncounterId}
        onChange={(e) => onEncounterChange(e.target.value)}
        className="rounded border border-gray-300 bg-white px-3 py-2 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
      >
        {encounterOptions.map((encounter) => (
          <option key={encounter.id} value={encounter.id}>
            {encounter.name}
          </option>
        ))}
      </select>
    </div>
  )
}

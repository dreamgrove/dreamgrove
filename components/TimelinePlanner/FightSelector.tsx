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
  { id: '3470', name: "Nek'zali the Soulcoiler" },
  { id: '3445', name: 'Entombed Sentinels' },
  { id: '3455', name: 'Vashnik the Malignant' },
  { id: '3497', name: 'The Lost Explorers' },
  { id: '3420', name: 'Sszorak' },
  { id: '3421', name: 'The Twin Fangs' },
  { id: '3429', name: 'The Coiled Altar' },
  { id: '3492', name: "Ula'tek" },
]

export default function FightSelector({
  currentEncounterId,
  onEncounterChange,
}: FightSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="encounter-select"
        className="text-[10px] tracking-[0.18em] text-neutral-400 uppercase"
      >
        Encounter
      </label>
      <div className="relative flex-1 sm:max-w-xs">
        <select
          id="encounter-select"
          value={currentEncounterId}
          onChange={(e) => onEncounterChange(e.target.value)}
          className="w-full appearance-none rounded-sm border border-neutral-700/70 bg-black/40 py-1.5 pr-8 pl-3 text-sm text-neutral-100 transition-colors hover:border-orange-500/60 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 focus:outline-none"
        >
          {encounterOptions.map((encounter) => (
            <option key={encounter.id} value={encounter.id} className="bg-neutral-900">
              {encounter.name}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute top-1/2 right-2.5 h-3 w-3 -translate-y-1/2 text-neutral-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  )
}

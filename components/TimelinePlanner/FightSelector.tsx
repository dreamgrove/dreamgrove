import Icon from '@/components/Icon'
import { ENCOUNTERS, type EncounterOption } from '@/data/encounters'

interface FightSelectorProps {
  currentEncounterId: string
  onEncounterChange: (encounterId: string) => void
}

export const encounterOptions: EncounterOption[] = [{ id: 'empty', name: 'Empty' }, ...ENCOUNTERS]

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
        <Icon
          name="chevronDownMini"
          className="pointer-events-none absolute top-1/2 right-2.5 h-3 w-3 -translate-y-1/2 text-neutral-500"
        />
      </div>
    </div>
  )
}

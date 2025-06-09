import { SpellToRender } from '@/types/index'

import { CustomSpell, isCustomSpell } from '@/lib/utils/customSpellStorage'
import CustomSpellIcon from '../CustomSpell/CustomSpellIcon'
import { useTimelineContext } from '../TimelineProvider/useTimelineContext'

export default function SpellNames({
  wowheadNameMap,
}: {
  wowheadNameMap: Record<string, React.ReactNode>
}) {
  const { processedState } = useTimelineContext()
  const spells = processedState.spells
  return (
    <div className="w-[200px] min-w-[120px] shrink-0">
      <div className="mt-5">
        <div className="flex flex-col items-start justify-start pl-2">
          {spells
            .sort((a, b) => a.spell.spellId - b.spell.spellId)
            .map((spellCast) =>
              spellCast.spell.charges > 1 ? (
                <SpellNameWithCharges
                  key={`spell-name-${spellCast.spell.spellId}`}
                  spellCast={spellCast}
                  wowheadNameMap={wowheadNameMap}
                />
              ) : (
                <SpellName
                  key={`spell-name-${spellCast.spell.spellId}`}
                  spellCast={spellCast}
                  wowheadNameMap={wowheadNameMap}
                />
              )
            )}
        </div>
      </div>
    </div>
  )
}

const SpellName = ({
  spellCast,
  wowheadNameMap,
}: {
  spellCast: SpellToRender
  wowheadNameMap: Record<string, React.ReactNode>
}) => {
  const isCustom = isCustomSpell(spellCast.spell)

  return (
    <div
      id={`spell-name-${spellCast.spell.spellId}`}
      className={`my-2 flex w-full flex-col items-center justify-end border-r-2 border-orange-500/50 border-b-orange-500/50 pr-2`}
    >
      <div
        className={`flex h-[40px] w-full flex-row items-center justify-end gap-2 truncate text-center text-sm`}
      >
        {isCustom && (
          <CustomSpellIcon
            spell={spellCast.spell as CustomSpell}
            size="sm"
            className="inline-block"
          />
        )}
        {wowheadNameMap[spellCast.spell.spellId] || spellCast.spell.name}
      </div>
    </div>
  )
}
const SpellNameWithCharges = ({
  spellCast,
  wowheadNameMap,
}: {
  spellCast: SpellToRender
  wowheadNameMap: Record<string, React.ReactNode>
}) => {
  const isCustom = isCustomSpell(spellCast.spell)

  return (
    <div className="mb-2 w-full">
      <div
        id={`spell-name-${spellCast.spell.spellId}-charges`}
        className="mb-[-2px] h-[18px] w-full pt-[2px] pr-[9px] text-right text-[0.8rem] text-orange-300/80 transition-opacity"
      >
        Charges #
      </div>
      <div className="mt-[12px] flex w-full flex-col items-end gap-2 border-r-2 border-orange-500/50 pr-2">
        <div
          id={`spell-name-${spellCast.spell.spellId}`}
          className={`flex h-[38px] w-full flex-row items-center justify-end gap-2 truncate text-right`}
        >
          {isCustom && <CustomSpellIcon spell={spellCast.spell as CustomSpell} size="sm" />}
          {wowheadNameMap[spellCast.spell.spellId] || spellCast.spell.name}
        </div>
        {Array.from({ length: spellCast.chargesUsed - 1 }).map((_, index) => (
          <div
            id={`spell-name-${spellCast.spell.spellId}-${index}`}
            key={`charge-${index}`}
            className="h-10 w-full"
          />
        ))}
      </div>
    </div>
  )
}

import WowheadIcon from './WowheadIcon'

interface SpellIconRowProps {
  spellIds: string[]
  beta?: boolean
}

export default function SpellIconRow({ spellIds, beta = false }: SpellIconRowProps) {
  return (
    <div className="h-[150px] overflow-x-auto overflow-y-hidden">
      <div className="flex h-full flex-row items-center pt-5">
        {spellIds.map((id, index) => (
          <div key={id} className="flex flex-shrink-0 flex-row items-center">
            <WowheadIcon id={id} type="spell" name={`Spell ${id}`} beta={beta} size={50} />
            {index < spellIds.length - 1 && (
              <div className="mx-2 h-[2px] w-8 flex-shrink-0 bg-gray-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

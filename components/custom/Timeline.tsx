import WowheadIcon from './WowheadIcon'

interface TimelineProps {
  spellIds: string[]
  beta?: boolean
}

export default function Timeline({ spellIds, beta = false }: TimelineProps) {
  return (
    <div className="h-[150px] w-full overflow-x-auto overflow-y-hidden">
      <div className="flex h-full w-full flex-row items-center justify-between px-8 pt-5">
        {spellIds.map((id, index) => (
          <div key={`${id}-${index}`} className="relative flex flex-row items-center">
            <div className="flex-shrink-0">
              <WowheadIcon
                id={id}
                type="spell"
                name={`Spell ${id}`}
                beta={beta}
                size={50}
                noMargin
              />
            </div>
            {index < spellIds.length - 1 && (
              <div className="absolute left-[50px] h-[2px] w-[100px] bg-gray-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

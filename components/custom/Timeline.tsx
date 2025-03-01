import WowheadIcon from './WowheadIcon'
import { ReactNode } from 'react'

interface TimelineProps {
  spellIds: string[]
  beta?: boolean
  children?: ReactNode
}

export default function Timeline({ spellIds, beta = false, children }: TimelineProps) {
  return (
    <div>
      {children && <div className="mb-1 mt-4 text-center text-lg font-medium">{children}</div>}
      <div className="h-[150px] w-full overflow-x-auto overflow-y-hidden">
        <div className="flex h-full w-full flex-row items-center justify-between pb-8 pt-1 ">
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
    </div>
  )
}

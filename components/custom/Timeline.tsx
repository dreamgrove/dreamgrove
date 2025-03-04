import WowheadIcon from './WowheadIcon'
import React, { ReactNode } from 'react'
import { useLogger } from '@/components/hooks/useLogger'

interface TimelineProps {
  spellIds: string[]
  beta?: boolean
  children?: ReactNode
}

export default function Timeline({ spellIds, beta = false, children }: TimelineProps) {
  const logger = useLogger('Timeline')

  logger.info(`Rendering Timeline with ${spellIds.length} spells using alternating pattern`)

  return (
    <div>
      {children && <div className="mb-1 mt-4 text-center text-lg font-medium">{children}</div>}
      <div className="h-auto  w-full overflow-x-auto overflow-y-hidden sm:h-[120px] md:h-[130px] lg:h-[150px]">
        <div className="flex h-full w-max flex-row items-center justify-start pb-4 pt-1 sm:pb-6 md:pb-8">
          {spellIds.map((id, index) => (
            <React.Fragment key={`${id}-${index}`}>
              {/* Icon */}
              <div className="flex items-center justify-center">
                <div className="relative z-10 flex-shrink-0 scale-[0.6] sm:scale-[0.8] md:scale-[0.9] lg:scale-100">
                  <WowheadIcon
                    id={id}
                    type="spell"
                    name={`Spell ${id}`}
                    beta={beta}
                    size={50}
                    noMargin
                  />
                </div>
              </div>

              {/* Line divider (only if not the last item) */}
              {index < spellIds.length - 1 && (
                <div className="mx-[-7px] h-[2px] w-[10px] bg-gray-400 sm:mx-[-8px] sm:w-[25px] md:mx-[-10px] md:w-[70px] lg:mx-[-12px] lg:w-[55px]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

import WowheadIcon from './WowheadIcon'
import React, { ReactNode } from 'react'

interface TimelineProps {
  spellIds: string[]
  beta?: boolean
  children?: ReactNode
}

export default function Timeline({ spellIds, beta = false, children }: TimelineProps) {
  // Process spell IDs to count occurrences
  const processedSpells = spellIds.reduce<{ id: string; count: number }[]>((acc, id) => {
    const lastSpell = acc.length > 0 ? acc[acc.length - 1] : null

    // If the current spell ID matches the last one processed, increment its count
    if (lastSpell && lastSpell.id === id) {
      lastSpell.count++
    } else {
      // Otherwise, add as a new entry
      acc.push({ id, count: 1 })
    }
    return acc
  }, [])

  return (
    <div>
      {children && <div className="mt-4 mb-1 text-center text-lg font-medium">{children}</div>}
      <div className="h-auto w-full overflow-x-auto overflow-y-hidden sm:h-[120px] md:h-[130px] lg:h-[150px]">
        <div className="flex h-full w-max flex-row items-center justify-start pt-1">
          {processedSpells.map((spell, index) => (
            <React.Fragment key={`${spell.id}-${index}`}>
              {/* Icon */}
              <div className="flex items-center justify-center">
                <div className="relative z-10 shrink-0 scale-[0.6] sm:scale-[0.8] md:scale-[0.9] lg:scale-100">
                  <WowheadIcon
                    id={spell.id}
                    type="spell"
                    name={`Spell ${spell.id}`}
                    beta={beta}
                    iconSize={50}
                    noMargin
                  />
                  {spell.count > 1 && (
                    <div className="absolute -right-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-600 text-xs font-bold text-white shadow-md">
                      x{spell.count}
                    </div>
                  )}
                </div>
              </div>

              {index < processedSpells.length - 1 && (
                <div className="mx-[-7px] h-[2px] w-[10px] bg-gray-400 sm:mx-[-8px] sm:w-[25px] md:mx-[-10px] md:w-[70px] lg:mx-[-12px] lg:w-[55px]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

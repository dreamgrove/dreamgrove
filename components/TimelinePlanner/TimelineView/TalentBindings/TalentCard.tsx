import React, { useCallback, useState } from 'react'
import { useTimelineContext } from '../../TimelineProvider/useTimelineContext'

// Define proper prop types
interface TalentCardProps {
  id: string
  spellId: number
  name?: string
  radio?: string
  defaultCheck?: boolean
  isText?: boolean
  disabled?: boolean
  isIcon?: boolean
  children?: React.ReactNode
  description?: string
  prerenderedIcon?: React.ReactNode
}

const TalentCard = ({ id, name = '', description = '', prerenderedIcon }: TalentCardProps) => {
  const { toggleTalent } = useTimelineContext()
  const childIcon = prerenderedIcon

  const [checked, setChecked] = useState(false)

  const stateIndicator = (
    <div className="relative w-7">
      <input
        type="checkbox"
        id={`${id}-indicator`}
        checked={checked}
        readOnly
        className="peer sr-only"
      />
      <div className={`block h-4 w-7 rounded-full ${checked ? 'bg-main' : 'bg-[#524943]'}`}></div>
      <div
        className={`absolute top-[2px] left-[2px] h-3 w-3 rounded-full bg-white transition peer-checked:translate-x-full ${
          checked ? 'opacity-100' : 'opacity-70'
        }`}
      ></div>
    </div>
  )

  const handleToggle = useCallback(() => {
    const newValue = !checked
    toggleTalent(id, newValue)
    setChecked(newValue)
  }, [checked, id, toggleTalent])

  return (
    <div className="relative w-full cursor-pointer bg-neutral-950/30 hover:shadow-md hover:shadow-orange-500/10">
      <label className="flex h-full w-full" aria-label={`Toggle ${id}`}>
        <input
          className="absolute top-[-9999px] left-0 z-10 opacity-0 focus:outline-hidden"
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleToggle}
        />
        <div className={`relative flex-1 cursor-pointer overflow-hidden`}>
          <div
            className={`absolute inset-0 h-full w-full origin-bottom border transition-colors duration-300 ${
              checked ? 'border-main animate-clip-up' : 'border-main/20 animate-clip-down'
            }`}
          ></div>

          <div
            className={`text-white-500 flex justify-between gap-2 p-[6px] text-sm leading-tight transition-colors duration-300 ${
              checked ? 'bg-main/40' : 'bg-orange-300/10'
            }`}
          >
            <h3
              className={`transition-colors duration-300 ${checked ? 'text-white-500' : 'text-gray-400'}`}
            >
              {name}
            </h3>
            {stateIndicator}
          </div>
          <div className="line-clamp-3 p-2 text-[0.75rem]">
            {/* Icon */}
            <div
              className={`float-start mr-2 aspect-square h-[calc(2*1lh*0.75-2px)] flex-shrink-0 overflow-hidden transition-all duration-300 ${
                checked ? '' : 'grayscale'
              }`}
            >
              <div className="flex h-full items-center justify-center">
                <div className="relative aspect-square h-full w-auto">{childIcon}</div>
              </div>
            </div>

            {/* Description */}
            <p
              className="trim-cap-alphabetic overflow-clip py-[1px] leading-[1.25] text-gray-300 transition-opacity duration-300"
              style={{
                opacity: checked ? 1 : 0.7,
                marginTop: 0,
              }}
            >
              {description}
            </p>
          </div>
        </div>
      </label>
    </div>
  )
}

export default React.memo(TalentCard)

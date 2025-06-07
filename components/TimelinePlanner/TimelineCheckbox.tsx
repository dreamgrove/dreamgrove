import React, { useCallback, useContext, useEffect, useState } from 'react'
import WowheadClientVersion from '../csm/WowheadClientVersion'
import { FaCheck } from 'react-icons/fa'
import WowheadClientIcon from '../csm/WowheadClientIcon'

// Define proper prop types
interface CheckboxProps {
  id: string
  spellId: number
  name?: string
  radio?: string
  defaultCheck?: boolean
  isText?: boolean
  onToggle: (id: string, checked: boolean) => void
  disabled?: boolean
  isIcon?: boolean
  children?: React.ReactNode
  description?: string
}

const TimelineCheckbox = ({
  id,
  spellId,
  name = '',
  radio = '',
  defaultCheck = false,
  onToggle,
  disabled = true,
  description = '',
}: CheckboxProps) => {
  const childIcon = <WowheadClientIcon type="spell" noLink id={spellId.toString()} name={name} />

  const [checked, setChecked] = useState(defaultCheck)

  const stateIndicator = (
    <div className="relative w-7">
      <input type="checkbox" id="22" checked={checked} readOnly className="peer sr-only" />
      <div className={`block h-4 w-7 rounded-full ${checked ? 'bg-main' : 'bg-[#4e3b2c]'}`}></div>
      <div
        className={`dot dark:bg-dark-4 peer-checked:bg-primary absolute top-[2px] left-[2px] h-3 w-3 rounded-full bg-white transition peer-checked:translate-x-full ${
          checked ? 'opacity-100' : 'opacity-70'
        }`}
      ></div>
    </div>
  )

  const handleToggle = useCallback(() => {
    const newValue = !checked
    onToggle(id, newValue)
    setChecked(newValue)
  }, [checked, id, onToggle])

  return (
    <div className="relative w-full cursor-pointer rounded-sm bg-neutral-950/30 hover:shadow-md hover:shadow-orange-500/10">
      <label className="w-full" aria-label={`Toggle ${id}`}>
        <input
          className="absolute top-[-9999px] left-0 z-10 opacity-0 focus:outline-hidden"
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
        />
        <div className={`relative h-full w-full cursor-pointer overflow-hidden rounded-sm`}>
          <div
            className={`absolute inset-0 origin-bottom rounded-sm border transition-colors duration-300 ${
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
          <div className="p-[6px]">
            <div
              className={`float-start mr-2 mb-1 aspect-square h-[33px] w-[33px] overflow-hidden transition-all duration-300 ${
                checked ? '' : 'grayscale'
              }`}
            >
              <div className="flex h-full w-full items-center justify-center">
                <div className="max-h-[33px] max-w-[33px]">{childIcon}</div>
              </div>
            </div>

            <p
              className="text-[0.78rem] text-gray-300 transition-opacity duration-300"
              style={{
                opacity: checked ? 1 : 0.7,
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

export default React.memo(TimelineCheckbox)

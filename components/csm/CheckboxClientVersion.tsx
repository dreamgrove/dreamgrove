import React, { useCallback, useContext, useEffect, useState } from 'react'
import WowheadClientVersion from './WowheadClientVersion'
import { FaCheck } from 'react-icons/fa'
import { CheckboxContext } from '../custom/CheckboxProvider'

// Define proper prop types
interface CheckboxProps {
  id?: string
  spellId?: string | number
  name?: string
  type?: string
  radio?: string
  defaultCheck?: boolean
  isText?: boolean
  disabled?: boolean
  isIcon?: boolean
  children?: React.ReactNode
}

const Checkbox = ({
  id = '',
  spellId = '',
  name = '',
  type = 'spell',
  radio = '',
  defaultCheck = false,
  disabled = true,
}: CheckboxProps) => {
  const child = <WowheadClientVersion type={type} id={spellId} name={name} disabled={disabled} />

  const [checked, setChecked] = useState(defaultCheck)
  const { checkboxMap, updateCheckbox } = useContext(CheckboxContext)

  useEffect(() => {
    updateCheckbox(id, defaultCheck, radio || null)
  }, [])

  const handleToggle = useCallback(() => {
    const newValue = !checked
    updateCheckbox(id, newValue, radio || null)
    setChecked(newValue)
  }, [checked, id, radio, updateCheckbox])

  useEffect(() => {
    // Update local state when the checkbox state changes in the provider
    if (checkboxMap[id]) {
      setChecked(checkboxMap[id].checked)
    }
  }, [checkboxMap, id])

  return (
    <div style={{ userSelect: 'none', height: '100%' }} className="relative flex h-full w-full">
      <label className="flex h-full w-full" aria-label={`Toggle ${id}`}>
        <input
          className="absolute left-0 top-0 z-10 mr-2 mt-2 h-full w-full cursor-pointer opacity-0 focus:outline-none"
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
        />
        <div className={'h-full w-full flex-1'}>
          <div
            className={`relative flex h-full w-full items-center rounded border-[1px] border-main px-2 py-1.5 sm:px-3 ${
              checked ? 'border-main' : 'border-main/20'
            }`}
          >
            <div className="break-words text-left normal-case leading-tight">{child}</div>

            <div
              className={`absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-main/20 md:bottom-auto md:right-2 md:top-1/2 md:-translate-y-1/2 ${
                checked ? 'block' : 'hidden'
              }`}
            >
              <FaCheck className="text-main" size={12} />
            </div>
          </div>
        </div>
      </label>
    </div>
  )
}

export default React.memo(Checkbox)

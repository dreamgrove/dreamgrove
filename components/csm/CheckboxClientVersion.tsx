import React, { useCallback, useContext, useEffect } from 'react'
import WowheadClientVersion from './WowheadClientVersion'
import { FaCheck } from 'react-icons/fa'
import { CheckboxContext } from '../custom/CheckboxProvider'

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
  // Mirror the server Checkbox: fall back to the spellId when no explicit id is given,
  // so `[*<id>]` conditional rows resolve against the same key the checkbox registers under.
  const checkboxId = id === '' ? spellId.toString() : id

  const child = <WowheadClientVersion type={type} id={spellId} name={name} disabled={disabled} />

  const { checkboxMap, updateCheckbox } = useContext(CheckboxContext)

  // Derive checked state straight from the shared provider (like the server CheckboxToggler),
  // so no local state can drift from checkboxMap and radio-group toggles stay in sync.
  const checked = checkboxMap[checkboxId]?.checked || false

  useEffect(() => {
    if (checkboxMap[checkboxId] === undefined) {
      updateCheckbox(checkboxId, defaultCheck, radio || null)
    }
  }, [checkboxId, defaultCheck, radio, updateCheckbox, checkboxMap])

  const handleToggle = useCallback(() => {
    updateCheckbox(checkboxId, !checked, radio || null)
  }, [checked, checkboxId, radio, updateCheckbox])

  return (
    <div style={{ userSelect: 'none', height: '100%' }} className="relative flex h-full w-full">
      <label className="flex h-full w-full" aria-label={`Toggle ${checkboxId}`}>
        <input
          className="absolute top-0 left-0 z-10 mt-2 mr-2 h-full w-full cursor-pointer opacity-0 focus:outline-hidden"
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
        />
        <div className={'h-full w-full flex-1'}>
          <div
            className={`border-main relative flex h-full w-full items-center rounded border px-2 py-1.5 sm:px-3 ${
              checked ? 'border-main' : 'border-main/20'
            }`}
          >
            <div className="text-left leading-tight break-words normal-case">{child}</div>

            <div
              className={`bg-main/20 absolute right-1 bottom-1 flex h-5 w-5 items-center justify-center rounded-full md:top-1/2 md:right-2 md:bottom-auto md:-translate-y-1/2 ${
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

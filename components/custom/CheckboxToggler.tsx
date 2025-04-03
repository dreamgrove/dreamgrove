'use client'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { CheckboxContext } from './CheckboxProvider'
import clsx from 'clsx'
import { FaCheck } from 'react-icons/fa'

// Define the prop types to make renderChecked optional
interface CheckboxTogglerProps {
  id: string
  defaultCheck?: boolean
  radio?: string
  children: React.ReactNode
  className?: string
  isIcon?: boolean
}

const CheckboxToggler: React.FC<CheckboxTogglerProps> = ({
  id,
  defaultCheck = false,
  radio = '',
  children,
  className = '',
  isIcon = false,
}) => {
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
    <label
      className={clsx('flex h-full', isIcon ? 'h-full w-full' : 'items-start')}
      aria-label={`Toggle ${id}`}
    >
      <input
        className={`mr-2 mt-2 focus:outline-none ${className}`}
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
      />
      <div className={clsx('flex-1', isIcon && 'h-full w-full')}>
        <div
          className={`relative flex h-full w-full items-center rounded border-[1px] border-main px-2 py-1.5 sm:px-3 ${
            checked ? 'border-main' : 'border-main/20'
          }`}
        >
          <div className="break-words text-left normal-case leading-tight">{children}</div>

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
  )
}

export default React.memo(CheckboxToggler)

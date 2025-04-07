'use client'
import React, { useEffect, useContext } from 'react'
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
  // Remove local state and rely only on context
  const { checkboxMap, updateCheckbox } = useContext(CheckboxContext)

  // Initialize checkbox if it doesn't exist yet
  useEffect(() => {
    // Only set if not already in context to avoid redundant updates
    if (checkboxMap[id] === undefined) {
      updateCheckbox(id, defaultCheck, radio || null)
    }
  }, [id, defaultCheck, radio, updateCheckbox, checkboxMap])

  const handleToggle = () => {
    const isCurrentlyChecked = checkboxMap[id]?.checked || false
    updateCheckbox(id, !isCurrentlyChecked, radio || null)
  }

  const isChecked = checkboxMap[id]?.checked || false

  return (
    <label
      className={clsx('flex h-full', isIcon ? 'h-full w-full' : 'items-start')}
      aria-label={`Toggle ${id}`}
    >
      <input
        className={`mr-2 mt-2 focus:outline-none ${className}`}
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
      />
      <div className={clsx('flex-1', isIcon && 'h-full w-full')}>
        <div
          className={`relative flex h-full w-full items-center rounded border-[1px] border-main px-2 py-1.5 sm:px-3 ${
            isChecked ? 'border-main' : 'border-main/20'
          }`}
        >
          <div className="break-words text-left normal-case leading-tight">{children}</div>

          <div
            className={`absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-main/20 md:bottom-auto md:right-2 md:top-1/2 md:-translate-y-1/2 ${
              isChecked ? 'block' : 'hidden'
            }`}
          >
            <FaCheck className="text-main" size={12} />
          </div>
        </div>
      </div>
    </label>
  )
}

export default CheckboxToggler

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
        className={`mt-2 mr-2 focus:outline-hidden ${className}`}
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
      />
      <div className={clsx('flex-1', isIcon && 'h-full w-full')}>
        <div
          className={`relative flex h-full w-full items-center rounded-lg border px-2 py-1.5 transition-all duration-250 ease-out sm:px-3 ${
            isChecked
              ? 'border-main/70 bg-main/[0.07] dark:border-main/50 dark:bg-main/[0.1] shadow-sm'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
          }`}
        >
          <div className="text-left leading-tight break-words normal-case">{children}</div>

          <div
            className={`absolute right-1.5 bottom-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full transition-all duration-250 ease-out md:top-1/2 md:right-2 md:bottom-auto md:-translate-y-1/2 ${
              isChecked ? 'bg-main/20 scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <FaCheck className="text-main" size={10} />
          </div>
        </div>
      </div>
    </label>
  )
}

export default CheckboxToggler

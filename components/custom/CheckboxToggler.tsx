'use client'
import React, { useState, useEffect, useContext } from 'react'
import useToggleText from '../hooks/useToggleText'
import { CheckboxContext } from './CheckboxProvider'
import clsx from 'clsx'

// Define the prop types to make renderChecked optional
interface CheckboxTogglerProps {
  id: string
  defaultCheck?: boolean
  radio?: string
  children: React.ReactNode
  className?: string
  isIcon?: boolean
  checkedContent?: React.ReactNode
  uncheckedContent?: React.ReactNode
}

const CheckboxToggler: React.FC<CheckboxTogglerProps> = ({
  id,
  defaultCheck = false,
  radio = '',
  children,
  className = '',
  isIcon = false,
  checkedContent,
  uncheckedContent,
}) => {
  const [checked, setChecked] = useState(defaultCheck)
  const { checkboxMap, updateCheckbox } = useContext(CheckboxContext)
  const toggleText = useToggleText()

  useEffect(() => {
    // Register the checkbox with the provider
    updateCheckbox(id, defaultCheck, radio || null)
  }, [])

  const handleToggle = () => {
    const newValue = !checked
    updateCheckbox(id, newValue, radio || null)
    setChecked(newValue)
    //toggleText(newValue, id)
  }

  useEffect(() => {
    // Update local state when the checkbox state changes in the provider
    if (checkboxMap[id]) {
      setChecked(checkboxMap[id].checked)
    }
  }, [checkboxMap, id])

  return (
    <label className={clsx('flex h-full', isIcon ? 'h-full w-full' : 'items-start')}>
      <input
        className={`mr-2 mt-2 focus:outline-none ${className}`}
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
      />
      <div className={clsx('flex-1', isIcon && 'h-full w-full')}>
        {checkedContent && uncheckedContent
          ? checked
            ? checkedContent
            : uncheckedContent
          : children}
      </div>
    </label>
  )
}

export default CheckboxToggler

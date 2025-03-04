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
  const { radioGroup, checkRadio, registerCheckbox, toggleCheckbox, checkboxStates } =
    useContext(CheckboxContext)
  const toggleText = useToggleText()
  const logger = console

  useEffect(() => {
    if (radio) {
      registerCheckbox(radio, id, defaultCheck)
    } else {
      toggleCheckbox(id, defaultCheck)
    }

    logger.info(`[CheckboxToggler] Registered ${id} with default state: ${defaultCheck}`, {
      origin: 'components/custom/CheckboxToggler.tsx',
    })
  }, [radio, id, defaultCheck, registerCheckbox, toggleCheckbox])

  const handleToggle = () => {
    const newValue = !checked
    if (radio) {
      checkRadio(radio, newValue ? id : '')
    } else {
      toggleCheckbox(id, newValue)
    }
    setChecked(newValue)
    toggleText(newValue, id)

    logger.info(`[CheckboxToggler] Toggle state for ${id}: ${newValue}`, {
      origin: 'components/custom/CheckboxToggler.tsx',
    })
  }

  useEffect(() => {
    if (radio && radioGroup[radio] !== id) {
      setChecked(false)
    } else if (radio && radioGroup[radio] === id) {
      setChecked(true)
    }
  }, [radioGroup, radio, id])

  useEffect(() => {
    if (checkboxStates[id] !== undefined) {
      setChecked(checkboxStates[id])
      toggleText(checkboxStates[id], id)
    }
  }, [checkboxStates, id, toggleText])

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

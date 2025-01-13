'use client'
import React, { useState, useEffect, useContext } from 'react'
import useToggleText from '../hooks/useToggleText'
import { CheckboxContext } from './CheckboxProvider'

const CheckboxToggler = ({ id, defaultCheck = false, radio = '', children, className = '' }) => {
  const [checked, setChecked] = useState(defaultCheck)
  const { radioGroup, checkRadio, registerCheckbox, toggleCheckbox, checkboxStates } =
    useContext(CheckboxContext)
  const toggleText = useToggleText()

  useEffect(() => {
    if (radio) {
      registerCheckbox(radio, id, defaultCheck)
    } else {
      toggleCheckbox(id, defaultCheck)
    }
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
      toggleText(checkboxStates[id], id) // Apply the logic whenever the state changes
    }
  }, [checkboxStates, id])

  return (
    <label className="flex items-start">
      <input
        className={`mr-2 mt-2 focus:outline-none ${className}`}
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
      />{' '}
      <div className="flex-1">{children}</div>
    </label>
  )
}

export default CheckboxToggler

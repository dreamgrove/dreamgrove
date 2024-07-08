'use client'
import React, { useState, useEffect, useContext } from 'react'
import { CheckboxContext } from './CheckboxProvider'

const toggleText = (state, id) => {
  const elements = document.querySelectorAll<HTMLElement>(`[id^="${id}"]`)
  const negativeElements = document.querySelectorAll<HTMLElement>(`[id^="~${id}"]`)
  elements.forEach((element) => {
    element.style.display = state ? 'list-item' : 'none'
  })
  negativeElements.forEach((element) => {
    element.style.display = state ? 'none' : 'list-item'
  })
}

const CheckboxToggler = ({
  id,
  spellId = '',
  name = '',
  defaultCheck = false,
  radio = '',
  children,
}) => {
  const [checked, setChecked] = useState(defaultCheck)
  const { radioGroup, checkRadio, registerCheckbox } = useContext(CheckboxContext)

  useEffect(() => {
    if (radio) {
      registerCheckbox(radio, id, defaultCheck)
    }
  }, [radio, id, defaultCheck, registerCheckbox])

  const handleToggle = (value) => {
    setChecked(value)
    toggleText(value, id)

    if (radio) {
      checkRadio(radio, value ? id : '')
    }
  }
  useEffect(() => {
    toggleText(checked, id)
  }, [checked])

  useEffect(() => {
    if (radio && radioGroup[radio] !== id) {
      setChecked(false)
    } else if (radio && radioGroup[radio] === id) {
      setChecked(true)
    }
  }, [radioGroup, radio, id])

  return (
    <label>
      <input
        className="align-middle focus:outline-none"
        type="checkbox"
        checked={checked}
        onChange={() => handleToggle(!checked)}
      />{' '}
      {children}
    </label>
  )
}

export default CheckboxToggler

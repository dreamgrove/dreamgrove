'use client'
import React, { createContext, useState, useContext, useCallback } from 'react'

interface CheckboxContextType {
  radioGroup: Record<string, string>
  checkRadio: (radio: string, id: string) => void
  registerCheckbox: (radio: string, id: string, defaultCheck: boolean) => void
}

// Create context with default value
const CheckboxContext = createContext<CheckboxContextType>({
  radioGroup: {},
  checkRadio: () => {},
  registerCheckbox: () => {},
})

// Provider component
export default function CheckboxProvider({ children }) {
  const [radioGroup, setRadioGroup] = useState<Record<string, string>>({})

  const registerCheckbox = useCallback((radio: string, id: string, defaultCheck: boolean) => {
    setRadioGroup((prev) => {
      const updatedRadioGroup = { ...prev }

      // Set the initial checked state
      if (defaultCheck && !updatedRadioGroup[radio]) {
        updatedRadioGroup[radio] = id
      }

      return updatedRadioGroup
    })
  }, [])

  const checkRadio = useCallback((radio: string, id: string) => {
    setRadioGroup((prev) => {
      const updatedRadioGroup = { ...prev }

      // Uncheck all checkboxes in the same radio group
      Object.keys(updatedRadioGroup).forEach((key) => {
        if (key === radio && updatedRadioGroup[key] !== id) {
          updatedRadioGroup[key] = ''
        }
      })

      // Check the current checkbox
      updatedRadioGroup[radio] = id

      return updatedRadioGroup
    })
  }, [])

  return (
    <CheckboxContext.Provider value={{ radioGroup, checkRadio, registerCheckbox }}>
      {children}
    </CheckboxContext.Provider>
  )
}

export { CheckboxProvider, CheckboxContext }

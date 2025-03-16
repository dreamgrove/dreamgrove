'use client'
import React, { createContext, useState, useContext, useCallback } from 'react'

interface CheckboxContextType {
  radioGroup: Record<string, string>
  checkboxStates: Record<string, boolean>
  checkRadio: (radio: string, id: string) => void
  registerCheckbox: (radio: string, id: string, defaultCheck: boolean) => void
  toggleCheckbox: (id: string, state: boolean) => void
}

// Create context with default value
const CheckboxContext = createContext<CheckboxContextType>({
  radioGroup: {},
  checkboxStates: {},
  checkRadio: () => {},
  registerCheckbox: () => {},
  toggleCheckbox: () => {},
})

export default function CheckboxProvider({ children }) {
  const [radioGroup, setRadioGroup] = useState({})
  const [checkboxStates, setCheckboxStates] = useState({})

  const registerCheckbox = useCallback((radio, id, defaultCheck) => {
    if (radio) {
      setRadioGroup((prev) => {
        const updatedRadioGroup = { ...prev }
        if (defaultCheck && !updatedRadioGroup[radio]) {
          updatedRadioGroup[radio] = id
        }
        return updatedRadioGroup
      })
    }

    setCheckboxStates((prev) => ({
      ...prev,
      [id]: defaultCheck,
    }))
  }, [])

  const checkRadio = useCallback(
    (radio, id) => {
      if (radio) {
        setRadioGroup((prev) => ({
          ...prev,
          [radio]: id,
        }))

        setCheckboxStates((prev) => {
          const updatedStates = { ...prev }

          // Only update checkboxes that belong to the same radio group
          Object.keys(prev).forEach((key) => {
            if (prev[key] !== undefined) {
              // Uncheck all in the same group except the one being selected
              updatedStates[key] = key === id ? true : radioGroup[radio] === key ? false : prev[key]
            }
          })

          return updatedStates
        })
      }
    },
    [radioGroup]
  )

  const toggleCheckbox = useCallback((id, state) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [id]: state,
    }))
  }, [])

  return (
    <CheckboxContext.Provider
      value={{ radioGroup, checkboxStates, checkRadio, registerCheckbox, toggleCheckbox }}
    >
      <div className="grid auto-rows-fr grid-cols-2 gap-x-4 gap-y-2">{children}</div>
    </CheckboxContext.Provider>
  )
}

export { CheckboxProvider, CheckboxContext }

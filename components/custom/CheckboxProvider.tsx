'use client'
import React, { createContext, useState, useMemo, useCallback } from 'react'

interface CheckboxItem {
  checked: boolean
  radioGroup: string | null
}

interface CheckboxContextType {
  checkboxMap: Record<string, CheckboxItem>
  updateCheckbox: (id: string, checked: boolean, radioGroup: string | null) => void
}

// Create context with default value
const CheckboxContext = createContext<CheckboxContextType>({
  checkboxMap: {},
  updateCheckbox: () => {},
})

export { CheckboxContext }

export default function CheckboxProvider({ children }) {
  const [checkboxMap, setCheckboxMap] = useState<Record<string, CheckboxItem>>({})

  const updateCheckbox = useCallback((id: string, checked: boolean, radioGroup: string | null) => {
    setCheckboxMap((prevMap) => {
      // If nothing would change, return the same object reference to prevent re-renders
      if (
        prevMap[id]?.checked === checked &&
        prevMap[id]?.radioGroup === radioGroup &&
        (!radioGroup || !checked)
      ) {
        return prevMap
      }

      const newMap = { ...prevMap }

      // If the element doesn't exist, insert it
      if (!newMap[id]) {
        newMap[id] = { checked, radioGroup }
      } else {
        // Update the checked state
        newMap[id].checked = checked

        // If radioGroup is provided, update it
        if (radioGroup !== undefined) {
          newMap[id].radioGroup = radioGroup
        }
      }

      // If this is a radio button and it's being checked
      if (newMap[id].radioGroup && checked) {
        // Set all other elements with the same radioGroup to false
        Object.keys(newMap).forEach((key) => {
          if (key !== id && newMap[key].radioGroup === newMap[id].radioGroup) {
            newMap[key].checked = false
          }
        })
      }

      return newMap
    })
  }, [])

  const contextValue = useMemo(
    () => ({
      checkboxMap,
      updateCheckbox,
    }),
    [checkboxMap, updateCheckbox]
  )

  return (
    <div className="custom-checkbox-provider">
      <CheckboxContext.Provider value={contextValue}>{children}</CheckboxContext.Provider>
    </div>
  )
}

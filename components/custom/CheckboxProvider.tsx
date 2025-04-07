'use client'
import React, { createContext, useState, useCallback } from 'react'

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

  const updateCheckbox = useCallback(
    (id: string, checked: boolean, radioGroup: string | null) => {
      setCheckboxMap((prevMap) => {
        // Fast equality check to prevent unnecessary updates
        if (prevMap[id]?.checked === checked && prevMap[id]?.radioGroup === radioGroup) {
          return prevMap // Return the same reference to prevent re-renders
        }

        // Create a new map object for the update
        const newMap = { ...prevMap }

        // If the element doesn't exist, insert it
        if (!newMap[id]) {
          newMap[id] = { checked, radioGroup }
        } else {
          // Update the checked state
          newMap[id] = {
            ...newMap[id],
            checked,
            // Only update radioGroup if it's provided
            ...(radioGroup !== undefined && { radioGroup }),
          }
        }

        // If this is a radio button and it's being checked
        if (newMap[id].radioGroup && checked) {
          // Set all other elements with the same radioGroup to false
          // Only update those that are currently checked to minimize changes
          Object.keys(newMap).forEach((key) => {
            if (
              key !== id &&
              newMap[key].radioGroup === newMap[id].radioGroup &&
              newMap[key].checked === true
            ) {
              newMap[key] = {
                ...newMap[key],
                checked: false,
              }
            }
          })
        }

        return newMap
      })
    },
    [setCheckboxMap]
  )

  const contextValue = {
    checkboxMap,
    updateCheckbox,
  }

  return (
    <div className="custom-checkbox-provider">
      <CheckboxContext.Provider value={contextValue}>{children}</CheckboxContext.Provider>
    </div>
  )
}

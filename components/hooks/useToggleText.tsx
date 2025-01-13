import { useContext } from 'react'
import { CheckboxContext } from '../custom/CheckboxProvider'

const useToggleText = () => {
  const { checkboxStates } = useContext(CheckboxContext)

  const evaluateCondition = (conditionString) => {
    const conditions = conditionString.split(/(&&|\|\|)/).map((cond) => cond.trim())

    let result = getConditionState(conditions[0])

    for (let i = 1; i < conditions.length; i += 2) {
      const operator = conditions[i]
      const nextCondition = getConditionState(conditions[i + 1])

      if (operator === '&&') {
        result = result && nextCondition
      } else if (operator === '||') {
        result = result || nextCondition
      }
    }

    return result
  }

  const getConditionState = (condition) => {
    const isNegative = condition.startsWith('~')
    const cleanCondition = isNegative ? condition.substring(1) : condition

    const state = checkboxStates[cleanCondition] || false

    return isNegative ? !state : state
  }

  const toggleText = (state, id) => {
    const elements = document.querySelectorAll(`[id^="${id}"]`)
    const negativeElements = document.querySelectorAll(`[id^="~${id}"]`)

    elements.forEach((element) => {
      const conditionString = element.id.split('-')[0]
      const shouldDisplay = evaluateCondition(conditionString)

      if (element instanceof HTMLElement) {
        element.style.display = shouldDisplay ? 'list-item' : 'none'
      }
    })

    negativeElements.forEach((element) => {
      const conditionString = element.id.split('-')[0]
      const shouldDisplay = evaluateCondition(conditionString)

      if (element instanceof HTMLElement) {
        element.style.display = shouldDisplay ? 'list-item' : 'none'
      }
    })
  }

  return toggleText
}

export default useToggleText

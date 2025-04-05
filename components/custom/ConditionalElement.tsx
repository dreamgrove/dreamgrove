'use client'
import React, { useContext } from 'react'
import { CheckboxContext } from './CheckboxProvider'

interface ConditionalElementProps {
  id: string
  children: React.ReactNode
  className?: string
  type?: string
}

/**
 * ConditionalElement component that conditionally renders content based on checkbox state
 *
 * @param id - The ID of the checkbox that controls this element's visibility
 * @param children - The content to render when the checkbox is checked
 * @param className - Optional CSS class name
 */
const ConditionalElement: React.FC<ConditionalElementProps> = ({
  id,
  children,
  className = '',
  type = 'div',
}) => {
  const { checkboxMap } = useContext(CheckboxContext)

  /**
   * Evaluates a single checkbox ID
   * If the ID starts with ~ it means we negate it
   * @param checkboxId - The ID of the checkbox to check
   * @returns boolean indicating if the checkbox is checked
   */
  const evaluateCheckbox = (checkboxId: string): boolean => {
    if (checkboxId.startsWith('~')) {
      return !checkboxMap[checkboxId.slice(1)]?.checked
    }
    return checkboxMap[checkboxId]?.checked || false
  }

  /**
   * Evaluates an expression with OR operators (||)
   * @param expression - Expression with OR operators
   * @returns boolean result of the OR expression
   */
  const evaluateOrExpression = (expression: string): boolean => {
    const parts = expression.split('||').map((part) => part.trim())
    return parts.some((part) => evaluateCheckbox(part))
  }

  /**
   * Evaluates the full expression with AND operators (&&)
   * @param expression - Full expression with AND and OR operators
   * @returns boolean result of the expression
   */
  const evaluateExpression = (expression: string): boolean => {
    const andParts = expression.split('&&').map((part) => part.trim())
    return andParts.every((part) => evaluateOrExpression(part))
  }

  // Evaluate the expression
  const shouldRender = evaluateExpression(id)

  return shouldRender ? children : null
}

export default ConditionalElement

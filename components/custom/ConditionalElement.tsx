'use client'
import React, { useContext, useMemo } from 'react'
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
  const evaluateCheckbox = useMemo(
    () =>
      (checkboxId: string): boolean => {
        if (checkboxId.startsWith('~')) {
          return !checkboxMap[checkboxId.slice(1)]?.checked
        }
        return checkboxMap[checkboxId]?.checked || false
      },
    [checkboxMap]
  )

  /**
   * Evaluates an expression with OR operators (||)
   * @param expression - Expression with OR operators
   * @returns boolean result of the OR expression
   */
  const evaluateOrExpression = useMemo(
    () =>
      (expression: string): boolean => {
        const parts = expression.split('||').map((part) => part.trim())
        return parts.some((part) => evaluateCheckbox(part))
      },
    [evaluateCheckbox]
  )

  /**
   * Evaluates the full expression with AND operators (&&)
   * @param expression - Full expression with AND and OR operators
   * @returns boolean result of the expression
   */
  const evaluateExpression = useMemo(
    () =>
      (expression: string): boolean => {
        const andParts = expression.split('&&').map((part) => part.trim())
        return andParts.every((part) => evaluateOrExpression(part))
      },
    [evaluateOrExpression]
  )

  // Extract all checkbox IDs from the expression to determine dependencies
  const checkboxDependencies = useMemo(() => {
    const deps = new Set<string>()
    const normalizedId = id.replace(/\s+/g, '')

    // Extract all checkbox IDs (with or without ~ prefix)
    const allIds = normalizedId.split(/&&|\|\|/).map((part) => part.trim())

    allIds.forEach((checkboxId) => {
      // Remove ~ prefix if present
      deps.add(checkboxId.startsWith('~') ? checkboxId.slice(1) : checkboxId)
    })

    return deps
  }, [id])

  // Only re-evaluate when relevant checkboxes change
  const shouldRender = useMemo(() => {
    return evaluateExpression(id)
  }, [
    id,
    evaluateExpression,
    // Only include the specific checkboxes this component depends on
    ...Array.from(checkboxDependencies).map((depId) => checkboxMap[depId]?.checked),
  ])

  if (type === 'li') {
    return <li className={`${shouldRender ? 'list-item' : 'hidden'}`}>{children}</li>
  }
  return <div className={`${shouldRender ? 'block' : 'hidden'}`}>{children}</div>
}

export default React.memo(ConditionalElement)

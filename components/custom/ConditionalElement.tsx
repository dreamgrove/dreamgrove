'use client'
import React, { useContext } from 'react'
import { CheckboxContext } from './CheckboxProvider'

interface ConditionalElementProps {
  id: string
  children: React.ReactNode
  className?: string
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
}) => {
  const { checkboxMap } = useContext(CheckboxContext)

  console.log(checkboxMap)

  return <div className={className}>{children}</div>
}

export default ConditionalElement

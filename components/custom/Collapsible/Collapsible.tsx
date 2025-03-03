'use client'
import { useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import styles from './Collapsible.module.css'
import { useLogger } from '@/components/hooks/useLogger'
import { CSSProperties } from 'react'

const Collapsible = ({ title, children, type = 'info' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const logger = useLogger('Collapsible')

  const toggle = () => {
    logger.info(`Collapsible "${title}" ${isOpen ? 'closed' : 'opened'}`)
    setIsOpen(!isOpen)
  }

  // Apply complete border to the content area, including top border
  const contentBorderStyle: CSSProperties = {
    border: `2px solid ${isOpen ? '#9ca3af' : 'transparent'}`,
    borderRadius: '8px', // Round all corners
    boxSizing: 'border-box',
    marginTop: '8px', // Add some space between title and content border
    transition: 'border-color 0.3s ease',
  }

  return (
    <div className="grid">
      <button
        className="flex h-auto w-full cursor-pointer items-center justify-between border-b-2 border-black dark:border-white"
        onClick={toggle}
      >
        <span className="my-2">{title}</span>
        {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        style={isOpen ? contentBorderStyle : undefined}
      >
        <div className="overflow-hidden">
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Collapsible

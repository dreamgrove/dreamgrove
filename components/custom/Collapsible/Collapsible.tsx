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

  return (
    <div className={`grid ${styles.container}`}>
      <button
        className="flex h-auto w-full cursor-pointer items-center justify-between "
        onClick={toggle}
      >
        <span className="my-2 text-lg font-bold">{title}</span>
        {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Collapsible

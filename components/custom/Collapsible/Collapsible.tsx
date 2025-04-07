'use client'
import { useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import styles from './Collapsible.module.css'

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`grid ${styles.container}`}>
      <button
        className="flex h-auto w-full cursor-pointer items-center justify-between px-4"
        onClick={toggle}
      >
        <span className="my-2 text-left text-lg font-bold">{title}</span>
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

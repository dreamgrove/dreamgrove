'use client'
import { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className="mt-3 mb-3 grid overflow-hidden rounded-md border border-gray-200/60 bg-gray-50/40 dark:border-gray-700/40 dark:bg-white/[0.02]"
      style={{ borderLeft: '2px solid rgba(120, 120, 120, 0.3)' }}
    >
      <button
        className="group flex h-auto w-full cursor-pointer items-center justify-between px-4 py-2 transition-colors duration-200"
        onClick={toggle}
      >
        <span className="text-left text-lg font-bold">{title}</span>
        <span
          className={`text-gray-400 transition-transform duration-300 ease-out group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <FaAngleDown />
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="h-px bg-gray-200/50 dark:bg-gray-700/30" />
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Collapsible

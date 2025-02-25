'use client'
import { useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

const Collapsible = ({ title, children, type = 'info' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

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
      >
        <div className="overflow-hidden">
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Collapsible

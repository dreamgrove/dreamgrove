'use client'
import { useState } from 'react'

const Collapsible = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <button onClick={handleToggle} className="mb-2 w-full text-left font-bold">
        {trigger}
      </button>
      {isOpen && <div className="pl-4">{children}</div>}
    </div>
  )
}

export default Collapsible

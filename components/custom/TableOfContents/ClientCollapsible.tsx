'use client'

import { ReactNode, useState } from 'react'
import styles from '../Talents/Talents.module.css'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

interface ClientCollapsibleProps {
  name: string
  children: ReactNode
}

export default function ClientCollapsible({ name, children }: ClientCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false)

  const arrow = !isOpen ? <FaAngleDown /> : <FaAngleUp />

  const handleToggle = () => {
    setIsOpen((x) => !x)
  }

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          width: '100%',
          height: 'auto',
          border: 'none',
          borderBottom: '2px solid white',
          background: 'none',
          padding: 0,
          textAlign: 'left',
          color: 'inherit',
          font: 'inherit',
        }}
      >
        <div className="my-2 text-2xl">{name}</div>
        <span aria-hidden="true">{arrow}</span>
      </button>
      <div className={`mt-2 ${styles.container} ${isOpen ? styles.show : styles.hide}`}>
        {children}
      </div>
    </div>
  )
}

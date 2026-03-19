'use client'

import React, { useState, ReactNode } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { LuSwords } from 'react-icons/lu'
import styles from './Talents.module.css'

interface TalentDropdownProps {
  name?: string
  open?: boolean
  defaultTree?: 'Full' | 'Class' | 'Spec' | 'Hero'
  children: ReactNode
}

export default function TalentsDropdown({
  name,
  open = false,
  defaultTree,
  children,
}: TalentDropdownProps) {
  const [isVisible, setIsVisible] = useState(open)

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev)
  }

  return (
    <div
      className="talentTree my-4 w-full overflow-hidden rounded-md border border-gray-200/60 bg-gray-50/40 dark:border-gray-700/40 dark:bg-white/[0.02]"
      style={{ borderLeft: '2px solid rgba(120, 120, 120, 0.3)' }}
    >
      <button
        onClick={toggleVisibility}
        aria-expanded={isVisible}
        aria-label={`${name || 'Talent Tree'} dropdown`}
        className="group flex h-auto w-full cursor-pointer items-center justify-between px-4 py-2 transition-colors duration-200"
      >
        <span className="talentName flex items-center text-left text-lg font-bold select-none">
          <LuSwords className="mr-2 opacity-50" />
          {name || 'Talent Tree'}
        </span>
        <span
          className={`text-gray-400 transition-transform duration-300 ease-out group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 ${
            isVisible ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <FaAngleDown />
        </span>
      </button>
      <div
        className={`${styles.container} ${isVisible ? styles.show : styles.hide}`}
        style={{ backgroundColor: '#282828', width: '100%', overflow: 'hidden' }}
      >
        <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

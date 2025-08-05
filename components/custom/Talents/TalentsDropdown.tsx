'use client'

import React, { useState, ReactNode, memo } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
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
  const arrow = !isVisible ? <FaAngleDown /> : <FaAngleUp />

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev)
  }

  return (
    <div className={`talentTree my-4 w-full ${styles.borderContainer}`}>
      <div
        onClick={toggleVisibility}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleVisibility()
            e.preventDefault()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isVisible}
        aria-label={`${name || 'Talent Tree'} dropdown`}
        className="flex h-auto cursor-pointer items-center justify-between px-2"
      >
        <div className="talentName my-2 flex items-center text-left text-lg font-bold select-none">
          <LuSwords className="mr-2" />
          {name || 'Talent Tree'}
        </div>
        {arrow}
      </div>
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

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'
import { IoIosArrowDown } from 'react-icons/io'
import { IoIosArrowUp } from 'react-icons/io'

import { useRef, useState } from 'react'
import styles from './HeroTalents.module.css'

function HeroTalentsHeader({ title, id, children }) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const arrow = !isCollapsed ? (
    <IoIosArrowDown className="block h-10 w-10 text-lg" />
  ) : (
    <IoIosArrowUp className="block h-10 w-10 text-lg" />
  )

  return (
    <>
      <div
        className={`mb-2 rounded-md border-4 ${id == 'kotg' ? styles['border-balance'] : styles['border-resto']}`}
      >
        <div
          className={`flex cursor-pointer justify-between p-4 transition-colors duration-500 ${
            id == 'kotg' ? styles['bg-fade-resto'] : styles['bg-fade-balance']
          }`}
          onClick={() => setIsCollapsed((x) => !x)}
        >
          <h3 className="mb-2 mt-2 text-left align-baseline text-xl font-bold">{title}</h3>
          {arrow}
        </div>
        <div
          ref={contentRef}
          className={`px-8 transition-all duration-300 ease-in-out`}
          style={{
            maxHeight: !isCollapsed ? '0' : `${contentRef.current?.scrollHeight}px`,
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default HeroTalentsHeader

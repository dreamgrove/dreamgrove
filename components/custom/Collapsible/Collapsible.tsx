'use client'
import { useState, useRef } from 'react'
import styles from './Collapsible.module.css'

import { FaAngleDown } from 'react-icons/fa'
import { FaAngleUp } from 'react-icons/fa'

const Collapsible = ({ title, children, type = 'info' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const toggle = () => setIsOpen(!isOpen)

  const arrow = !isOpen ? <FaAngleDown /> : <FaAngleUp />

  let color = ''
  let hoverColor = ''

  if (type == 'added') {
    color = 'bg-green-800/50'
    hoverColor = 'hover:bg-green-700/50'
  } else if (type == 'modified') {
    color = 'bg-yellow-800/40'
    hoverColor = 'hover:bg-yellow-700/40'
  }

  return (
    <div className={` cursor-pointer items-center  `}>
      <button
        className="flex h-auto w-full cursor-pointer items-center justify-between border-b-2 border-black dark:border-white"
        onClick={toggle}
      >
        <span className="my-2">{title}</span>
        {arrow}
      </button>
      <div
        className={`${styles.contentWrapper} transition-max-height overflow-hidden duration-300 ease-out`}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0',
        }}
      >
        <div className={`p-4 ${styles.content}`} ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Collapsible

'use client'
import { useState, useRef } from 'react'
import styles from './Collapsible.module.css'

const Collapsible = ({ title, children, type = 'modified' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const toggle = () => setIsOpen(!isOpen)

  let color = 'bg-yellow-800/40'
  let hoverColor = 'hover:bg-yellow-700/40'

  if (type == 'added') {
    color = 'bg-green-800/50'
    hoverColor = 'hover:bg-green-700/50'
  }

  return (
    <div className={`mb-4 rounded border  border-gray-300 ${styles.collapsible}`}>
      <button
        className={`w-full ${color} p-4 text-left transition ${hoverColor} ${styles.title}`}
        onClick={toggle}
      >
        {title}
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

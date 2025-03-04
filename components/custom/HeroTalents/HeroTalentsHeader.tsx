/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useState } from 'react'
import styles from './HeroTalents.module.css'

interface HeroTalentsHeaderProps {
  title: string
  id: string
  children: React.ReactNode
  titleClassName?: string
}

function HeroTalentsHeader({ title, id, children }: HeroTalentsHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const arrow = isCollapsed ? (
    <IoIosArrowDown className="block h-10 w-10 text-lg" />
  ) : (
    <IoIosArrowUp className="block h-10 w-10 text-lg" />
  )

  const getBorderStyle = () => {
    if (id === 'kotg') return styles['border-balance']
    if (id === 'ec') return styles['border-resto']
    return styles['border-generic']
  }

  const getBackgroundStyle = () => {
    if (id === 'kotg') return styles['bg-fade-resto']
    if (id === 'ec') return styles['bg-fade-balance']
    return styles['bg-fade-generic']
  }

  return (
    <div className={`mb-2 mt-2 grid rounded-md border-4 ${getBorderStyle()}`}>
      <div
        className={`flex cursor-pointer justify-between p-4 transition-colors duration-500 ${getBackgroundStyle()}`}
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <h3 className={`mb-2 mt-2 text-left align-baseline text-xl font-bold`}>{title}</h3>
        {arrow}
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default HeroTalentsHeader

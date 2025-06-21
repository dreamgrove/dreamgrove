'use client'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useState } from 'react'
import styles from './HeroTalents.module.css'
interface HeroTalentsHeaderProps {
  title: string
  id: string
  children?: React.ReactNode
  titleClassName?: string
}

export default function HeroTalents({ title, id, children }: HeroTalentsHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const arrow = isCollapsed ? (
    <IoIosArrowDown className="block h-10 w-10 text-lg" />
  ) : (
    <IoIosArrowUp className="block h-10 w-10 text-lg" />
  )

  const borderStyle = () => {
    if (id === 'kotg') return styles['border-balance']
    if (id === 'ec') return styles['border-resto']
    if (id === 'dotc') return styles['border-dotc']
    return styles['border-generic']
  }

  const backgroundColorStyle = () => {
    if (id === 'kotg') return 'bg-[#1841181A]'
    if (id === 'ec') return 'bg-[#4b62be1A]'
    if (id === 'dotc') return 'bg-[#c41e3a1A]'
    return 'bg-[#d57f431A]'
  }

  return (
    <div
      className={`talentTree mt-2 mb-2 grid rounded-md border-2 ${borderStyle()} ${backgroundColorStyle()}`}
    >
      <div
        className="flex cursor-pointer justify-between p-3 transition-colors duration-500 md:p-4"
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <h3
          className={`mt-2 mb-2 pl-0 text-left align-baseline text-xl font-bold select-none sm:pl-2`}
        >
          {title}
        </h3>
        {arrow}
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="overflow-hidden">
          {/* Use content if provided, otherwise use children */}
          <div className="px-2 md:px-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

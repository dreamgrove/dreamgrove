'use client'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useState, useMemo, memo } from 'react'
import styles from './HeroTalents.module.css'
interface HeroTalentsHeaderProps {
  title: string
  id: string
  children: React.ReactNode
  titleClassName?: string
}

export default function HeroTalent({ title, id, children }: HeroTalentsHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  // Memoize the arrow to prevent recreating it on each render
  const arrow = useMemo(
    () =>
      isCollapsed ? (
        <IoIosArrowDown className="block h-10 w-10 text-lg" />
      ) : (
        <IoIosArrowUp className="block h-10 w-10 text-lg" />
      ),
    [isCollapsed]
  )

  // Memoize style computation to prevent recalculation on every render
  const borderStyle = useMemo(() => {
    if (id === 'kotg') return styles['border-balance']
    if (id === 'ec') return styles['border-resto']
    if (id === 'dotc') return styles['border-dotc']
    return styles['border-generic']
  }, [id])

  const backgroundColorStyle = useMemo(() => {
    if (id === 'kotg') return 'bg-[#184118] bg-opacity-10'
    if (id === 'ec') return 'bg-[#4b62be] bg-opacity-10'
    if (id === 'dotc') return 'bg-[#c41e3a] bg-opacity-10'
    return 'bg-[#d57f43] bg-opacity-10'
  }, [id])

  return (
    <div
      className={`talentTree mb-2 mt-2 grid rounded-md border-2 ${borderStyle} ${backgroundColorStyle}`}
    >
      <div
        className="flex cursor-pointer justify-between p-3 transition-colors duration-500 md:p-4"
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <h3
          className={`mb-2 mt-2 select-none pl-0 text-left align-baseline text-xl font-bold sm:pl-2`}
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
          {/* Wrap content in our special wrapper that preserves component references */}
          <div className="px-2 md:px-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

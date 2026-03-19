'use client'
import { IoIosArrowDown } from 'react-icons/io'
import { useState } from 'react'

interface HeroTalentsHeaderProps {
  title: string
  id: string
  children?: React.ReactNode
  titleClassName?: string
}

const specConfig: Record<string, { borderColor: string; bg: string; bottomBorder: string }> = {
  kotg: {
    borderColor: '#2d6b2d',
    bg: 'rgba(24, 65, 24, 0.06)',
    bottomBorder: 'rgba(24, 65, 24, 0.2)',
  },
  ec: {
    borderColor: '#4b62be',
    bg: 'rgba(75, 98, 190, 0.06)',
    bottomBorder: 'rgba(75, 98, 190, 0.2)',
  },
  dotc: {
    borderColor: '#c41e3a',
    bg: 'rgba(196, 30, 58, 0.06)',
    bottomBorder: 'rgba(196, 30, 58, 0.2)',
  },
  generic: {
    borderColor: '#d57f43',
    bg: 'rgba(213, 127, 67, 0.05)',
    bottomBorder: 'rgba(213, 127, 67, 0.15)',
  },
}

export default function HeroTalents({ title, id, children }: HeroTalentsHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const config = specConfig[id] || specConfig.generic

  return (
    <div
      className="talentTree mt-4 mb-4 grid overflow-hidden rounded-md"
      style={{
        borderLeft: `3px solid ${config.borderColor}`,
        borderBottom: `1px solid ${config.bottomBorder}`,
        borderRight: `1px solid ${config.bottomBorder}`,
        borderTop: `1px solid ${config.bottomBorder}`,
        background: config.bg,
      }}
    >
      {/* Header */}
      <div
        className="group flex cursor-pointer items-center gap-3 py-2.5 pr-3 pl-3 transition-colors duration-200"
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <h3 className="mt-0 mb-0 flex-1 text-left text-lg leading-snug font-bold select-none">
          {title}
        </h3>
        <span
          className={`shrink-0 text-gray-400 transition-transform duration-300 ease-out group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 ${
            isCollapsed ? 'rotate-0' : 'rotate-180'
          }`}
        >
          <IoIosArrowDown className="block h-5 w-5" />
        </span>
      </div>

      {/* Content area */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="overflow-hidden">
          {/* Separator line between header and content */}
          <div
            className="h-px"
            style={{
              background: `linear-gradient(to right, ${config.borderColor}30, ${config.bottomBorder}, transparent)`,
            }}
          />
          <div className="px-3 pt-3 pb-1 md:px-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

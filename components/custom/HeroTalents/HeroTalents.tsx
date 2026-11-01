'use client'
import Icon from '@/components/Icon'
import { useState } from 'react'

interface HeroTalentsHeaderProps {
  title: string
  id: string
  children?: React.ReactNode
  titleClassName?: string
}

const specConfig: Record<string, { borderColor: string; bg: string; bottomBorder: string }> = {
  kotg: {
    borderColor: '#3f9a3f',
    bg: 'rgba(63, 154, 63, 0.07)',
    bottomBorder: 'rgba(63, 154, 63, 0.3)',
  },
  ec: {
    borderColor: '#4b62be',
    bg: 'rgba(75, 98, 190, 0.08)',
    bottomBorder: 'rgba(75, 98, 190, 0.3)',
  },
  dotc: {
    borderColor: '#c41e3a',
    bg: 'rgba(196, 30, 58, 0.08)',
    bottomBorder: 'rgba(196, 30, 58, 0.3)',
  },
  generic: {
    borderColor: '#d57f43',
    bg: 'rgba(213, 127, 67, 0.07)',
    bottomBorder: 'rgba(213, 127, 67, 0.25)',
  },
}

export default function HeroTalents({ title, id, children }: HeroTalentsHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const config = specConfig[id] || specConfig.generic

  return (
    <div
      className="talentTree mt-4 mb-4 grid overflow-hidden rounded-md"
      style={{
        border: `1px solid ${config.bottomBorder}`,
        background: config.bg,
      }}
    >
      {/* Header */}
      <h3 className="mt-0 mb-0">
        <button
          type="button"
          className="group flex w-full cursor-pointer items-center gap-3 py-2.5 pr-3 pl-3 transition-colors duration-200"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-expanded={!isCollapsed}
        >
          <span className="flex-1 text-left text-lg leading-snug font-bold select-none">
            {title}
          </span>
          <span
            aria-hidden="true"
            className={`shrink-0 text-gray-400 transition-transform duration-300 ease-out group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 ${
              isCollapsed ? 'rotate-0' : 'rotate-180'
            }`}
          >
            <Icon name="arrowDown" className="block h-5 w-5" />
          </span>
        </button>
      </h3>

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

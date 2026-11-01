import Icon from '@/components/Icon'
import { useCallback, useRef, useState } from 'react'
import type { DruidSpec } from '@/types/timeline'
import { useTimelineContext } from '../TimelineProvider/useTimelineContext'
import { useOutsideClick } from '@/hooks/useOutsideClick'

export default function SpecSelector() {
  const { currentSpec, setCurrentSpec } = useTimelineContext()
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="mb-2 flex items-center gap-3">
          <CustomDropdown
            value={currentSpec}
            onChange={setCurrentSpec}
            options={[
              { value: 'all', label: 'All Specs' },
              { value: 'balance', label: 'Balance' },
              { value: 'resto', label: 'Restoration' },
              { value: 'feral', label: 'Feral' },
              { value: 'guardian', label: 'Guardian' },
            ]}
          />
        </div>
        <div className="inline-flex flex-row items-center gap-2 self-end pb-1 text-[0.8rem] text-gray-400">
          <span>
            developed by:{' '}
            <a
              href="https://github.com/thevinter/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-main"
            >
              vinter
            </a>
          </span>
          {' - '}
          <span>v.0.2.0</span>
        </div>
      </div>
      {currentSpec === 'all' && (
        <div className="my-2 rounded-sm border border-yellow-500/20 bg-yellow-500/10 p-2 text-sm">
          <p>⚠️ Mixing spells between specs might produce unexpected results. Use with caution.</p>
        </div>
      )}
      {currentSpec === 'guardian' && (
        <div className="my-2 rounded-sm border border-yellow-500/20 bg-yellow-500/10 p-2 text-sm">
          <p>⚠️ Guardian is not yet supported.</p>
        </div>
      )}
    </>
  )
}

interface DropdownOption {
  value: DruidSpec
  label: string
}

interface CustomDropdownProps {
  value: DruidSpec
  onChange: (value: DruidSpec) => void
  options: DropdownOption[]
}

function CustomDropdown({ value, onChange, options }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  const close = useCallback(() => setIsOpen(false), [])
  useOutsideClick(dropdownRef, close, isOpen)

  const handleOptionClick = (optionValue: DruidSpec) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div id="spec-selector" ref={dropdownRef} className="relative min-w-[15rem]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-sm border border-neutral-600/60 bg-neutral-900/60 px-3 py-2 text-lg text-white transition-all duration-200 hover:border-orange-400/50 hover:bg-neutral-800/80 focus:bg-neutral-800/80 focus:ring-0 focus:ring-orange-400/30 focus:outline-none"
      >
        <span className="text-sm">{selectedOption?.label}</span>
        <Icon
          name="chevronDownOutline"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-sm border border-neutral-600/60 bg-neutral-900/95 shadow-lg backdrop-blur-sm">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 first:rounded-t-sm last:rounded-b-sm hover:text-orange-300 ${
                option.value === value ? 'bg-orange-400/20 text-orange-300' : 'text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

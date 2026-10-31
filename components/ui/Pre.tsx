'use client'

import Icon from '@/components/Icon'
import { useRef, useState } from 'react'

const Pre = ({ children }: { children: React.ReactNode }) => {
  const textInput = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    setCopied(true)
    navigator.clipboard.writeText(textInput.current?.textContent ?? '')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      ref={textInput}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setCopied(false)
      }}
      className="relative"
    >
      {hovered && (
        <button
          aria-label="Copy code"
          className={`absolute top-2 right-2 h-8 w-8 rounded-sm border-2 bg-gray-700 p-1 dark:bg-gray-800 ${
            copied
              ? 'border-green-400 focus:border-green-400 focus:outline-hidden'
              : 'border-gray-300'
          }`}
          onClick={onCopy}
        >
          <Icon
            name={copied ? 'copied' : 'copy'}
            className={`h-full w-full ${copied ? 'text-green-400' : 'text-gray-300'}`}
          />
        </button>
      )}
      <pre>{children}</pre>
    </div>
  )
}

export default Pre

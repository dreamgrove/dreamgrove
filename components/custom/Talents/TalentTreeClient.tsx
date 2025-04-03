'use client'

import { useState, useEffect } from 'react'

interface TalentTreeClientProps {
  classTree: React.ReactNode
  specTree: React.ReactNode
  heroTree: React.ReactNode
  talentString: string
  viewOnly?: boolean
}

export default function TalentTreeClient({
  classTree,
  specTree,
  heroTree,
  talentString,
  viewOnly = false,
}: TalentTreeClientProps) {
  const [activeTree, setActiveTree] = useState('full')
  const [copyButtonText, setCopyButtonText] = useState('Copy Talent String')
  const [isMobile, setIsMobile] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  // Handle mobile detection
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // If mobile, set active tree to 'class' on initial load
      if (mobile) {
        setActiveTree('class')
      }
    }

    // Check on mount
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile, { passive: true } as AddEventListenerOptions)

    // Cleanup
    return () =>
      window.removeEventListener('resize', checkIfMobile, {
        passive: true,
      } as AddEventListenerOptions)
  }, [])

  // Set default view to 'class' on mobile
  useEffect(() => {
    if (isMobile && activeTree === 'full') {
      setActiveTree('class')
    }
  }, [isMobile, activeTree])

  const handleCopyTalentString = async () => {
    try {
      setCopyError(null)
      await navigator.clipboard.writeText(talentString)
      setCopyButtonText('Copied!')
      setTimeout(() => {
        setCopyButtonText('Copy Talent String')
      }, 2000)
    } catch (error) {
      console.error('Failed to copy talent string:', error)
      setCopyButtonText('Failed to copy')
      setCopyError('Failed to copy talent string to clipboard. Please try again or copy manually.')
      setTimeout(() => {
        setCopyButtonText('Copy Talent String')
        setCopyError(null)
      }, 3000)
    }
  }

  // Calculate the width classes based on which trees are visible
  const getWidthClass = () => {
    if (activeTree === 'full') {
      // Class and Spec get 40% each, Hero gets 20%
      return {
        classWidth: 'w-[9/19]',
        specWidth: 'w-[3/19]',
        heroWidth: 'w-[7/19]',
      }
    } else {
      // 100% for a single tree
      return {
        classWidth: 'w-full',
        specWidth: 'w-full',
        heroWidth: 'w-full',
      }
    }
  }

  const { classWidth, specWidth, heroWidth } = getWidthClass()

  return (
    <div className="grid-co flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTree('full')}
          className={`rounded px-3 py-1 ${
            activeTree === 'full'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          } ${isMobile ? 'hidden' : ''}`}
        >
          Full
        </button>
        <button
          onClick={() => setActiveTree('class')}
          className={`rounded px-3 py-1 ${
            activeTree === 'class'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          }`}
        >
          Class
        </button>
        <button
          onClick={() => setActiveTree('spec')}
          className={`rounded px-3 py-1 ${
            activeTree === 'spec'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          }`}
        >
          Spec
        </button>
        <button
          onClick={() => setActiveTree('hero')}
          className={`rounded px-3 py-1 ${
            activeTree === 'hero'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          }`}
        >
          Hero
        </button>
      </div>

      {copyError && (
        <div className="rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700">
          {copyError}
        </div>
      )}

      <div className="relative">
        {activeTree === 'full' && (
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
            <div className={`${isMobile ? 'w-full' : classWidth}`}>{classTree}</div>
            <div className={`${isMobile ? 'w-full' : heroWidth}`}>{heroTree}</div>
            <div className={`${isMobile ? 'w-full' : specWidth}`}>{specTree}</div>
          </div>
        )}
        {activeTree === 'class' && <div className="w-full">{classTree}</div>}
        {activeTree === 'spec' && <div className="w-full">{specTree}</div>}
        {activeTree === 'hero' && <div className="w-full">{heroTree}</div>}
      </div>

      {/* Add button to copy talent string at the bottom */}
      {!viewOnly && talentString && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleCopyTalentString}
            className={`rounded-md px-4 py-2 text-white transition-all duration-300 ${
              copyButtonText === 'Copied!'
                ? 'scale-105 animate-pulse bg-yellow-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {copyButtonText}
          </button>
        </div>
      )}
    </div>
  )
}

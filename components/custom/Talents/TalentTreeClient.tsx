'use client'

import { useState, useEffect } from 'react'

interface TalentTreeClientProps {
  classTree: React.ReactNode
  specTree: React.ReactNode
  heroTree: React.ReactNode
  talentString: string
  viewOnly?: boolean
  comment?: string
  children?: React.ReactNode
  defaultTree?: 'Full' | 'Class' | 'Spec' | 'Hero'
}

const TalentTreeClient = ({
  classTree,
  specTree,
  heroTree,
  talentString,
  viewOnly = false,
  comment,
  children,
  defaultTree = 'Full',
}: TalentTreeClientProps) => {
  const [activeTree, setActiveTree] = useState(() => {
    // Convert the defaultTree prop to the internal state format
    switch (defaultTree) {
      case 'Full':
        return 'full'
      case 'Class':
        return 'class'
      case 'Spec':
        return 'spec'
      case 'Hero':
        return 'hero'
      default:
        return 'full'
    }
  })
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

  const setFullTree = () => setActiveTree('full')
  const setClassTree = () => setActiveTree('class')
  const setSpecTree = () => setActiveTree('spec')
  const setHeroTree = () => setActiveTree('hero')

  const classWidth = 'w-[9/19]'
  const specWidth = 'w-[7/19]'
  const heroWidth = 'w-[3/19]'

  const fullTreeView = (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
      <div className={classWidth}>{classTree}</div>
      <div className={heroWidth}>{heroTree}</div>
      <div className={specWidth}>{specTree}</div>
    </div>
  )

  const classTreeView = <div className="w-full">{classTree}</div>
  const specTreeView = <div className="w-full">{specTree}</div>
  const heroTreeView = <div className="w-full">{heroTree}</div>

  return (
    <div className="grid-co flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={setFullTree}
          className={`rounded px-3 py-1 ${
            activeTree === 'full'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          } ${isMobile ? 'hidden' : ''}`}
        >
          Full
        </button>
        <button
          onClick={setClassTree}
          className={`rounded px-3 py-1 ${
            activeTree === 'class'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          }`}
        >
          Class
        </button>
        <button
          onClick={setSpecTree}
          className={`rounded px-3 py-1 ${
            activeTree === 'spec'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          }`}
        >
          Spec
        </button>
        <button
          onClick={setHeroTree}
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

      {(comment || children) && (
        <div className="not-prose text-md my-0 py-0">
          {comment}
          {children}
        </div>
      )}

      <div className="relative">
        {activeTree === 'full' && fullTreeView}
        {activeTree === 'class' && classTreeView}
        {activeTree === 'spec' && specTreeView}
        {activeTree === 'hero' && heroTreeView}
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

export default TalentTreeClient

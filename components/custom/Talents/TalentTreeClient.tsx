'use client'

import { useState, useEffect, useContext } from 'react'
import TalentTreeView from './TalentTreeView'
import type { TreeView } from './TalentTreeModel'
import { TalentsOpenedContext } from './TalentsDropdown'
import { talentStrings } from './strings'
import type { PageLocale } from '@/lib/pageLocale'

interface TalentTreeClientProps {
  classTree: TreeView
  specTree: TreeView
  heroTree: TreeView
  talentString: string
  viewOnly?: boolean
  comment?: string
  children?: React.ReactNode
  defaultTree?: 'Full' | 'Class' | 'Spec' | 'Hero'
  hideCopy?: boolean
  forceTree?: 'full' | 'class' | 'spec' | 'hero'
  locale?: PageLocale
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
  hideCopy = false,
  forceTree,
  locale,
}: TalentTreeClientProps) => {
  const t = talentStrings(locale)
  const [activeTree, setActiveTree] = useState(() => {
    if (forceTree) return forceTree
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
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [isMobile, setIsMobile] = useState(false)
  const hasOpened = useContext(TalentsOpenedContext)

  // Handle mobile detection and default to 'class' view on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile && !forceTree) {
        setActiveTree((prev) => (prev === 'full' ? 'class' : prev))
      }
    }

    checkIfMobile()

    window.addEventListener('resize', checkIfMobile, { passive: true } as AddEventListenerOptions)
    return () =>
      window.removeEventListener('resize', checkIfMobile, {
        passive: true,
      } as AddEventListenerOptions)
  }, [forceTree])

  const handleCopyTalentString = async () => {
    try {
      await navigator.clipboard.writeText(talentString)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch (error) {
      console.error('Failed to copy talent string:', error)
      setCopyState('failed')
      setTimeout(() => setCopyState('idle'), 3000)
    }
  }

  const setFullTree = () => setActiveTree('full')
  const setClassTree = () => setActiveTree('class')
  const setSpecTree = () => setActiveTree('spec')
  const setHeroTree = () => setActiveTree('hero')

  const classWidth = 'w-[9/19]'
  const specWidth = 'w-[7/19]'
  const heroWidth = 'w-[3/19]'

  const renderTree = (tree: TreeView, className: string) => (
    <div className={className}>
      <TalentTreeView tree={tree} locale={locale} />
    </div>
  )

  return (
    <div className="grid-co flex flex-col gap-4">
      {!forceTree && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={setFullTree}
            className={`rounded px-3 py-1 ${
              activeTree === 'full'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            } ${isMobile ? 'hidden' : ''}`}
          >
            {t.full}
          </button>
          <button
            onClick={setClassTree}
            className={`rounded px-3 py-1 ${
              activeTree === 'class'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            {t.class}
          </button>
          <button
            onClick={setSpecTree}
            className={`rounded px-3 py-1 ${
              activeTree === 'spec'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            {t.spec}
          </button>
          <button
            onClick={setHeroTree}
            className={`rounded px-3 py-1 ${
              activeTree === 'hero'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            {t.hero}
          </button>
        </div>
      )}

      {copyState === 'failed' && (
        <div className="rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700">
          {t.copyFailedDetail}
        </div>
      )}

      {(comment || children) && (
        <div className="not-prose text-md my-0 py-0">
          {comment}
          {children}
        </div>
      )}

      <div className="relative">
        {hasOpened && activeTree === 'full' && (
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
            {renderTree(classTree, classWidth)}
            {renderTree(heroTree, heroWidth)}
            {renderTree(specTree, specWidth)}
          </div>
        )}
        {hasOpened && activeTree === 'class' && renderTree(classTree, 'w-full')}
        {hasOpened && activeTree === 'spec' && renderTree(specTree, 'w-full')}
        {hasOpened && activeTree === 'hero' && renderTree(heroTree, 'w-full')}
      </div>

      {/* Add button to copy talent string at the bottom */}
      {!hideCopy && !viewOnly && talentString && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleCopyTalentString}
            className={`rounded-md px-4 py-2 text-white transition-all duration-300 ${
              copyState === 'copied'
                ? 'scale-105 animate-pulse bg-yellow-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {copyState === 'copied' ? t.copied : copyState === 'failed' ? t.copyFailed : t.copy}
          </button>
        </div>
      )}
    </div>
  )
}

export default TalentTreeClient

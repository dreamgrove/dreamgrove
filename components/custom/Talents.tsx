/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { FaAngleUp } from 'react-icons/fa'
import { LuSwords } from 'react-icons/lu'

import { useLogger } from '@/components/hooks/useLogger'
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver'
import TalentTree from '@/components/custom/TalentTree'

import styles from './Talents.module.css'

// Memoize the TalentTree component to prevent unnecessary re-renders
const MemoizedTalentTree = React.memo(
  ({ talents }: { talents: string }) => (
    <div className="p-4">
      <TalentTree viewOnly={true} talents={talents} />
    </div>
  ),
  (prevProps, nextProps) => prevProps.talents === nextProps.talents
)

// Add display name for debugging
MemoizedTalentTree.displayName = 'MemoizedTalentTree'

export default function Talents({ name, talents, mimiron = false, open = false }) {
  const [isVisible, setIsVisible] = useState(open)
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldPreload, setShouldPreload] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const logger = useLogger('Talents')

  // Use intersection observer to detect when the component is in view
  const [headerRef, isHeaderInView] = useIntersectionObserver<HTMLDivElement>(
    {
      rootMargin: '200px', // Load a bit before it comes into view
      threshold: 0,
    },
    `Talents-${name}`
  )

  const arrow = !isVisible ? <FaAngleDown /> : <FaAngleUp />

  // Effect to handle preloading when header is in view
  useEffect(() => {
    if (isHeaderInView && !shouldPreload) {
      console.log(`Talent ${name} is in view, preloading...`)
      setShouldPreload(true)
    }
  }, [isHeaderInView, shouldPreload, name, logger])

  // Handle animation and visibility states
  useEffect(() => {
    if (!isVisible) {
      // Start animation for closing
      setIsAnimating(true)

      // After animation completes, update state
      const timeoutId = setTimeout(() => {
        setIsAnimating(false)
      }, 500) // Match this with the CSS transition duration

      return () => clearTimeout(timeoutId)
    }
  }, [isVisible, name, logger])

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev)
  }

  // Memoize the talent tree to prevent re-rendering
  // It will only re-render if the talents string changes
  const memoizedTalentTree = useMemo(() => <MemoizedTalentTree talents={talents} />, [talents])

  // Determine if content should be shown (either visible or animating closed)
  const showContent = isVisible || isAnimating

  return (
    <div className={`mb-4 w-full ${styles.borderContainer}`} ref={containerRef}>
      <div
        ref={headerRef}
        onClick={toggleVisibility}
        className="flex h-auto cursor-pointer items-center justify-between px-2 "
      >
        <div className="my-2 flex select-none items-center text-left text-lg font-bold">
          <LuSwords className="mr-2" />
          {name}
        </div>
        {arrow}
      </div>
      <div
        className={`${styles.container} ${isVisible ? styles.show : styles.hide}`}
        style={{ backgroundColor: '#282828', width: '100%', overflow: 'hidden' }}
      >
        <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
          {/* Loading placeholder - shown before content is preloaded */}
          {showContent && !shouldPreload && (
            <div
              style={{
                width: '100%',
                height: '400px', // Fixed height for loading state
                backgroundColor: '#282828',
                borderRadius: '0.125rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: '#666',
                  fontSize: '14px',
                }}
              >
                Loading talents...
              </div>
            </div>
          )}

          {/* Always render the talent tree when in view, but control its visibility with CSS */}
          {shouldPreload && (
            <div
              style={{
                display: showContent ? 'block' : 'none',
                opacity: showContent ? 1 : 0,
              }}
            >
              {memoizedTalentTree}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

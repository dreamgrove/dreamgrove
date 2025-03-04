/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'
import React, { useEffect, useState, useRef } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { FaAngleUp } from 'react-icons/fa'
import { useLogger } from '@/components/hooks/useLogger'

import styles from './Talents.module.css'

export default function Talents({ name, talents, mimiron = false, open = false }) {
  const [isVisible, setIsVisible] = useState(open)
  const [loaded, setLoaded] = useState(false)
  const [iframeWidth, setIframeWidth] = useState(700)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef(null)
  const logger = useLogger('Talents')

  const arrow = !isVisible ? <FaAngleDown /> : <FaAngleUp />

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateWidth = () => {
        // First try to get width from our own container
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth
          logger.info(`Container width: ${containerWidth}px`)

          if (containerWidth > 0) {
            setIframeWidth(containerWidth)
            return
          }
        }

        // Fallback to main element if container width is not available
        const mainElement = document.getElementById('main')
        if (mainElement) {
          const width = mainElement.clientWidth
          logger.info(`Main element width: ${width}px`)
          setIframeWidth(width)
        }
      }

      // Add a small delay to ensure parent components have rendered
      const timeoutId = setTimeout(() => {
        updateWidth()
      }, 100)

      window.addEventListener('resize', updateWidth)

      return () => {
        clearTimeout(timeoutId)
        window.removeEventListener('resize', updateWidth)
      }
    }
  }, [isVisible, logger]) // Re-run when visibility changes

  // Handle animation and visibility states
  useEffect(() => {
    if (!isVisible) {
      // Start animation for closing
      setIsAnimating(true)

      // After animation completes, reset loaded state
      const timeoutId = setTimeout(() => {
        setLoaded(false)
        setIsAnimating(false)
      }, 500) // Match this with the CSS transition duration

      return () => clearTimeout(timeoutId)
    } else if (iframeLoaded) {
      // If iframe is already loaded, show it immediately
      logger.info(`Iframe for "${name}" was preloaded, showing immediately`)
      setTimeout(() => {
        setLoaded(true)
      }, 50)
    }
  }, [isVisible, iframeLoaded, name, logger])

  const toggleVisibility = () => {
    logger.info(`Toggling talents visibility for "${name}" to ${!isVisible}`)
    setIsVisible((prev) => !prev)
  }

  // Calculate a slightly larger width for the iframe to hide empty space
  const calculatedIframeWidth = Math.floor(iframeWidth * 1.01) // Increase by 1%

  // Function to handle iframe loading
  const handleIframeLoad = () => {
    logger.info(
      `Talents iframe for "${name}" loaded with width: ${calculatedIframeWidth}px (original: ${iframeWidth}px)`
    )
    setIframeLoaded(true)

    // Only update the loaded state if the section is visible
    if (isVisible) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setLoaded(true)
      }, 50)
    }
  }

  // Construct the iframe URL
  const iframeUrl = `https://${mimiron ? 'mimiron' : 'www'}.raidbots.com/simbot/render/talents/${talents}?bgcolor=282828&width=${calculatedIframeWidth}&level=80&mini=&hideHeader=true&locale=en_US`

  // Determine if content should be shown (either visible or animating closed)
  const showContent = isVisible || isAnimating

  return (
    <div className="mb-4 w-full border-y-2 border-black dark:border-[#c4c4c4] " ref={containerRef}>
      <div
        onClick={toggleVisibility}
        className="flex h-auto cursor-pointer items-center justify-between "
      >
        <div className="my-2 select-none font-bold">{name}</div>
        {arrow}
      </div>
      <div
        className={`${styles.container} ${isVisible ? styles.show : styles.hide}`}
        style={{ backgroundColor: 'black', width: '100%', overflow: 'hidden' }}
      >
        <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
          {/* Loading placeholder - shown while iframe is loading */}
          {showContent && !loaded && (
            <div
              style={{
                width: `${calculatedIframeWidth}px`,
                height: `${iframeWidth * 0.64}px`,
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

          {/* Always render the iframe but only show it when needed */}
          <div
            style={{
              display: showContent && loaded ? 'block' : 'none',
              position: 'relative',
            }}
          >
            <iframe
              ref={iframeRef}
              title={name}
              src={iframeUrl}
              width={`${calculatedIframeWidth}px`}
              height={iframeWidth * 0.64}
              className={`rounded-sm border-none bg-[#282828] ${styles['iframe-fade']} ${loaded ? styles['iframe-fade-in'] : ''}`}
              style={{
                marginLeft: '-5px', // Shift slightly left to hide left empty space if needed
                position: 'relative',
                left: '0',
                right: '-10px', // Allow overflow on the right
              }}
              onLoad={handleIframeLoad}
            />
          </div>

          {/* Hidden iframe for preloading - always present but invisible */}
          {!iframeLoaded && (
            <div
              style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                visibility: 'hidden',
              }}
            >
              <iframe
                src={iframeUrl}
                width="1"
                height="1"
                style={{ opacity: 0 }}
                onLoad={handleIframeLoad}
                title={`${name}-preload`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

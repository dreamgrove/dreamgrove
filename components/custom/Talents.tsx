/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'
import React, { useEffect, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { FaAngleUp } from 'react-icons/fa'

import styles from './Talents.module.css'

export default function Talents({ name, talents, mimiron = false, open = false }) {
  const [isVisible, setIsVisible] = useState(open)
  const [loaded, setLoaded] = useState(false)
  const [iframeWidth, setIframeWidth] = useState(700)

  const arrow = !isVisible ? <FaAngleDown /> : <FaAngleUp />

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateWidth = () => {
        const mainElement = document.getElementById('main')
        if (mainElement) {
          const width = mainElement.clientWidth
          setIframeWidth(width)
        }
      }

      updateWidth() // Set initial width
      window.addEventListener('resize', updateWidth)

      return () => {
        window.removeEventListener('resize', updateWidth)
      }
    }
  }, [])

  return (
    <div className="mb-4">
      <div
        onClick={() => setIsVisible((prev) => !prev)}
        className="flex h-auto cursor-pointer items-center justify-between border-b-2 border-black dark:border-white"
      >
        <div className="my-2 ">{name}</div>
        {arrow}
      </div>
      <div
        className={`${styles.container} ${isVisible ? styles.show : styles.hide}`}
        style={{ backgroundColor: 'black' }}
      >
        {isVisible && (
          <iframe
            title={name}
            src={`https://${mimiron ? 'mimiron' : 'www'}.raidbots.com/simbot/render/talents/${talents}?bgcolor=000000&width=${iframeWidth * 0.99}&level=70&mini=&hideHeader=true&locale=en_US&level=80`}
            width={iframeWidth}
            height={iframeWidth * 0.64}
            className="overflow-hidden rounded-sm border-none bg-black"
            style={{ visibility: loaded ? 'visible' : 'hidden' }}
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
    </div>
  )
}

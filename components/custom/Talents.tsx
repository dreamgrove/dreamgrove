/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'
import React, { useEffect, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { FaAngleUp } from 'react-icons/fa'

import styles from './Talents.module.css'

export default function Talents({ name, talents, mimiron = false }) {
  const [isVisible, setIsVisible] = useState(false)
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
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          height: 'auto',
          borderBottom: '2px solid white', // White underline
        }}
      >
        <h3 className="my-2" onClick={() => setIsVisible((prev) => !prev)}>
          {name}
        </h3>
        {arrow}
      </div>
      <div className={`${styles.container} ${isVisible ? styles.show : styles.hide}`}>
        <iframe
          title={name}
          src={`https://${mimiron ? 'mimiron' : 'www'}.raidbots.com/simbot/render/talents/${talents}?bgcolor=000000&width=${iframeWidth * 0.99}&level=70&mini=&hideHeader=true&locale=en_US`}
          width={iframeWidth}
          height={iframeWidth * 0.64}
          style={{
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
          }}
        />
      </div>
    </div>
  )
}

'use client'
import NextImage, { ImageProps } from 'next/image'
import { useState } from 'react'
import styles from './image.module.css'

const Image = ({ ...rest }: ImageProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  return (
    <div
      className={isFullScreen ? styles.fullScreen : ''}
      onClick={toggleFullScreen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleFullScreen()
        }
        if (e.key === 'Escape') {
          setIsFullScreen(false)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={isFullScreen ? 'Exit full screen image' : 'View image full screen'}
      aria-pressed={isFullScreen}
    >
      <NextImage {...rest} />
    </div>
  )
}

export default Image

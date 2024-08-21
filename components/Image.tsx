/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
    <div className={isFullScreen ? styles.fullScreen : ''} onClick={toggleFullScreen}>
      <NextImage {...rest} />
    </div>
  )
}

export default Image

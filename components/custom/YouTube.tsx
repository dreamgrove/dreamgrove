'use client'
import React, { useState, useEffect } from 'react'
import { useLogger } from '../hooks/useLogger'
import YouTubePlayer from 'react-youtube'
import type { YouTubeProps as ReactYouTubeProps, YouTubeEvent } from 'react-youtube'

interface YouTubeProps {
  id: string
  title?: string
  start?: number
  width?: number | string
  height?: number | string
  autoplay?: boolean
  className?: string
}

const YouTube: React.FC<YouTubeProps> = ({
  id,
  title = 'YouTube video',
  start = 0,
  width = '100%',
  height = '100%',
  autoplay = false,
  className = '',
}) => {
  const logger = useLogger('YouTube')
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (!id) {
      logger.error('YouTube component rendered without an ID')
      setError('Missing YouTube video ID')
      return
    }

    logger.info(`Rendering YouTube video: ${id}`)
  }, [id, logger])

  const onReady = (event: YouTubeEvent) => {
    logger.info(`YouTube video ready: ${id}`)
  }

  const onError = (event: YouTubeEvent) => {
    logger.error(`YouTube video error: ${id}, code: ${event.data}`)
    setFallbackMode(true)
  }

  const onPlay = (event: YouTubeEvent) => {
    logger.info(`YouTube video playing: ${id}`)
  }

  if (!isClient) {
    return null
  }

  if (error) {
    return (
      <div className="my-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <p className="font-medium">Error embedding YouTube video: {error}</p>
      </div>
    )
  }

  // Direct link to YouTube
  const youtubeUrl = `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}` : ''}`

  // Fallback to a simple iframe if react-youtube fails
  if (fallbackMode) {
    return (
      <div className={`relative my-4 w-full overflow-hidden rounded-lg ${className}`}>
        <div className="aspect-h-9 aspect-w-16">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ''}`}
            title={title}
            width={width}
            height={height}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Watch on YouTube
          </a>
        </div>
      </div>
    )
  }

  // Configure options for react-youtube
  const opts: ReactYouTubeProps['opts'] = {
    height: height,
    width: width,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: autoplay ? 1 : 0,
      start: start,
      modestbranding: 1,
      rel: 0,
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    },
  }

  return (
    <div className={`relative my-4 w-full overflow-hidden rounded-lg ${className}`}>
      <div className="aspect-h-9 aspect-w-16">
        <div className="absolute inset-0 h-full w-full">
          <YouTubePlayer
            videoId={id}
            title={title}
            opts={opts}
            onReady={onReady}
            onError={onError}
            onPlay={onPlay}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
          Watch on YouTube
        </a>
      </div>
    </div>
  )
}

export default YouTube

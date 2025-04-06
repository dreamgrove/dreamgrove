import { memo, useState, useEffect } from 'react'
import Image from 'next/image'

interface WowheadIconProps {
  id: string
  type: string
  name: string
  beta?: boolean
  url?: string
  size?: number
  noLink?: boolean
  noMargin?: boolean
}

// Client-side cache for icon filenames
const iconCache = new Map<string, string>()

function WowheadClientIcon({
  id,
  type,
  name,
  beta = false,
  url = '',
  size = 16,
  noLink = false,
  noMargin = false,
}: WowheadIconProps) {
  const [iconFilename, setIconFilename] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const whUrl = url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${id}`
  const cacheKey = `${type}-${id + name}${beta ? '-beta' : ''}`

  // Create a fallback element
  const fallbackImage = (
    <span
      className={`inline-block rounded-sm bg-gray-200 ${!noMargin && 'mr-1'}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title={`${name} (icon unavailable)`}
    />
  )

  // Load icon on mount
  useEffect(() => {
    // Skip if icon already loaded
    if (iconFilename) return

    // Check cache first
    if (iconCache.has(cacheKey)) {
      setIconFilename(iconCache.get(cacheKey) || null)
      return
    }

    const fetchIcon = async () => {
      if (typeof window === 'undefined') return

      setIsLoading(true)
      setError(false)

      try {
        // Use our dedicated API for fetching Wowhead data
        const apiUrl = `/api/wowhead-data?${new URLSearchParams({
          id: id || '',
          type,
          name: name || '',
          beta: beta ? 'true' : 'false',
          url: url || '',
        })}`

        const res = await fetch(apiUrl)

        if (!res.ok) {
          throw new Error(`Failed to fetch icon data: ${res.status}`)
        }

        const data = await res.json()

        if (data.icon) {
          // Cache the result
          iconCache.set(cacheKey, data.icon)
          setIconFilename(data.icon)
        } else {
          setError(true)
        }
      } catch (err) {
        console.warn(`Error fetching icon for ${type}=${id}:`, err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIcon()
  }, [id, type, beta, cacheKey, whUrl, iconFilename, name, url])

  // If we have an icon, render it
  const image = iconFilename ? (
    <Image
      src={`https://wow.zamimg.com/images/wow/icons/large/${iconFilename}.jpg`}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={`my-0 inline-block ${!noMargin && 'mr-1'}`}
    />
  ) : isLoading ? (
    // Loading state
    <span
      className={`inline-block rounded-sm bg-gray-700 ${!noMargin && 'mr-1'}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  ) : (
    // Error/fallback state
    fallbackImage
  )

  return noLink ? (
    image
  ) : (
    <a href={whUrl} className="inline">
      {image}
    </a>
  )
}

// Memoize the icon component for better performance
export default memo(WowheadClientIcon, (prevProps, nextProps) => {
  // Only re-render if important props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.type === nextProps.type &&
    prevProps.size === nextProps.size
  )
})

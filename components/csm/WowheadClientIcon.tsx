import { memo, useState, useEffect } from 'react'
import Image from 'next/image'
import { getWowheadInfo } from 'lib/wowhead-api'

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

// Client-side cache for icon filenames (only used for non-spell types)
const iconCache = new Map<string, string>()

function WowheadClientIcon({
  id,
  type,
  name,
  beta = false,
  url = '',
  size,
  noLink = false,
  noMargin = false,
}: WowheadIconProps) {
  const whUrl = url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${id}`
  const cacheKey = `${type}-${id + name}${beta ? '-beta' : ''}`

  // Spell icons are hosted on our own CDN keyed directly by spell id, so the URL is
  // deterministic and needs no Wowhead lookup. This mirrors the server WowheadIcon and
  // lets the preview show real icons immediately instead of round-tripping the API.
  const isHostedSpell = type === 'spell' && !!id

  const [iconFilename, setIconFilename] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // Hide the icon only if the browser actually fails to load it, matching the server
  // WowheadIconImage behaviour (a transient CDN blip shouldn't bake in a broken state).
  const [failed, setFailed] = useState(false)

  // Load icon filename on mount for non-spell types (items/npcs return a Wowhead icon slug).
  useEffect(() => {
    if (isHostedSpell) return
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

      try {
        const data = await getWowheadInfo({
          id: id || '',
          type,
          name: name || '',
          beta,
          url: url || '',
        })

        if (data.icon) {
          // Cache the result
          iconCache.set(cacheKey, data.icon)
          setIconFilename(data.icon)
        }
      } catch (err) {
        console.warn(`Error fetching icon for ${type}=${id}:`, err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIcon()
  }, [id, type, beta, cacheKey, isHostedSpell, iconFilename, name, url])

  const imageSrc = isHostedSpell
    ? `https://cdn.simcode.dev/${id}.jpg`
    : iconFilename
      ? `https://wow.zamimg.com/images/wow/icons/large/${iconFilename}.jpg`
      : null

  if (!size) {
    if (imageSrc && !failed) {
      return (
        <Image
          src={imageSrc}
          alt={`${name} icon`}
          fill={true}
          unoptimized
          onError={() => setFailed(true)}
        />
      )
    }
    return isLoading ? (
      <div className={`h-full w-full rounded-xs bg-neutral-800`} />
    ) : (
      <div
        className={`h-full w-full rounded-xs bg-gray-200`}
        title={`${name} (icon unavailable)`}
      />
    )
  }

  // Fallback element shown while loading or when no icon resolves
  const fallbackImage = (
    <span
      className={`inline-block rounded-xs bg-gray-200 ${!noMargin && 'mr-1'}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title={`${name} (icon unavailable)`}
    />
  )

  const image =
    imageSrc && !failed ? (
      <Image
        src={imageSrc}
        alt={`${name} icon`}
        height={size}
        width={size}
        unoptimized
        onError={() => setFailed(true)}
        className="my-0 inline-block"
      />
    ) : isLoading ? (
      <span
        className={`inline-block rounded-xs bg-gray-700 ${!noMargin && 'mr-1'}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    ) : (
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

import Image from 'next/image'
import fetch from 'node-fetch'

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

export default async function WowheadIcon({
  id,
  type,
  name,
  beta = false,
  url = '',
  size = 16,
  noLink = false,
  noMargin = false,
}: WowheadIconProps) {
  const whUrl = url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${id}`

  // Create a fallback image element
  const fallbackImage = (
    <span
      className={`inline-block rounded-sm bg-gray-200 ${!noMargin && 'mr-1'}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title={`${name} (icon unavailable)`}
    />
  )

  try {
    const res = await fetch(whUrl, { timeout: 5000 })
    const text = await res.text()
    const regex = new RegExp(`"${id}":\\{"name_enus":"[^"]+".*?,"icon":"([^"]+)"`)
    const match = regex.exec(text)

    if (match && match[1]) {
      const iconFilename = match[1]
      const imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconFilename}.jpg`

      const image = (
        <Image
          src={imageUrl}
          alt={`${name} icon`}
          width={size}
          height={size}
          className={`my-0 inline-block ${!noMargin && 'mr-1'}`}
        />
      )

      return noLink ? (
        image
      ) : (
        <a href={whUrl} className="inline">
          {image}
        </a>
      )
    }
  } catch (error: any) {
    console.warn(`Error fetching icon for ${type}=${id}: ${error.message || 'Unknown error'}`)
  }

  // Return fallback if fetch fails or no icon is found
  return noLink ? (
    fallbackImage
  ) : (
    <a href={whUrl} className="inline">
      {fallbackImage}
    </a>
  )
}

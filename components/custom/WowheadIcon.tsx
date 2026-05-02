import { fetchWowheadData } from 'app/api/wowhead-data/server-function'
import Image from 'next/image'

interface WowheadIconProps {
  id: string
  type?: string
  name: string
  beta?: boolean
  url?: string
  noLink?: boolean
  noMargin?: boolean
  iconId?: string
  iconSize?: number
  fill?: boolean
}

async function iconExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      next: { revalidate: 86400 },
    })
    return res.ok
  } catch {
    return false
  }
}

export default async function WowheadIcon({
  id,
  type = 'spell',
  name,
  beta = false,
  url = '',
  iconSize = 16,
  noLink = false,
  noMargin = false,
  iconId,
  fill = false,
}: WowheadIconProps) {
  const whUrl = url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${id}`

  let imageUrl = ''
  let hasImage = false

  if (process.env.NODE_ENV === 'test') {
    imageUrl = 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_starfall.jpg'
    hasImage = true
  } else if (type === 'spell') {
    imageUrl = `https://cdn.simcode.dev/${id}.jpg`
    hasImage = await iconExists(imageUrl)
  } else {
    if (!iconId) {
      try {
        const data = await fetchWowheadData({
          id,
          type,
          name,
          beta,
          url,
        })
        iconId = data.icon
      } catch (error: any) {
        console.warn(`Error fetching icon for ${type}=${id}: ${error.message || 'Unknown error'}`)
      }
    }
    if (iconId) {
      imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`
      hasImage = await iconExists(imageUrl)
    }
  }
  if (!hasImage) {
    return null
  }

  const image = (
    <Image
      src={imageUrl}
      alt={`${name} icon`}
      width={fill ? undefined : iconSize}
      height={fill ? undefined : iconSize}
      fill={fill}
      className={fill ? 'object-contain' : `my-0 inline-block ${!noMargin && 'mr-1'}`}
    />
  )

  return noLink ? (
    <span className="relative inline-block aspect-square h-full w-auto shrink-0">{image}</span>
  ) : (
    <a href={whUrl} className="relative inline-block aspect-square h-full w-auto shrink-0">
      {image}
    </a>
  )
}

import { fetchWowheadData } from 'app/api/wowhead-data/server-function'
import { buildWowheadUrl } from 'app/api/wowhead-data/utils'
import WowheadIconImage from './WowheadIconImage'
import type { PageLocale } from '@/lib/pageLocale'

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
  // Forces the href host when the name carries no language signal (Timeline)
  locale?: PageLocale
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
  locale,
}: WowheadIconProps) {
  const whUrl = url !== '' ? url : buildWowheadUrl(type, id, name, beta, locale)

  let imageUrl = ''

  if (process.env.NODE_ENV === 'test') {
    imageUrl = 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_starfall.jpg'
  } else if (type === 'spell') {
    imageUrl = `https://cdn.simcode.dev/${id}.jpg`
  } else {
    if (!iconId) {
      try {
        const data = await fetchWowheadData({ id, type, name, beta, url })
        iconId = data.icon
      } catch (error: any) {
        console.warn(`Error fetching icon for ${type}=${id}: ${error.message || 'Unknown error'}`)
      }
    }
    if (iconId) {
      imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`
    }
  }

  // No resolvable icon (e.g. an item/talent Wowhead returned no icon for) -> render nothing.
  if (!imageUrl) {
    return null
  }

  const image = (
    <WowheadIconImage
      src={imageUrl}
      alt={`${name} icon`}
      iconSize={iconSize}
      fill={fill}
      noMargin={noMargin}
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
